import { createRouter, createWebHistory } from 'vue-router'
import AgentList from '@/views/AgentList.vue'
import AgentForm from '@/views/AgentForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/agents' },
    { path: '/agents', name: 'agents', component: AgentList },
    { path: '/agents/new', name: 'agent-create', component: AgentForm },
    { path: '/agents/:id/edit', name: 'agent-edit', component: AgentForm },
  ],
})

export default router
