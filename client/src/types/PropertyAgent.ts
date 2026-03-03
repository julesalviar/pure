export interface PropertyAgent {
  id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  createdAt: string
  updatedAt: string
}

export interface PropertyAgentForm {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  error?: string
  errors?: ValidationError[]
}
