import express from 'express'
import cors from 'cors'
import { getMediaScanner , MediaScanner} from './services/mediaScanner.js'
import { videoService } from './services/videoService.js'
import { configureMediaDirectories } from './services/mediaScanner.js'
import { networkInterfaces, formatNetworkAddresses } from './services/networkInterfaces.js'


const app = express()
app.use(cors())
app.use(express.json())

// 初始化视频服务
videoService.initialize()

// 获取媒体库列表
app.get('/api/albums', async (req, res) => {
    try {
        const defaultPath = process.cwd() // 或者使用配置的默认路径
        const result = await MediaScanner.scanDirectoryRecursively(defaultPath)
        // 将结果包装成数组形式
        const albums = result ? [result] : []
        res.json(albums)
    } catch (error) {
        console.error('Error getting albums:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// 获取完整的目录结构
app.get('/api/directory', async (req, res) => {
    try {
        const scanner = await getMediaScanner()
        const result = await scanner.scan()
        res.json(result)
    } catch (error) {
        console.error('Error getting directory structure:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// 视频流处理
app.get('/media/*', async (req, res) => {
    try {
        const videoUrl = req.url
        const video = await videoService.findVideoByUrl(videoUrl)

        if (!video) {
            return res.status(404).send('Video not found')
        }

        const range = req.headers.range
        const { file, head } = await videoService.getVideoStream(video.path, range)

        res.writeHead(range ? 206 : 200, head)
        file.pipe(res)
    } catch (error) {
        console.error('Error streaming video:', error)
        res.status(500).send('Internal server error')
    }
})

// 配置管理接口
app.get('/api/config/directories', async (req, res) => {
    try {
        const dirs = await configureMediaDirectories.list()
        res.json(dirs)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.post('/api/config/directories', async (req, res) => {
    try {
        const { path, name } = req.body
        await configureMediaDirectories.add(path, name)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.delete('/api/config/directories', async (req, res) => {
    try {
        const { path } = req.body
        await configureMediaDirectories.remove(path)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.put('/api/config/scan-interval', async (req, res) => {
    try {
        const { interval } = req.body
        await configureMediaDirectories.updateScanInterval(interval)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

const port = 3299
app.listen(port, '0.0.0.0', () => {
    // 获取所有网络接口
    const interfaces = networkInterfaces()
    console.log(interfaces)
    console.log('Server is running at:')

    console.log(formatNetworkAddresses(interfaces, port))
})