import { useEffect, useRef } from "react";

const useInfiniteScroll = ({
  fetchData,
  hasMore = false,
  lastObservedIndex,
  isLoading,
}) => {
  const observerRef = useRef();
  const hasFetched = useRef(false);
  useEffect(() => {
    const options = {
      root: null, // Use the viewport
      rootMargin: "0px",
      threshold: 1.0, // Trigger when 100% of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        console.log("0___0 ", lastObservedIndex);
        console.log("  _");
        fetchData(); // Call the fetch function when the last element is visible
      } else if (!entry.isIntersecting) {
        hasFetched.current = false; // Reset if not intersecting, allowing fetch again
      } else if (isLoading) {
        console.log("Already loading for ", lastObservedIndex);
      } else {
        console.log("already done pagination for ", lastObservedIndex);
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current); // Observe the last element
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current); // Clean up the observer
      }
    };
  }, [fetchData, hasMore, lastObservedIndex]);

  return observerRef; 
};

export default useInfiniteScroll;
