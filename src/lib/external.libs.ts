/**
 * Third-party Library Integrations
 * Centralized exports for external dependencies
 */

// Re-export commonly used libraries with consistent naming
export { default as chalk } from 'chalk'
export { default as clear } from 'clear'
export { default as inquirer } from 'inquirer'
export { default as ora } from 'ora'
export { default as boxen } from 'boxen'
export { default as figlet } from 'figlet'
export { default as gradient } from 'gradient-string'
export { SingleBar as ProgressBar, Presets } from 'cli-progress'

// Puppeteer with type safety
export { default as puppeteer } from 'puppeteer'
export type { Browser, Page } from 'puppeteer'