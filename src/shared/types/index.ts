/**
 * TypeScript Types & Interfaces
 * Shared types ที่ใช้ทั่วทั้งแอป
 */

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Common UI Types
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type Size = "sm" | "md" | "lg" | "xl";
export type Status = "idle" | "loading" | "success" | "error";

// Animation Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string | number[];
}
