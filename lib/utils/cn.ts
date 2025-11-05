import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility to merge Tailwind CSS classes
 * Used throughout the app for conditional styling
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
