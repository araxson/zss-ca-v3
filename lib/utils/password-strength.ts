export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrengthResult {
  strength: PasswordStrength
  score: number
  feedback: string
  color: string
  label: string
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      strength: 'weak',
      score: 0,
      feedback: 'Enter a password',
      color: 'text-muted-foreground',
      label: 'Too weak',
    }
  }

  let score = 0

  // Length check
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  // Determine strength level
  if (score <= 2) {
    return {
      strength: 'weak',
      score,
      feedback: 'Weak password',
      color: 'text-destructive',
      label: 'Weak',
    }
  } else if (score <= 4) {
    return {
      strength: 'fair',
      score,
      feedback: 'Fair password',
      color: 'text-muted-foreground',
      label: 'Fair',
    }
  } else if (score <= 5) {
    return {
      strength: 'good',
      score,
      feedback: 'Good password',
      color: 'text-foreground',
      label: 'Good',
    }
  } else {
    return {
      strength: 'strong',
      score,
      feedback: 'Strong password',
      color: 'text-primary',
      label: 'Strong',
    }
  }
}

export function getPasswordStrengthPercentage(score: number): number {
  return Math.min((score / 7) * 100, 100)
}
