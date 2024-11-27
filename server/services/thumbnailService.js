import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs/promises'

class ThumbnailService {
    constructor() {
        this.coverDir = path.join(process.cwd(), 'public', 'covers')
    }

    async ensureCoverDir() {
        try {
            await fs.access(this.coverDir)
        } catch {
            await fs.mkdir(this.coverDir, { recursive: true })
        }
    }

    async generateVideoThumbnail(videoPath, videoId) {
        await this.ensureCoverDir()
        const outputPath = path.join(this.coverDir, `${videoId}.jpg`)

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .screenshot({
                    timestamps: ['10%'], // 从视频 10% 处截图
                    filename: `${videoId}.jpg`,
                    folder: this.coverDir,
                    size: '480x?'  // 保持宽高比，宽度设为 480px
                })
                .on('end', () => resolve(`/covers/${videoId}.jpg`))
                .on('error', reject)
        })
    }
}

export const thumbnailService = new ThumbnailService()