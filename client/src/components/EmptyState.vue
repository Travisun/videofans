<!-- client/src/components/EmptyState.vue -->
<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <Card class="mb-8">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <PlayCircle class="h-6 w-6" />
          视频播放器
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="bg-gray-100 rounded-lg p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
            <FileVideo2 class="w-full h-full" />
          </div>
          <h3 class="text-lg font-semibold mb-2">还没有视频内容</h3>
          <p class="text-gray-600 mb-4">
            请在 server/medias/ 目录下添加视频文件
          </p>
          <div class="text-sm text-gray-500">
            <p class="mb-2">建议的目录结构：</p>
            <pre class="bg-white p-4 rounded text-left text-xs">
medias/
├── 动作电影/
│   ├── movie1.mp4
│   └── movie2.mp4
└── 喜剧电影/
    ├── funny1.mp4
    └── funny2.mp4</pre>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 示例专辑列表 -->
    <div class="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">示例专辑</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 border rounded-lg bg-gray-50">
              <h3 class="font-medium mb-2">动作电影</h3>
              <p class="text-sm text-gray-500">暂无视频</p>
            </div>
            <div class="p-4 border rounded-lg bg-gray-50">
              <h3 class="font-medium mb-2">喜剧电影</h3>
              <p class="text-sm text-gray-500">暂无视频</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { PlayCircle, FileVideo2 } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
</script>

<style scoped>
.pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>