/**
 * Application Constants
 * ค่าคงที่ที่ใช้ทั่วทั้งแอป
 */

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Animation
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

// App Info
export const APP_NAME = "Unbox";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "Clean Architecture with Framer Motion";
