
export interface Subtask {
  id: string;
  title: string;
  isComplete: boolean;
}

export interface Homework {
  id: string;
  title: string;
  classId: string;
  dueDate: string; // ISO string
  notes: string;
  isComplete: boolean;
  reminders: string[]; // Array of ISO strings
  subtasks: Subtask[];
}

export interface Class {
  id: string;
  name: string;
  color: string;
  daysOfWeek: string[]; // For 'everyday' schedule type
  scheduleType: 'everyday' | 'a-day' | 'b-day';
}

export interface Theme {
  name: string;
  className: string;
  cssVars: {
    '--theme-primary': string;
    '--theme-secondary': string;
    '--theme-accent': string;
    '--theme-text-primary': string;
    '--theme-text-secondary': string;
    '--theme-bg': string;
    '--theme-glass': string;
    '--theme-border': string;
  };
}

export interface StudySession {
  id:string;
  homeworkId: string | null;
  classId: string | null;
  startTime: string; // ISO string
  durationMinutes: number;
}

export interface ScheduleSettings {
  startDate: string; // YYYY-MM-DD
  startDayType: 'a' | 'b';
  weekends: boolean; // Does the A/B schedule include weekends?
}

export type ScheduleOverrides = Record<string, 'a' | 'b' | 'none'>; // Key is YYYY-MM-DD

export interface UserProfile {
  name: string;
  school: string;
  grade: string;
  avatar: string; // base64 data URL
}

export type View = 'dashboard' | 'calendar' | 'classes' | 'settings' | 'focus' | 'progress';