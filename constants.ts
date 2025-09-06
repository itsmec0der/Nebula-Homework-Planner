import type { Theme } from './types';

export const THEMES: Theme[] = [
  {
    name: 'Nebula Dark',
    className: 'theme-nebula-dark',
    cssVars: {
      '--theme-primary': '#8B5CF6', // Purple
      '--theme-secondary': '#3B82F6', // Blue
      '--theme-accent': '#EC4899', // Pink
      '--theme-text-primary': '#F3F4F6', // Light Gray
      '--theme-text-secondary': '#9CA3AF', // Gray
      '--theme-bg': 'radial-gradient(ellipse at top, #1e293b, #0f172a), radial-gradient(ellipse at bottom, #1e293b, #0f172a)',
      '--theme-glass': 'rgba(30, 41, 59, 0.5)',
      '--theme-border': 'rgba(255, 255, 255, 0.1)',
    }
  },
  {
    name: 'Arctic Light',
    className: 'theme-arctic-light',
    cssVars: {
      '--theme-primary': '#2563EB', // Blue
      '--theme-secondary': '#4F46E5', // Indigo
      '--theme-accent': '#059669', // Emerald
      '--theme-text-primary': '#1F2937', // Dark Gray
      '--theme-text-secondary': '#6B7280', // Medium Gray
      '--theme-bg': '#f0f2f5',
      '--theme-glass': 'rgba(255, 255, 255, 0.6)',
      '--theme-border': 'rgba(0, 0, 0, 0.08)',
    }
  },
  {
    name: 'Emerald Night',
    className: 'theme-emerald-night',
    cssVars: {
      '--theme-primary': '#10B981', // Emerald
      '--theme-secondary': '#059669', // Darker Emerald
      '--theme-accent': '#6EE7B7', // Light Emerald
      '--theme-text-primary': '#E5E7EB', // Light Gray
      '--theme-text-secondary': '#9CA3AF', // Gray
      '--theme-bg': 'radial-gradient(ellipse at top, #111827, #0c1a14), radial-gradient(ellipse at bottom, #111827, #0c1a14)',
      '--theme-glass': 'rgba(17, 24, 39, 0.6)',
      '--theme-border': 'rgba(255, 255, 255, 0.1)',
    }
  },
  {
    name: 'Pastel Dreams',
    className: 'theme-pastel-dreams',
    cssVars: {
      '--theme-primary': '#F472B6', // Pink
      '--theme-secondary': '#A78BFA', // Violet
      '--theme-accent': '#60A5FA', // Blue
      '--theme-text-primary': '#374151', // Dark Gray
      '--theme-text-secondary': '#9CA3AF', // Gray
      '--theme-bg': '#FDF2F8',
      '--theme-glass': 'rgba(255, 255, 255, 0.7)',
      '--theme-border': 'rgba(0, 0, 0, 0.05)',
    }
  }
];

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];