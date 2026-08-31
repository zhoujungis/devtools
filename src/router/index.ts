import type { RouteRecordRaw } from 'vue-router'
import { tools } from '@/data/tools'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/Home.vue'), meta: { title: 'DevBox · 程序员工具箱' } },
  { path: '/favorites', component: () => import('@/views/Favorites.vue'), meta: { title: '我的收藏 - DevBox' } },
  { path: '/category/:id', component: () => import('@/views/Category.vue'), meta: { title: '分类 - DevBox' } },
  { path: '/cheatsheet', component: () => import('@/views/Cheatsheet.vue'), meta: { title: '速查表 - DevBox' } },
  ...tools.map(t => ({
    path: t.path,
    component: t.component,
    meta: { title: `${t.nameZh} - ${t.name} | DevBox`, toolId: t.id }
  })),
  { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
]
