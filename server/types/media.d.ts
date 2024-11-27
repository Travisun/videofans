interface Category {
    id: string
    name: string
    parentId: string | null
    children?: Category[]
    videos?: Video[]
    cover?: string  // 分类封面
    description?: string
}

interface Video {
    id: string
    name: string
    url: string
    cover?: string  // 视频封面
    duration?: number
    categoryId: string
    createdAt: Date
    updatedAt: Date
    metadata?: {
        resolution?: string
        bitrate?: string
        codec?: string
    }
}