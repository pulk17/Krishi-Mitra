import { LoadingManager } from '../LoadingManager'

describe('LoadingManager', () => {
  let manager: LoadingManager

  beforeEach(() => {
    manager = new LoadingManager()
    jest.useFakeTimers()
  })

  afterEach(() => {
    manager.cleanup()
    jest.useRealTimers()
  })

  describe('showLoading', () => {
    it('should set loading state to true', () => {
      manager.showLoading('test-operation')
      expect(manager.isLoading('test-operation')).toBe(true)
    })

    it('should handle multiple operations', () => {
      manager.showLoading('operation-1')
      manager.showLoading('operation-2')
      
      expect(manager.isLoading('operation-1')).toBe(true)
      expect(manager.isLoading('operation-2')).toBe(true)
      expect(manager.isLoading()).toBe(true)
    })
  })

  describe('hideLoading', () => {
    it('should set loading state to false', () => {
      manager.showLoading('test-operation')
      manager.hideLoading('test-operation')
      
      expect(manager.isLoading('test-operation')).toBe(false)
    })

    it('should respect minimum duration', () => {
      manager.showLoading('test-operation', 100)
      manager.hideLoading('test-operation')
      
      // Should still be loading due to minimum duration
      expect(manager.isLoading('test-operation')).toBe(true)
      
      // After minimum duration passes
      jest.advanceTimersByTime(100)
      expect(manager.isLoading('test-operation')).toBe(false)
    })
  })

  describe('cleanup', () => {
    it('should clear all timers and states', () => {
      manager.showLoading('operation-1')
      manager.showLoading('operation-2')
      
      manager.cleanup()
      
      expect(manager.isLoading()).toBe(false)
      expect(manager.isLoading('operation-1')).toBe(false)
      expect(manager.isLoading('operation-2')).toBe(false)
    })
  })
})