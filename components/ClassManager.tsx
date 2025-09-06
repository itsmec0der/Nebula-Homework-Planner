
import React, { useState } from 'react';
import type { Class } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { Plus, Trash2 } from 'lucide-react';

interface ClassManagerProps {
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  requestConfirmation: (onConfirm: () => void, title: string, message: string) => void;
}

const colorSwatches = ['#EF4444', '#F97316', '#84CC16', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];
const scheduleTypes: { id: Class['scheduleType']; label: string }[] = [
  { id: 'everyday', label: 'Every Day' },
  { id: 'a-day', label: 'A Day' },
  { id: 'b-day', label: 'B Day' },
];

const ClassManager: React.FC<ClassManagerProps> = ({ classes, setClasses, requestConfirmation }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(colorSwatches[0]);
  const [days, setDays] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<Class['scheduleType']>('everyday');
  
  const handleDayToggle = (day: string) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newClass: Class = {
      id: Date.now().toString(),
      name,
      color,
      daysOfWeek: scheduleType === 'everyday' ? days : [],
      scheduleType
    };
    setClasses([...classes, newClass]);
    setName('');
    setColor(colorSwatches[0]);
    setDays([]);
    setScheduleType('everyday');
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-theme-text-primary mb-2">Manage Classes</h1>
      <p className="text-theme-text-secondary mb-8">Add, edit, or remove your classes here.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleAddClass} className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-theme-text-primary">Add a New Class</h2>
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">Class Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary"
                placeholder="e.g., Biology 101"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-2">Schedule Type</label>
              <div className="flex gap-2 rounded-lg bg-black/20 p-1">
                {scheduleTypes.map(st => (
                  <button type="button" key={st.id} onClick={() => setScheduleType(st.id)} className={`flex-1 text-center text-sm py-1.5 rounded-md transition-colors ${scheduleType === st.id ? 'bg-theme-primary text-white' : 'text-theme-text-secondary hover:bg-white/10'}`}>
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">Color</label>
              <div className="flex flex-wrap items-center gap-2">
                {colorSwatches.map(c => (
                  <button type="button" key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-theme-glass ring-theme-primary scale-110' : ''}`} style={{ backgroundColor: c }} />
                ))}
                <div className="relative w-8 h-8 rounded-full border-2 border-theme-border/50 transition-transform transform hover:scale-110" style={{ backgroundColor: color }}>
                    <input 
                        type="color" 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Custom color picker"
                    />
                </div>
              </div>
            </div>
            {scheduleType === 'everyday' && (
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Days of the Week</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <button type="button" key={day} onClick={() => handleDayToggle(day)} className={`px-2 py-1 text-sm rounded-md transition-colors ${days.includes(day) ? 'bg-theme-primary text-white' : 'bg-black/20 text-theme-text-secondary'}`}>
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-theme-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.02]">
              <Plus size={18} /> Add Class
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Your Classes</h2>
          <div className="space-y-3">
            {classes.length > 0 ? classes.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-black/10 p-4 rounded-lg transition-colors hover:bg-black/20">
                <div className="flex items-center gap-4">
                  <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }}></span>
                  <div>
                    <p className="font-semibold text-theme-text-primary">{c.name}</p>
                    <p className="text-xs text-theme-text-secondary">
                        {c.scheduleType === 'everyday' ? c.daysOfWeek.join(', ') : scheduleTypes.find(st => st.id === c.scheduleType)?.label}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => requestConfirmation(
                    () => handleDeleteClass(c.id), 
                    'Delete Class', 
                    `Are you sure you want to delete "${c.name}"? All associated homework will also be affected.`
                  )} 
                  className="p-2 text-theme-text-secondary hover:text-red-500 transition-transform hover:scale-110"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )) : <p className="text-theme-text-secondary">You haven't added any classes yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManager;
