<template>
  <transition>
    <topbar v-if="isShowTopbar" class="fixed z-50"></topbar>
  </transition>
  <!-- is home page -->
  <home></home>
  <!-- button -->
  <div
    flex="~ col"
    pos="fixed bottom-5 lg:right-5 <lg:right-3"
  >
    <button
      class="transform active:scale-90"
      w="lg:45px <lg:40px"
      h="lg:45px <lg:40px"
      p="lg:3 <lg:2"
      m="b-3"
      bg="$bew-content-1"
      text="2xl $bew-text-1"
      font="leading-0"
      duration="300"
      rounded="$bew-radius"
      style="box-shadow: var(--bew-shadow-2); backdrop-filter: var(--bew-filter-glass);"
      @click="toggleDark()"
    >
      <tabler:moon-stars v-if="isDark" />
      <tabler:sun v-else />
    </button>

    <button
      class="leading-none transform active:scale-90"
      w="lg:45px <lg:40px"
      h="lg:45px <lg:40px"
      p="lg:3 <lg:2"
      bg="$bew-content-1"
      text="2xl $bew-text-1"
      font="leading-0"
      duration="300"
      rounded="$bew-radius"
      style="box-shadow: var(--bew-shadow-2); backdrop-filter: var(--bew-filter-glass);"
      @click="toggle()"
    >
      <tabler-settings />
    </button>
  </div>
  <settings v-if="showSettings" @close="showSettings = false"></settings>
</template>

<script setup lang="ts">
import { useToggle, useDark } from '@vueuse/core'
import { apperance, isShowTopbar } from '~/logic/storage'
import { language } from '~/logic'
import 'virtual:windi.css'
import '~/styles/index.ts'
import Home from './Home/index.vue'
import { useI18n } from 'vue-i18n'

const [showSettings, toggle] = useToggle(false)
const isDark = useDark()
const toggleDark = useToggle(isDark)
const { locale } = useI18n()

window.onload = () => {
  // if there is first-time load extension, set the default language by browser display language
  if (language.value === '') {
    if (browser.i18n.getUILanguage() === 'zh-CN')
      language.value = 'cmn-SC'
    else if (browser.i18n.getUILanguage() === 'zh-TW')
      language.value = 'cmn-TC'
    else
      language.value = 'en'
  }

  locale.value = language.value

  // locale.value = language.value
}

</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0 transform -translate-y-full;
}

</style>
