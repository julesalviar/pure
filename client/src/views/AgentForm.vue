<template>
  <div class="agent-form">
    <h2>{{ isEdit ? 'Edit Agent' : 'Create Agent' }}</h2>

    <div v-if="loadError" class="status-message error">{{ loadError }}</div>

    <form v-else @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName">First Name *</label>
        <input
          id="firstName"
          v-model="form.firstName"
          type="text"
          required
          placeholder="Enter first name"
        />
        <span v-if="fieldError('firstName')" class="field-error">{{
          fieldError('firstName')
        }}</span>
      </div>

      <div class="form-group">
        <label for="lastName">Last Name *</label>
        <input
          id="lastName"
          v-model="form.lastName"
          type="text"
          required
          placeholder="Enter last name"
        />
        <span v-if="fieldError('lastName')" class="field-error">{{
          fieldError('lastName')
        }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="agent@example.com"
        />
        <span v-if="fieldError('email')" class="field-error">{{ fieldError('email') }}</span>
      </div>

      <div class="form-group">
        <label for="mobileNumber">Mobile Number *</label>
        <input
          id="mobileNumber"
          v-model="form.mobileNumber"
          type="tel"
          required
          placeholder="+1 (555) 123-4567"
        />
        <span v-if="fieldError('mobileNumber')" class="field-error">{{
          fieldError('mobileNumber')
        }}</span>
      </div>

      <div v-if="generalError" class="general-error">{{ generalError }}</div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? 'Saving...' : isEdit ? 'Update Agent' : 'Create Agent' }}
        </button>
        <router-link to="/agents" class="cancel-btn btn-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ApiError, ValidationError } from '@/types/PropertyAgent'
import { fetchAgent, createAgent, updateAgent } from '@/services/agentApi'

const route = useRoute()
const router = useRouter()

const agentId = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!agentId.value)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
})

const submitting = ref(false)
const loadError = ref('')
const generalError = ref('')
const errors = ref<ValidationError[]>([])

function fieldError(field: string): string | undefined {
  return errors.value.find((e) => e.field === field)?.message
}

async function loadAgent() {
  if (!agentId.value) return
  try {
    const agent = await fetchAgent(agentId.value)
    form.firstName = agent.firstName
    form.lastName = agent.lastName
    form.email = agent.email
    form.mobileNumber = agent.mobileNumber
  } catch {
    loadError.value = 'Failed to load agent. It may have been deleted.'
  }
}

async function handleSubmit() {
  submitting.value = true
  generalError.value = ''
  errors.value = []

  try {
    if (isEdit.value) {
      await updateAgent(agentId.value!, { ...form })
    } else {
      await createAgent({ ...form })
    }
    router.push('/agents')
  } catch (err: unknown) {
    const apiErr = err as ApiError
    if (apiErr.errors) {
      errors.value = apiErr.errors
    } else if (apiErr.error) {
      generalError.value = apiErr.error
    } else {
      generalError.value = 'An unexpected error occurred.'
    }
  } finally {
    submitting.value = false
  }
}

onMounted(loadAgent)
</script>

<style scoped>
.agent-form {
  max-width: 500px;
}
h2 {
  margin-bottom: 24px;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #444;
}
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  transition: border-color 0.2s;
}
.form-group input:focus {
  outline: none;
  border-color: #4a90d9;
  box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.2);
}
.field-error {
  display: block;
  color: #e74c3c;
  font-size: 13px;
  margin-top: 4px;
}
.general-error {
  background: #fde8e8;
  color: #c0392b;
  padding: 10px 14px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}
.status-message.error {
  color: #e74c3c;
  padding: 20px 0;
}
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.cancel-btn {
  text-decoration: none;
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
}
</style>
