
import React, { useMemo } from 'react';
import type { Homework, StudySession } from '../types';
import { CheckCircle, Clock, Star } from 'lucide-react';

interface ProgressViewProps {
  homework: Homework[];
  studySessions: StudySession[];
}

const ProgressView: React.FC<ProgressViewProps> = ({ homework, studySessions }) => {
  const completedHomework = useMemo(() => homework.filter(h => h.isComplete), [homework]);
  const totalStudyMinutes = useMemo(() => studySessions.reduce((total, session) => total + session.durationMinutes, 0), [studySessions]);
  const totalHours = Math.floor(totalStudyMinutes / 60);
  const remainingMinutes = totalStudyMinutes % 60;
  
  const completionStreak = useMemo(() => {
    const completedDates = new Set(
      homework
        .filter(h => h.isComplete)
        .map(h => new Date(h.dueDate).toISOString().split('T')[0])
    );
  
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
  
    while (completedDates.has(currentDate.toISOString().split('T')[0])) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  }, [homework]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-theme-text-primary mb-2">Your Progress</h1>
      <p className="text-theme-text-secondary mb-8">See your accomplishments and track your study habits.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            icon={<Star size={24} className="text-yellow-400" />}
            label="Completion Streak"
            value={`${completionStreak} days`}
            color="yellow"
        />
        <StatCard 
            icon={<CheckCircle size={24} className="text-green-400" />}
            label="Tasks Completed"
            value={completedHomework.length}
            color="green"
        />
        <StatCard 
            icon={<Clock size={24} className="text-blue-400" />}
            label="Total Study Time"
            value={`${totalHours}h ${remainingMinutes}m`}
            color="blue"
        />
      </div>

      <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Recently Completed</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {completedHomework.length > 0 ? (
            completedHomework
                .sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                .slice(0, 20) // Show last 20
                .map(hw => (
            <div key={hw.id} className="flex items-center bg-black/10 p-3 rounded-lg">
              <CheckCircle size={20} className="text-green-500 mr-4" />
              <div>
                <p className="font-medium text-theme-text-primary">{hw.title}</p>
                <p className="text-sm text-theme-text-secondary">
                  Completed on {new Date(hw.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))) : (
            <p className="text-theme-text-secondary">No completed homework yet. Keep going!</p>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({icon, label, value, color}) => (
    <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex-shrink-0 flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-theme-text-secondary">{label}</p>
            <p className="text-2xl font-bold text-theme-text-primary">{value}</p>
        </div>
    </div>
)

export default ProgressView;