/**
 * Formatting utilities for dates, currency, and other display values
 */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
  }).format(amount)
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('da-DK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('da-DK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInMinutes = Math.floor((target.getTime() - now.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 0) {
    return `${Math.abs(diffInMinutes)} min siden`
  } else if (diffInMinutes < 60) {
    return `om ${diffInMinutes} min`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `om ${hours} time${hours > 1 ? 'r' : ''}`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `om ${days} dag${days > 1 ? 'e' : ''}`
  }
}






