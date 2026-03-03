import type { PropertyAgent, PropertyAgentForm } from '@/types/PropertyAgent'

const BASE_URL = 'http://localhost:3000/api/agents'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw body
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

export function fetchAgents(): Promise<PropertyAgent[]> {
  return fetch(BASE_URL).then((res) => handleResponse<PropertyAgent[]>(res))
}

export function fetchAgent(id: string): Promise<PropertyAgent> {
  return fetch(`${BASE_URL}/${id}`).then((res) => handleResponse<PropertyAgent>(res))
}

export function createAgent(data: PropertyAgentForm): Promise<PropertyAgent> {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => handleResponse<PropertyAgent>(res))
}

export function updateAgent(id: string, data: Partial<PropertyAgentForm>): Promise<PropertyAgent> {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => handleResponse<PropertyAgent>(res))
}

export function deleteAgent(id: string): Promise<void> {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then((res) =>
    handleResponse<void>(res),
  )
}
