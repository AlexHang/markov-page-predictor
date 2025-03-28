// fetchTracker.js - Service Worker for Tracking Fetch Requests

// Name of the cache to store fetch request information
const CACHE_NAME = 'fetch-request-tracker-v1';

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

// Intercept and log fetch requests
self.addEventListener('fetch', (event) => {
    console.log(self.location.href);
    // Create a request details object
    const requestDetails = {
        url: event.request.url,
        method: event.request.method,
        timestamp: new Date().toISOString(),
        type: event.request.destination || 'unknown'
    };

    // Store the request details
    fetchRequests.push(requestDetails);

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