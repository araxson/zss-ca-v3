export interface ContactFormData {
  heading: string
  description: string
  submitLabel: string
  successMessage: string
  serviceOptions: ServiceOption[]
}

export interface ServiceOption {
  value: string
  label: string
}
