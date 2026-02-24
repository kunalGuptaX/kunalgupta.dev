import DOMPurify from 'dompurify'

/**
 * Allowlist matches exactly what TipTap's StarterKit produces.
 * Any other tags (script, img, iframe, etc.) are stripped.
 */
const ALLOWED_TAGS = ['p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 's']
const ALLOWED_ATTR: string[] = []

/**
 * Sanitize HTML content before rendering with DOMPurify.
 * Returns safe HTML string with only TipTap-compatible tags.
 */
export function safeHtml(dirty: unknown): string {
  if (typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS, ALLOWED_ATTR })
}

/**
 * Validate that a string is a valid CSS hex color.
 * Returns the color if valid, or the fallback otherwise.
 */
export function safeHexColor(value: unknown, fallback = '#1a1a1a'): string {
  if (typeof value !== 'string') return fallback
  return /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : fallback
}
