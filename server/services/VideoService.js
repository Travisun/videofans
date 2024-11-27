import fs from 'fs'
import path from 'path'
import { getMediaScanner } from './mediaScanner.js'

export class VideoService {
    constructor() {
        this.scanner = null
    }

    async initialize() {
        this.scanner = await getMediaScanner()
    }

    async getVideoStream(videoPath, range) {
        const stat = await fs.promises.stat(videoPath)
        const fileSize = stat.size

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
            const chunksize = (end - start) + 1
            const file = fs.createReadStream(videoPath, { start, end })

            return {
                file,
                head: {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                }
            }
        } else {
            const file = fs.createReadStream(videoPath)
            return {
                file,
                head: {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                }
            }
        }
    }

    async findVideoByUrl(url) {
        const scanned = await this.scanner.scan()
        let video = null

        const searchInDirectory = (dir) => {
            for (const v of dir.videos) {
                if (v.url === url) {
                    video = v
                    return true
                }
            }

            if (dir.subdirectories) {
                for (const subDir of dir.subdirectories) {
                    if (searchInDirectory(subDir)) {
                        return true
                    }
                }
            }
            return false
        }

        for (const library of scanned) {
            if (searchInDirectory(library)) {
                break
            }
        }

        return video
    }
}

export const videoService = new VideoService()