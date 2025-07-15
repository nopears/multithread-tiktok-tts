/**
 * Environment Configuration
 * Handles environment variables and provides defaults
 */

import { AppConfig } from './app.config'

export class EnvConfig {
  /**
   * Get TikTok session ID from environment
   */
  static getTikTokSessionId(): string | null {
    return process.env.TIKTOK_SESSION_ID || null
  }

  /**
   * Get default voice code from environment
   */
  static getDefaultVoiceCode(): string {
    return process.env.DEFAULT_VOICE_CODE || AppConfig.api.defaultVoice
  }

  /**
   * Get API base URL from environment
   */
  static getApiBaseUrl(): string {
    return process.env.TTS_API_BASE_URL || AppConfig.api.baseUrl
  }

  /**
   * Get performance settings from environment
   */
  static getPerformanceSettings() {
    return {
      maxChunkLength: Number(process.env.MAX_CHUNK_LENGTH) || AppConfig.performance.maxChunkLength,
      maxWorkers: Number(process.env.MAX_WORKERS) || AppConfig.performance.maxWorkers,
      rateLimitDelay: Number(process.env.RATE_LIMIT_DELAY) || AppConfig.performance.rateLimitDelay,
      maxCacheSize: Number(process.env.MAX_CACHE_SIZE) || AppConfig.performance.maxCacheSize,
    }
  }

  /**
   * Check if session ID is available in environment
   */
  static hasSessionId(): boolean {
    return !!this.getTikTokSessionId()
  }

  /**
   * Validate environment configuration
   */
  static validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check for session ID
    if (!this.getTikTokSessionId()) {
      errors.push('TIKTOK_SESSION_ID is not set in environment variables')
    }

    // Validate numeric values
    const perfSettings = this.getPerformanceSettings()
    if (perfSettings.maxChunkLength <= 0) {
      errors.push('MAX_CHUNK_LENGTH must be a positive number')
    }
    if (perfSettings.maxWorkers <= 0) {
      errors.push('MAX_WORKERS must be a positive number')
    }
    if (perfSettings.rateLimitDelay < 0) {
      errors.push('RATE_LIMIT_DELAY must be a non-negative number')
    }
    if (perfSettings.maxCacheSize <= 0) {
      errors.push('MAX_CACHE_SIZE must be a positive number')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get environment info for debugging
   */
  static getEnvInfo() {
    return {
      hasSessionId: this.hasSessionId(),
      defaultVoice: this.getDefaultVoiceCode(),
      apiBaseUrl: this.getApiBaseUrl(),
      performance: this.getPerformanceSettings(),
    }
  }
}