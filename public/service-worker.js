self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if the response status is 403 and notify the client
        if (response.status === 403) {
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              // Send a message to the client indicating a 403 error occurred
              client.postMessage({
                type: "FORBIDDEN_ERROR",
                message: "403 Forbidden error detected.",
              });
            });
          });
        }
        // Return the response regardless of the status code
        return response;
      })
      .catch((error) => {
        console.error("Fetch error:", error);

        // Notify the client about the 408 timeout error
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "NETWORK_ERROR",
              message: "408 Request Timeout - Network error occurred.",
            });
          });
        });

        // Return a JSON response for the 408 status code
        return new Response(
          JSON.stringify({
            status: 408,
            message: "Request timed out. Please try again.",
            data: null,
            error: "NetworkError",
          }),
          {
            status: 408,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      })
  );
});
