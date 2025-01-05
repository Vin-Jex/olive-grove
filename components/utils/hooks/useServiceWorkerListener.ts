import { useEffect, useState } from "react";

const useServiceWorkerListener = () => {
  const [isForbiddenError, setIsForbiddenError] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (navigator.serviceWorker) {
      const messageListener = (event: MessageEvent) => {
        if (event.data && event.data.type === "FORBIDDEN_ERROR") {
          setIsForbiddenError(true);
        } else {
          setIsForbiddenError(null);
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
