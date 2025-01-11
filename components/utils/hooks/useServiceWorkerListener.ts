import { useEffect, useLayoutEffect, useState } from "react";

const useServiceWorkerListener = () => {
  const [isForbiddenError, setIsForbiddenError] = useState(false);

  useLayoutEffect(() => {
    if (navigator.serviceWorker) {
      const messageListener = (event: MessageEvent) => {
        if (event.data && event.data.type === "FORBIDDEN_ERROR") {
          setIsForbiddenError(true);
        }
      };

      navigator.serviceWorker.addEventListener("message", messageListener);

      // Clean up the event listener
      return () => {
        navigator.serviceWorker.removeEventListener("message", messageListener);
      };
    }
  }, []);

  return isForbiddenError;
};

export default useServiceWorkerListener;
