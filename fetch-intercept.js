
const getMostAccessedUrlsByPage = (data) => {
    const urlAccessCountByPage = {};

    data.forEach(item => {
        const { page, url } = item;

        if (!urlAccessCountByPage[page]) {
            urlAccessCountByPage[page] = {};
        }

        if (!urlAccessCountByPage[page][url]) {
            urlAccessCountByPage[page][url] = 0;
        }

        urlAccessCountByPage[page][url]++;
    });

    const result = {};

    for (const page in urlAccessCountByPage) {
        const urlCounts = urlAccessCountByPage[page];
        let maxCount = 0;
        let mostAccessedUrls = [];

        for (const url in urlCounts) {
            const count = urlCounts[url];

            if (count > maxCount) {
                maxCount = count;
                mostAccessedUrls = [{ url, count }];
            } else if (count === maxCount) {
                mostAccessedUrls.push({ url, count });
            }
        }

        result[page] = {
            mostAccessedUrls,
            totalUrls: Object.keys(urlCounts).length,
            allUrls: Object.entries(urlCounts).map(([url, count]) => ({ url, count }))
                .sort((a, b) => b.count - a.count)
        };
    }

    return result;
}

const getPageAccessStats = (data) => {
    const pageAccessCount = {};

    data.forEach(item => {
        const { page } = item;

        if (!pageAccessCount[page]) {
            pageAccessCount[page] = 0;
        }

        pageAccessCount[page]++;
    });

    return Object.entries(pageAccessCount)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count);
}



// Array to store fetch request details
let fetchRequests = [];

// Listener for install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Listener for activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    // Ensure the service worker takes control immediately
    event.waitUntil(self.clients.claim());
});

let currentPage;

// Intercept and log fetch requests
self.addEventListener('fetch', async (event) => {
    const cookie = await self.cookieStore.get('current-page');

    console.log('Cookie value:', cookie.value);
    currentPage = cookie.value;

    // Create a request details object
    const requestDetails = {
        page: currentPage,
        url: event.request.url,
        method: event.request.method,
        timestamp: new Date().toISOString(),
        type: event.request.destination || 'unknown'
    };

    // Store the request details
    fetchRequests.push(requestDetails);

    const statistics = getMostAccessedUrlsByPage(fetchRequests);
    console.log('Page Access Statistics:', statistics);

    // Limit the number of stored requests (optional)
    if (fetchRequests.length > 100) {
        fetchRequests.shift(); // Remove the oldest request
    }



    // Optional: Broadcast the updated request list to all clients
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'FETCH_REQUESTS_UPDATED',
                requests: fetchRequests
            });
        });
    });

    // Continue with the original fetch
    return fetch(event.request);
});

// Listener for messages from the main page
self.addEventListener('message', (event) => {
    // Handle requests to retrieve stored fetch requests
    if (event.data && event.data.type === 'GET_FETCH_REQUESTS') {
        event.source.postMessage({
            type: 'FETCH_REQUESTS',
            requests: fetchRequests
        });
    }

    // Handle request to clear fetch requests
    if (event.data && event.data.type === 'CLEAR_FETCH_REQUESTS') {
        fetchRequests = [];
        event.source.postMessage({
            type: 'FETCH_REQUESTS_CLEARED'
        });
    }
});


