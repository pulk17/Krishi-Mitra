export class LoadingManager {
  private loadingStates = new Map<string, boolean>()
  private timers = new Map<string, NodeJS.Timeout>()
  private readonly MIN_LOADING_DURATION = 200

  showLoading(operation: string, minDuration = this.MIN_LOADING_DURATION): void {
    // Clear any existing timer
    const existingTimer = this.timers.get(operation)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    this.loadingStates.set(operation, true)

    // Set minimum display duration
    const timer = setTimeout(() => {
      this.timers.delete(operation)
    }, minDuration)
    
    this.timers.set(operation, timer)
  }

  hideLoading(operation: string): void {
    const timer = this.timers.get(operation)
    
    if (timer) {
      // Wait for minimum duration before hiding
      setTimeout(() => {
        this.loadingStates.set(operation, false)
      }, 0)
    } else {
      this.loadingStates.set(operation, false)
    }
  }

  isLoading(operation?: string): boolean {
    if (operation) {
      return this.loadingStates.get(operation) || false
    }
    // Check if any operation is loading
    return Array.from(this.loadingStates.values()).some(loading => loading)
  }

  cleanup(): void {
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
    this.loadingStates.clear()
  }
}

export const loadingManager = new LoadingManager()