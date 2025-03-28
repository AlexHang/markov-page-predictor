if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/fetch-intercept.js")
      .then((registration) => {
        console.log(
          "Service Worker registered successfully:",
          registration
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "FETCH_REQUESTS_UPDATED") {
        console.log("Fetch requests updated:", event.data.requests);
        // You can update UI or perform analysis here
      }
    });
  }

  // Function to get stored fetch requests
  function getFetchRequests() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "GET_FETCH_REQUESTS",
      });
    }
  }

  // Function to clear stored fetch requests
  function clearFetchRequests() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_FETCH_REQUESTS",
      });
    }
  }

  // Listen for responses from the service worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.type === "FETCH_REQUESTS") {
      console.log("Received fetch requests:", event.data.requests);
      // Perform analysis or display requests
    }

    if (event.data.type === "FETCH_REQUESTS_CLEARED") {
      console.log("Fetch requests have been cleared");
    }
  });