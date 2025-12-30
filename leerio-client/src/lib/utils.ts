import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileUrlToGoogleDocsPreview = (fileUrl: string): string => {
  if (!fileUrl) return "";
  return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
};
