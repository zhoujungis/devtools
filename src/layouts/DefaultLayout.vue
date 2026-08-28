<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { ref } from 'vue'
const showSearch = ref(false)
</script>
<template>
  <div class="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
    <AppHeader @open-search="showSearch=true" />
    <SearchModal :open="showSearch" @close="showSearch=false" />
    <main class="flex-1 mx-auto w-full max-w-[1400px] px-4 py-6">
      <slot />
    </main>
    <AppFooter />
    <ToastContainer />
  </div>
</template>
