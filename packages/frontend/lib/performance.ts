// Simple performance monitoring utility
export class PerformanceMonitor {
  private static timers = new Map<string, number>();

  static start(label: string) {
    this.timers.set(label, performance.now());
  }

  static end(label: string) {
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.timers.delete(label);
      return duration;
    }
    return 0;
  }

  static measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    return fn().finally(() => this.end(label));
  }
}