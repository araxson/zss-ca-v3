export const categoryOptions = [
  {
    value: 'technical',
    label: 'Technical Issue',
    description: 'Platform bug or outage affecting your site.',
  },
  {
    value: 'content_change',
    label: 'Content Change',
    description: 'Updates to text, images, or layout requests.',
  },
  {
    value: 'billing',
    label: 'Billing Question',
    description: 'Invoice questions or payment concerns.',
  },
  {
    value: 'general_inquiry',
    label: 'General Inquiry',
    description: 'Anything else you want to discuss.',
  },
] as const

export const priorityOptions = [
  {
    value: 'low',
    label: 'Low',
    description: 'Minor requests or informational updates.',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Important updates that impact timelines.',
  },
  {
    value: 'high',
    label: 'High',
    description: 'Urgent issues blocking your site or launch.',
  },
] as const
