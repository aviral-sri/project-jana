import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function dateToInputValue(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error converting date for input:", error);
    return '';
  }
}

export function getRandomPosition(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function validateFile(file: File, maxSizeMB: number = 5, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): string | null {
  if (!file) return 'No file selected';
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return `File type not allowed. Please upload ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File is too large. Maximum size is ${maxSizeMB} MB`;
  }
  
  return null;
}

export function createHeart(container: HTMLElement) {
  // Create heart element
  const heart = document.createElement('div');
  heart.classList.add('heart');
  
  // Set random position
  const startPos = getRandomPosition(10, 90);
  heart.style.left = `${startPos}%`;
  heart.style.bottom = '-20px';
  
  // Set random size
  const size = getRandomPosition(10, 25);
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  
  // Add to container
  container.appendChild(heart);
  
  // Remove after animation completes
  setTimeout(() => {
    heart.remove();
  }, 4000);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
