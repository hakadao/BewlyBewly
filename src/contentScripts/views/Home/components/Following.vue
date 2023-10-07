<script setup lang="ts">
import type { Ref } from 'vue'
import type { AppVideoModel, VideoModel } from './types'
import emitter from '~/utils/mitt'
import { settings } from '~/logic'

const videoList = reactive<VideoModel[]>([])
const appVideoList = reactive<AppVideoModel[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const offset = ref<string>()
const updateBaseline = ref<string>()

watch(() => settings.value.recommendationMode, (newValue, oldValue) => {
  videoList.length = 0
  appVideoList.length = 0
  if (newValue === 'web')
    getRecommendVideos()
})

onMounted(async () => {
  // Delay by 0.2 seconds to obtain the `settings.value.recommendationMode` value
  // otherwise the `settings.value.recommendationMode` value will be undefined
  // i have no idea to fix that...
  setTimeout(async () => {
    getRecommendVideos()
  }, 200)

  emitter.off('reachBottom')
  emitter.on('reachBottom', async () => {
    if (!isLoading.value)
      getRecommendVideos()
  })
})

onUnmounted(() => {
  emitter.off('reachBottom')
})

async function getRecommendVideos() {
  isLoading.value = true
  try {
    const response = await browser.runtime.sendMessage({
      contentScriptQuery: 'getMoments',
      type: 'video',
      offset: offset.value,
      updateBaseline: updateBaseline.value,
    })

    if (response.code === 0) {
      const resData = [] as VideoModel[]

      response.data.item.forEach((item: VideoModel) => {
        resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!videoList.length) {
        Object.assign(videoList, resData)
      }
      else {
        // else we concat the new data to the old data
        Object.assign(videoList, videoList.concat(resData))
      }
    }
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    isLoading.value = false
  }
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <div>
    <Empty v-if="needToLoginFirst" mt-6 :description="$t('common.please_log_in_first')">
      <Button type="primary" @click="jumpToLoginPage()">
        {{ $t('common.login') }}
      </Button>
    </Empty>
    <div
      v-else
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-4"
    >
      <template v-if="settings.recommendationMode === 'web'">
        <VideoCard
          v-for="video in videoList"
          :id="video.id"
          :key="video.id"
          :duration="video.duration"
          :title="video.title"
          :cover="video.pic"
          :author="video.owner.name"
          :author-face="video.owner.face"
          :mid="video.owner.mid"
          :view="video.stat.view"
          :danmaku="video.stat.danmaku"
          :published-timestamp="video.pubdate"
          :bvid="video.bvid"
        />
      </template>
      <template v-else>
        <VideoCard
          v-for="video in appVideoList"
          :id="video.args.aid"
          :key="video.args.aid"
          :duration-str="video.cover_right_text"
          :title="video.title"
          :cover="video.cover"
          :author="'avatar' in video.mask ? video.mask.avatar.text : ''"
          :author-face="'avatar' in video.mask ? video.mask.avatar.cover : ''"
          :mid="video.mask.avatar.up_id"
          :capsule-text="video.desc.split('·')[1]"
          :bvid="video.bvid"
          :view-str="video.cover_left_text_1"
          :danmaku-str="video.cover_left_text_2"
        />
      </template>

      <!-- skeleton -->
      <template v-for="item in 30" :key="item">
        <div
          v-if="isLoading"
          mb-8 pointer-events-none select-none
        >
          <div aspect-video bg="$bew-fill-4" rounded="$bew-radius" />
          <div flex mt-4>
            <div m="r-4" w="40px" h="40px" rounded="1/2" bg="$bew-fill-4" shrink-0 />
            <div w-full>
              <div grid gap-2>
                <div w-full h-5 bg="$bew-fill-3" />
                <div w="3/4" h-5 bg="$bew-fill-3" />
              </div>
              <div grid gap-2 mt-4>
                <div w="50%" h-4 bg="$bew-fill-2" />
                <div w="80%" h-4 bg="$bew-fill-2" />
              </div>
              <div text="transparent sm" inline-block mt-4 p="x-2 y-1" bg="$bew-fill-1" rounded-4>
                hello world
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>