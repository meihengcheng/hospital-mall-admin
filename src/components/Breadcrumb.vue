<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  title: string
  path: string
}

const route = useRoute()
const breadcrumbs = ref<BreadcrumbItem[]>([])

const getBreadcrumbs = () => {
  const matched = route.matched.filter(item => item.meta?.title)
  breadcrumbs.value = matched.map(item => ({
    title: item.meta.title as string,
    path: item.path
  }))
}

watch(() => route.path, getBreadcrumbs, { immediate: true })
</script>
