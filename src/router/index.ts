import { createRouter, createWebHistory } from 'vue-router'
import { tools } from '@/data/tools'
import { setPageMeta } from '@/utils/seo'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
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
})

router.afterEach(to => {
  const title = (to.meta.title as string) || 'DevBox · 程序员工具箱'
  const tool = tools.find(item => item.id === to.meta.toolId)
  setPageMeta(title, tool?.description || 'DevBox 程序员工具箱：快速、免费、隐私优先的开发者工具。', tool?.keywords.join(',') || 'DevBox,开发者工具')
  // push to recent handled in ToolLayout
})

export default router
