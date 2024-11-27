class VideoMemoryService {
    constructor() {
        this.STORAGE_KEY = 'video_memory'
    }

    saveProgress(videoId, currentTime) {
        try {
            const memory = this.getAllMemory()
            memory[videoId] = {
                currentTime,
                timestamp: Date.now()
            }
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memory))
        } catch (error) {
            console.error('Failed to save video progress:', error)
        }
    }

    getProgress(videoId) {
        try {
            const memory = this.getAllMemory()
            return memory[videoId]?.currentTime || 0
        } catch (error) {
            console.error('Failed to get video progress:', error)
            return 0
        }
    }

    getAllMemory() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY)
            return data ? JSON.parse(data) : {}
        } catch (error) {
            console.error('Failed to get video memory:', error)
            return {}
        }
    }

    cleanup() {
        try {
            const memory = this.getAllMemory()
            const now = Date.now()
            const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

            Object.keys(memory).forEach(videoId => {
                if (now - memory[videoId].timestamp > THIRTY_DAYS) {
                    delete memory[videoId]
                }
            })

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memory))
        } catch (error) {
            console.error('Failed to cleanup video memory:', error)
        }
    }
}

export const videoMemory = new VideoMemoryService()