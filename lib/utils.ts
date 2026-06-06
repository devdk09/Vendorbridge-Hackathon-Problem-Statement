import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix: string): string {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}

export function generateNumber(prefix: string, count: number): string {
  return `${prefix}-${new Date().getFullYear()}-${String(count).padStart(3, "0")}`;
}
