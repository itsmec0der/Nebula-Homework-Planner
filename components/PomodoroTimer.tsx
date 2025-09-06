
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, ChevronDown } from 'lucide-react';
import type { Homework, Class, StudySession } from '../types';

interface PomodoroTimerProps {
  homework: Homework[];
  classes: Class[];
  onSessionComplete: (session: Omit<StudySession, 'id'>) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ homework, classes, onSessionComplete }) => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  
  const [minutes, setMinutes] = useState(workMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const [linkedHomeworkId, setLinkedHomeworkId] = useState<string | null>(null);
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    const newMinutes = isBreak ? breakMinutes : workMinutes;
    setMinutes(newMinutes);
    setSeconds(0);
  }, [isBreak, workMinutes, breakMinutes]);

  useEffect(() => {
    resetTimer();
  }, [workMinutes, breakMinutes, resetTimer]);
  
  useEffect(() => {
    // Fix: The return type of `setInterval` in the browser is `number`, not `NodeJS.Timeout`.
    let interval: number | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(s => s - 1);
        } else if (minutes > 0) {
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          // Timer finished
          if (!isBreak) {
            const linkedHw = homework.find(h => h.id === linkedHomeworkId);
            onSessionComplete({
                homeworkId: linkedHomeworkId,
                classId: linkedHw ? linkedHw.classId : null,
                startTime: new Date(Date.now() - workMinutes * 60000).toISOString(),
                durationMinutes: workMinutes
            });
            setSessionCount(s => s + 1);
          }
          setIsBreak(!isBreak);
          setIsActive(false);
          // TODO: Add audio notification
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes, isBreak, onSessionComplete, workMinutes, linkedHomeworkId, homework]);

  useEffect(() => {
    resetTimer();
  }, [isBreak, resetTimer]);

  const toggleTimer = () => setIsActive(!isActive);

  const totalSeconds = minutes * 60 + seconds;
  const initialTotalSeconds = (isBreak ? breakMinutes : workMinutes) * 60;
  const progress = (1 - (totalSeconds / initialTotalSeconds)) * 100;

  return (
    <div>
      <h1 className="text-4xl font-bold text-theme-text-primary mb-2">Focus Timer</h1>
      <p className="text-theme-text-secondary mb-8">Use the Pomodoro technique to enhance your productivity.</p>
      
      <div className="bg-theme-glass border border-theme-border rounded-2xl p-8 shadow-lg max-w-md mx-auto flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="text-black/20" strokeWidth="5" cx="50" cy="50" r="45" fill="transparent" />
            <circle
              className="text-theme-primary"
              strokeWidth="5"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-5xl font-bold text-theme-text-primary">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-lg text-theme-text-secondary">{isBreak ? 'Break Time' : 'Focus'}</p>
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <button onClick={toggleTimer} className="w-20 h-20 bg-theme-primary text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            {isActive ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button onClick={resetTimer} className="w-20 h-20 bg-black/20 text-theme-text-secondary rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            <RotateCcw size={32} />
          </button>
        </div>

        <div className="mt-8 w-full">
            <label htmlFor="link-hw" className="block text-sm font-medium text-theme-text-secondary mb-1 text-center">Link to a task (optional)</label>
             <select
              id="link-hw"
              value={linkedHomeworkId || ''}
              onChange={(e) => setLinkedHomeworkId(e.target.value || null)}
              className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition"
            >
              <option value="">No linked task</option>
              {homework.filter(h => !h.isComplete).map(h => {
                const itemClass = classes.find(c => c.id === h.classId);
                return <option key={h.id} value={h.id}>{h.title} ({itemClass?.name})</option>
              })}
            </select>
        </div>

        <div className="mt-6 text-center">
            <p className="text-theme-text-secondary">Completed sessions: <span className="font-bold text-theme-text-primary">{sessionCount}</span></p>
        </div>

      </div>
    </div>
  );
};

export default PomodoroTimer;