import path from 'path'
import fs from 'fs/promises'
import os from 'os'

class MediaScanner {
    constructor(config) {
        this.config = {
            mediaDirs: [
                {
                    path: path.join(process.cwd(), 'medias'),
                    name: '默认媒体库'
                }
            ],
            scanInterval: 3600000, // 1 hour
            ...config
        }

        this.videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.m4v', '.webm']
        this.scanTimer = null
        this.currentScan = null
        this.lastScanResult = null
    }

    async scan() {
        // 如果已经在扫描中，返回上次的结果
        if (this.currentScan) {
            return this.lastScanResult || await this.currentScan
        }

        try {
            this.currentScan = this._performScan()
            const result = await this.currentScan
            this.lastScanResult = result
            return result
        } finally {
            this.currentScan = null
        }
    }

    async _performScan() {
        const libraries = []

        for (const mediaDir of this.config.mediaDirs) {
            try {
                await fs.access(mediaDir.path)
                const dirContent = await MediaScanner.scanDirectoryRecursively(mediaDir.path)
                if (dirContent) {
                    libraries.push({
                        name: mediaDir.name,
                        path: mediaDir.path,
                        subdirectories: dirContent.subdirectories,
                        videos: dirContent.videos
                    })
                }
            } catch (error) {
                console.warn(`Warning: Unable to access media directory ${mediaDir.path}:`, error.message)
            }
        }

        return libraries
    }

    // 将方法改为静态方法
    static async scanDirectoryRecursively(dirPath, depth = 0) {
        try {
            const items = await fs.readdir(dirPath, { withFileTypes: true })
            const result = {
                path: dirPath,
                name: path.basename(dirPath),
                subdirectories: [],
                videos: []
            }

            for (const item of items) {
                const fullPath = path.join(dirPath, item.name)

                if (item.isDirectory()) {
                    const subDirContent = await MediaScanner.scanDirectoryRecursively(fullPath, depth + 1)
                    if (subDirContent && (subDirContent.videos.length > 0 || subDirContent.subdirectories.length > 0)) {
                        result.subdirectories.push(subDirContent)
                    }
                } else if (MediaScanner.isVideoFile(item.name)) {
                    try {
                        const stats = await fs.stat(fullPath)
                        result.videos.push({
                            name: path.parse(item.name).name,
                            fileName: item.name,
                            url: MediaScanner.generateVideoUrl(fullPath),
                            size: stats.size,
                            modifiedTime: stats.mtime,
                            path: fullPath
                        })
                    } catch (error) {
                        console.error(`Error processing video file ${fullPath}:`, error)
                    }
                }
            }

            // 如果目录为空，返回null
            if (result.videos.length === 0 && result.subdirectories.length === 0) {
                return null
            }

            return result
        } catch (error) {
            console.error(`Error scanning directory ${dirPath}:`, error)
            return null
        }
    }

    static generateVideoUrl(fullPath) {
        const relativePath = path.relative(process.cwd(), fullPath)
        return `/media/${encodeURIComponent(relativePath.replace(/\\/g, '/'))}`
    }

    static isVideoFile(filename) {
        const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.m4v', '.webm']
        return videoExtensions.includes(path.extname(filename).toLowerCase())
    }

    startAutoScan() {
        if (this.scanTimer) {
            clearInterval(this.scanTimer)
        }

        // Initial scan
        this.scan().catch(console.error)

        // Set up periodic scan
        this.scanTimer = setInterval(() => {
            this.scan().catch(console.error)
        }, this.config.scanInterval)
    }

    stopAutoScan() {
        if (this.scanTimer) {
            clearInterval(this.scanTimer)
            this.scanTimer = null
        }
    }
}

export {
    MediaScanner // 导出类本身
}

// 获取配置文件路径
function getConfigPath() {
    switch (process.platform) {
        case 'win32':
            return path.join(process.env.APPDATA, 'MediaScanner', 'config.json')
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', 'MediaScanner', 'config.json')
        default: // Linux 和其他 Unix 系统
            return path.join(os.homedir(), '.config', 'mediascanner', 'config.json')
    }
}

// 确保配置目录存在
async function ensureConfigDir() {
    const configPath = getConfigPath()
    const configDir = path.dirname(configPath)

    try {
        await fs.mkdir(configDir, { recursive: true })
    } catch (error) {
        console.error('Error creating config directory:', error)
    }
}

// 加载配置文件
async function loadConfig() {
    const configPath = getConfigPath()

    try {
        await ensureConfigDir()
        const configData = await fs.readFile(configPath, 'utf8')
        return JSON.parse(configData)
    } catch (error) {
        // 如果配置文件不存在或无法读取，返回默认配置
        const defaultConfig = {
            mediaDirs: [
                {
                    path: path.join(process.cwd(), 'medias'),
                    name: '默认媒体库'
                }
            ],
            scanInterval: 3600000
        }

        // 保存默认配置
        await saveConfig(defaultConfig)
        return defaultConfig
    }
}

// 保存配置到文件
async function saveConfig(config) {
    const configPath = getConfigPath()
    await ensureConfigDir()
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8')
}

// 单例实例
let scannerInstance = null

// 获取扫描器实例
export async function getMediaScanner() {
    if (!scannerInstance) {
        const config = await loadConfig()
        scannerInstance = new MediaScanner(config)
        scannerInstance.startAutoScan()
    }
    return scannerInstance
}

// 配置管理接口
export const configureMediaDirectories = {
    async add(dirPath, name) {
        const config = await loadConfig()
        const exists = config.mediaDirs.some(dir => dir.path === dirPath)

        if (!exists) {
            config.mediaDirs.push({ path: dirPath, name })
            await saveConfig(config)

            if (scannerInstance) {
                scannerInstance.config = config
                await scannerInstance.scan()
            }
        }
    },

    async remove(dirPath) {
        const config = await loadConfig()
        config.mediaDirs = config.mediaDirs.filter(dir => dir.path !== dirPath)
        await saveConfig(config)

        if (scannerInstance) {
            scannerInstance.config = config
            await scannerInstance.scan()
        }
    },

    async list() {
        const config = await loadConfig()
        return config.mediaDirs
    },

    async updateScanInterval(interval) {
        const config = await loadConfig()
        config.scanInterval = interval
        await saveConfig(config)

        if (scannerInstance) {
            scannerInstance.config = config
            scannerInstance.stopAutoScan()
            scannerInstance.startAutoScan()
        }
    }
}