export function markPerformance(name: string) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  if (typeof performance === 'undefined') {
    return;
  }
  performance.mark(name);
}
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  if (typeof performance === 'undefined') {
    return;
  }
  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name);
    const latestEntry = entries.at(-1);
    if (!latestEntry) {
      return;
    }
    console.log(`[performance] ${name}: ${latestEntry.duration.toFixed(2)}ms`);
  } catch (error) {
    console.error('Failed to measure performance:', error);
  }
}

export function observeLongTasks() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  if (typeof PerformanceObserver === 'undefined') {
    return;
  }
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn(`[performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
      });
    });
    observer.observe({
      type: 'longtask',
      buffered: true,
    });
    return () => {
      observer.disconnect();
    };
  } catch (error) {
    console.error('Failed to observe long tasks:', error);
  }
}
