import { EventEmitter } from 'events'
import { onUnmounted } from 'vue'

class Events extends EventEmitter {
  von(eventName: string, listener: (...args: any[]) => void) {
    this.on(eventName, listener)
    onUnmounted(() => {
      this.off(eventName, listener)
    })
  }

  vonce(eventName: string, listener: (...args: any[]) => void) {
    this.once(eventName, listener)
    onUnmounted(() => {
      this.off(eventName, listener)
    })
  }
}

export const useEvent = new Events()

export default Events
