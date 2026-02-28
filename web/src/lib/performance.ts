// Performance Debug Utilities
// Use in console: window.perfLog() to see timing data

interface PerfEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceLogger {
  private entries: PerfEntry[] = [];
  private enabled: boolean = true;

  start(label: string) {
    if (!this.enabled) return;
    const entry: PerfEntry = {
      name: label,
      startTime: performance.now(),
    };
    this.entries.push(entry);
    console.log(`[PERF] Start: ${label}`);
  }

  end(label: string) {
    if (!this.enabled) return;
    const entry = this.entries.find(e => e.name === label && !e.endTime);
    if (entry) {
      entry.endTime = performance.now();
      entry.duration = entry.endTime - entry.startTime;
      console.log(`[PERF] End: ${label} - ${entry.duration.toFixed(2)}ms`);
    }
  }

  log(label: string) {
    if (!this.enabled) return;
    console.log(`[PERF] ${label} - ${performance.now().toFixed(2)}ms`);
  }

  getReport(): string {
    const report = this.entries
      .filter(e => e.duration !== undefined)
      .sort((a, b) => b.duration! - a.duration!)
      .map(e => `${e.name}: ${e.duration?.toFixed(2)}ms`)
      .join('\n');
    return report || 'No entries';
  }

  clear() {
    this.entries = [];
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }
}

export const perf = new PerformanceLogger();

// React hook for measuring render time
export function useRenderTime(label: string) {
  if (typeof window !== 'undefined') {
    perf.log(`${label} rendered`);
  }
}

// Hook to track component mount time
export function useMountTime(label: string) {
  if (typeof window !== 'undefined') {
    perf.log(`${label} mounted`);
  }
}

// Make available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).perfLog = () => {
    console.log('\n=== PERFORMANCE REPORT ===\n');
    console.log(perf.getReport());
    console.log('\n=========================\n');
  };
  (window as any).perfClear = () => {
    perf.clear();
    console.log('[PERF] Log cleared');
  };
  (window as any).perfDisable = () => {
    perf.disable();
    console.log('[PERF] Logging disabled');
  };
  (window as any).perfEnable = () => {
    perf.enable();
    console.log('[PERF] Logging enabled');
  };
}
