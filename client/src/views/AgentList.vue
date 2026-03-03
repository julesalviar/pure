<template>
  <div class="agent-list">
    <div class="list-header">
      <h2>Property Agents</h2>
      <router-link to="/agents/new" class="btn-primary add-btn">+ New Agent</router-link>
    </div>

    <div v-if="loading" class="status-message">Loading agents...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    <div v-else-if="agents.length === 0" class="status-message">
      No agents found. Create one to get started.
    </div>

    <table v-else class="agents-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="agent in agents" :key="agent.id">
          <td>{{ agent.firstName }} {{ agent.lastName }}</td>
          <td>{{ agent.email }}</td>
          <td>{{ agent.mobileNumber }}</td>
          <td>{{ formatDate(agent.createdAt) }}</td>
          <td class="actions">
            <router-link :to="`/agents/${agent.id}/edit`" class="btn-primary btn-sm">
              Edit
            </router-link>
            <button class="btn-danger btn-sm" @click="handleDelete(agent)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PropertyAgent } from '@/types/PropertyAgent'
import { fetchAgents, deleteAgent } from '@/services/agentApi'

const agents = ref<PropertyAgent[]>([])
const loading = ref(true)
const error = ref('')

async function loadAgents() {
  loading.value = true
  error.value = ''
  try {
    agents.value = await fetchAgents()
  } catch {
    error.value = 'Failed to load agents. Is the API server running?'
  } finally {
    loading.value = false
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString()
}

async function handleDelete(agent: PropertyAgent) {
  if (!confirm(`Delete agent "${agent.firstName} ${agent.lastName}"?`)) return
  try {
    await deleteAgent(agent.id)
    agents.value = agents.value.filter((a) => a.id !== agent.id)
  } catch {
    alert('Failed to delete agent.')
  }
}

onMounted(loadAgents)
</script>

<style scoped>
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-btn {
  display: inline-block;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 13px;
  text-decoration: none;
  border-radius: 4px;
  display: inline-block;
}

.status-message {
  text-align: center;
  padding: 40px;
  color: #666;
}
.status-message.error {
  color: #e74c3c;
}

.agents-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.agents-table th,
.agents-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.agents-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
  font-size: 13px;
  text-transform: uppercase;
}
.agents-table tr:hover {
  background: #f8f9fa;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>
