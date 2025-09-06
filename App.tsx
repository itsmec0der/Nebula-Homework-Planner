
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Home, Calendar, BookOpen, Settings, Plus, Timer, BarChart3, X, ArrowRight } from 'lucide-react';

import type { Homework, Class, Theme, View, StudySession, ScheduleSettings, ScheduleOverrides, UserProfile } from './types';
import { THEMES } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';

import HomeworkItem from './components/HomeworkItem';
import HomeworkModal from './components/HomeworkModal';
import ClassManager from './components/ClassManager';
import CalendarView from './components/CalendarView';
import ThemeSwitcher from './components/ThemeSwitcher';
import ConfirmationModal from './components/ConfirmationModal';
import PomodoroTimer from './components/PomodoroTimer';
import ProgressView from './components/ProgressView';
import BottomNavBar from './components/BottomNavBar';
import LoginScreen from './components/LoginScreen';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const App: React.FC = () => {
  const [activeUserKey, setActiveUserKey] = useLocalStorage<string | null>('nebula-active-user-key', null);
  
  const isGuest = activeUserKey === 'GUEST_MODE';
  
  const [themeMode, setThemeMode] = useLocalStorage<'light' | 'dark'>(`nebula-theme-mode-${activeUserKey}`, 'dark', !isGuest);
  const theme = useMemo(() => THEMES.find(t => t.type === themeMode) || THEMES.find(t => t.type === 'dark')!, [themeMode]);

  const [classes, setClasses] = useLocalStorage<Class[]>(`nebula-classes-${activeUserKey}`, [], !isGuest);
  const [homework, setHomework] = useLocalStorage<Homework[]>(`nebula-homework-${activeUserKey}`, [], !isGuest);
  const [studySessions, setStudySessions] = useLocalStorage<StudySession[]>(`nebula-study-sessions-${activeUserKey}`, [], !isGuest);
  const [scheduleSettings, setScheduleSettings] = useLocalStorage<ScheduleSettings | null>(`nebula-schedule-settings-${activeUserKey}`, null, !isGuest);
  const [scheduleOverrides, setScheduleOverrides] = useLocalStorage<ScheduleOverrides>(`nebula-schedule-overrides-${activeUserKey}`, {}, !isGuest);
  const [profile, setProfile] = useLocalStorage<UserProfile>(`nebula-profile-${activeUserKey}`, { name: 'Student', school: '', grade: '', avatar: '' }, !isGuest);

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState<boolean>(false);
  const [editingHomework, setEditingHomework] = useState<Homework | Partial<Homework> | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ action: (() => void) | null }>({ action: null });
  const [confirmOptions, setConfirmOptions] = useState({ 
    title: '', 
    message: '', 
    confirmText: 'Delete', 
    confirmVariant: 'danger' as 'danger' | 'primary' 
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove(...THEMES.map(t => t.className));
    document.documentElement.classList.add(theme.className);
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);
  
  // Reset view and state when user changes or enters guest mode
  useEffect(() => {
    setActiveView('dashboard');
    if (isGuest) {
      // Reset all state to initial values for a clean guest session
      setThemeMode('dark');
      setClasses([]);
      setHomework([]);
      setStudySessions([]);
      setScheduleSettings(null);
      setScheduleOverrides({});
      setProfile({ name: 'Guest', school: 'Guest Mode', grade: '', avatar: '' });
    }
  }, [activeUserKey, isGuest, setClasses, setHomework, setProfile, setScheduleOverrides, setScheduleSettings, setStudySessions, setThemeMode]);

  const getDayType = useCallback((date: Date): 'a' | 'b' | 'none' => {
    if (!scheduleSettings) return 'none';

    const dateStr = toYYYYMMDD(date);
    if (scheduleOverrides[dateStr]) {
      return scheduleOverrides[dateStr];
    }

    const dayOfWeek = date.getDay();
    if (!scheduleSettings.weekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
      return 'none';
    }
    
    const startDate = new Date(scheduleSettings.startDate + 'T00:00:00');
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < startDate) return 'none';
    
    let dayCount = 0;
    const cursor = new Date(startDate);
    
    // Calculate difference in days, then adjust for weekends
    const diffTime = targetDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if(scheduleSettings.weekends){
      dayCount = diffDays;
    } else {
      let weekdays = 0;
      for (let i = 0; i < diffDays; i++) {
        cursor.setDate(startDate.getDate() + i);
        const day = cursor.getDay();
        if (day !== 0 && day !== 6) {
          weekdays++;
        }
      }
      dayCount = weekdays;
    }
    
    const isEvenDayDiff = dayCount % 2 === 0;

    if (scheduleSettings.startDayType === 'a') {
      return isEvenDayDiff ? 'a' : 'b';
    } else {
      return isEvenDayDiff ? 'b' : 'a';
    }
  }, [scheduleSettings, scheduleOverrides]);
  
  const setDayOverride = (date: Date, type: 'a' | 'b' | 'none') => {
    const dateStr = toYYYYMMDD(date);
    setScheduleOverrides(prev => {
      const newOverrides = {...prev};
      if (type === 'none') {
        delete newOverrides[dateStr];
      } else {
        // Fix for line 129: Corrected typo from `datestr` to `dateStr`.
        newOverrides[dateStr] = type;
      }
      return newOverrides;
    });
  };

  const requestConfirmation = (onConfirm: () => void, title: string, message: string, options: { confirmText?: string; confirmVariant?: 'danger' | 'primary' } = {}) => {
    setConfirmAction({ action: onConfirm });
    setConfirmOptions({
      title,
      message,
      confirmText: options.confirmText || 'Delete',
      confirmVariant: options.confirmVariant || 'danger',
    });
    setIsConfirmModalOpen(true);
  };
  
  const handleLogin = (email: string | null) => {
    setActiveUserKey(email || 'GUEST_MODE');
  };
  
  const handleLogout = () => {
    if (isGuest) {
      requestConfirmation(
        () => setActiveUserKey(null),
        'Log In to Save Progress',
        'You are currently in a guest session. To save your data, please log in or sign up. All current data will be lost.',
        { confirmText: 'Log In', confirmVariant: 'primary' }
      );
    } else {
      const message = 'Your data is saved on this device. You can log back in with the same email to access it.';
      requestConfirmation(
        () => setActiveUserKey(null),
        'Confirm Logout',
        message,
        { confirmText: 'Log Out', confirmVariant: 'primary' }
      );
    }
  };

  const addOrUpdateHomework = (item: Homework) => {
    if (editingHomework && 'id' in editingHomework) {
      setHomework(homework.map(h => h.id === item.id ? item : h));
    } else {
      setHomework([...homework, item]);
    }
    closeHomeworkModal();
  };
  
  const toggleHomeworkComplete = (id: string) => {
    setHomework(homework.map(h => h.id === id ? { ...h, isComplete: !h.isComplete } : h));
  };
  
  const deleteHomework = (id: string) => {
    setHomework(homework.filter(h => h.id !== id));
  }

  const openHomeworkModal = (item: Homework | Partial<Homework> | null = null) => {
    setEditingHomework(item);
    setIsHomeworkModalOpen(true);
  };
  
  const closeHomeworkModal = () => {
    setIsHomeworkModalOpen(false);
    setEditingHomework(null);
  };
  
  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    setStudySessions(prev => [...prev, { ...session, id: Date.now().toString() }]);
  }

  const getTodaysDate = () => new Date();
  const today = getTodaysDate();

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
  
  const isToday = (someDate: Date) => isSameDay(someDate, today);

  const isTomorrow = (someDate: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return isSameDay(someDate, tomorrow);
  }

  const getHomeworkForDay = useCallback((filter: (date: Date) => boolean) => {
    return homework.filter(h => !h.isComplete && filter(new Date(h.dueDate)));
  }, [homework]);

  const todaysHomework = getHomeworkForDay(isToday);
  const tomorrowsHomework = getHomeworkForDay(isTomorrow);
  
  const todaysDayType = getDayType(today);
  const todayDayName = today.toLocaleString('en-US', { weekday: 'long' });
  const todaysClasses = classes.filter(c => {
    if(c.scheduleType === 'everyday') return c.daysOfWeek.includes(todayDayName);
    if(c.scheduleType === 'a-day' && todaysDayType === 'a') return true;
    if(c.scheduleType === 'b-day' && todaysDayType === 'b') return true;
    return false;
  });
  
  const upcomingNudges = useMemo(() => {
    const nudges = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);

    const upcoming = homework.filter(h => {
        if(h.isComplete) return false;
        const dueDate = new Date(h.dueDate);
        return dueDate >= today && dueDate <= twoDaysFromNow;
    });

    if (upcoming.length > 0) {
        const randomHw = upcoming[Math.floor(Math.random() * upcoming.length)];
        const dueDate = new Date(randomHw.dueDate);
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        const dayString = diffDays === 0 ? "today" : diffDays === 1 ? "tomorrow" : `in ${diffDays} days`;
        nudges.push(`Don't forget '${randomHw.title}' is due ${dayString}. You got this!`);
    }
    return nudges;
  }, [homework]);

  const completionStreak = useMemo(() => {
    const completedDates = new Set(
      homework
        .filter(h => h.isComplete)
        .map(h => toYYYYMMDD(new Date(h.dueDate)))
    );
  
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
  
    while (completedDates.has(toYYYYMMDD(currentDate))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  }, [homework]);


  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-theme-text-primary mb-2">Dashboard</h1>
            <p className="text-theme-text-secondary mb-8">Here's what's happening today.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <HomeworkSection style={{animationDelay: '100ms'}} title="Due Today" items={todaysHomework} classes={classes} onToggle={toggleHomeworkComplete} onEdit={openHomeworkModal} onDelete={(id) => requestConfirmation(() => deleteHomework(id), 'Delete Homework', 'Are you sure you want to delete this assignment?')} />
                <HomeworkSection style={{animationDelay: '200ms'}} title="Due Tomorrow" items={tomorrowsHomework} classes={classes} onToggle={toggleHomeworkComplete} onEdit={openHomeworkModal} onDelete={(id) => requestConfirmation(() => deleteHomework(id), 'Delete Homework', 'Are you sure you want to delete this assignment?')} />
              </div>
              <div className="space-y-6 animate-slideInUp" style={{animationDelay: '300ms'}}>
                <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Heads Up</h2>
                  {upcomingNudges.length > 0 ? (
                    <p className="text-theme-text-secondary">{upcomingNudges[0]}</p>
                  ) : (
                    <p className="text-theme-text-secondary">You're all caught up for now!</p>
                  )}
                </div>
                <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-theme-text-primary mb-2">Completion Streak</h2>
                  <p className="text-4xl font-bold text-theme-accent">{completionStreak} <span className="text-2xl text-theme-text-secondary">days</span></p>
                </div>
                 <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-theme-text-primary">Today's Classes</h2>
                    {todaysDayType !== 'none' && <span className="text-xs font-bold bg-theme-accent text-white px-2 py-1 rounded-full">{todaysDayType.toUpperCase()} DAY</span>}
                  </div>
                  {todaysClasses.length > 0 ? (
                    <ul className="space-y-3">
                      {todaysClasses.map(c => (
                        <li key={c.id} className="flex items-center space-x-3">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                          <span className="text-theme-text-primary">{c.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-theme-text-secondary">No classes scheduled for today.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      case 'calendar':
        return <CalendarView homework={homework} classes={classes} onDayClick={setSelectedDate} getDayType={getDayType} />;
      case 'classes':
        return <ClassManager classes={classes} setClasses={setClasses} requestConfirmation={requestConfirmation} />;
      case 'settings':
        return <ThemeSwitcher 
                  themeMode={themeMode} 
                  onThemeModeChange={setThemeMode} 
                  scheduleSettings={scheduleSettings} 
                  onScheduleSettingsChange={setScheduleSettings}
                  profile={profile}
                  onProfileChange={setProfile}
                  onLogout={handleLogout}
                  isGuest={isGuest}
                />;
      case 'focus':
        return <PomodoroTimer homework={homework} classes={classes} onSessionComplete={addStudySession} />;
      case 'progress':
        return <ProgressView homework={homework} studySessions={studySessions} />;
      default:
        return null;
    }
  };
  
  if (!activeUserKey) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-full bg-theme-bg bg-cover bg-center text-theme-text-primary font-sans transition-colors duration-300">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onQuickAdd={() => openHomeworkModal()} profile={profile} />
      <main key={activeView} className="flex-1 p-4 sm:p-6 md:p-12 md:ml-64 pb-28 md:pb-6 animate-fadeIn">
        {renderView()}
      </main>
      <BottomNavBar activeView={activeView} setActiveView={setActiveView} onQuickAdd={() => openHomeworkModal()} />
      {isHomeworkModalOpen && (
        <HomeworkModal
          isOpen={isHomeworkModalOpen}
          onClose={closeHomeworkModal}
          onSubmit={addOrUpdateHomework}
          classes={classes}
          homework={editingHomework}
        />
      )}
       <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            if (confirmAction.action) {
              confirmAction.action();
            }
            setIsConfirmModalOpen(false);
          }}
          title={confirmOptions.title}
          message={confirmOptions.message}
          confirmText={confirmOptions.confirmText}
          confirmVariant={confirmOptions.confirmVariant}
        />
        {selectedDate && (
          <DayViewModal
            isOpen={!!selectedDate}
            onClose={() => setSelectedDate(null)}
            date={selectedDate}
            homework={homework.filter(h => isSameDay(new Date(h.dueDate), selectedDate))}
            classes={classes}
            getDayType={getDayType}
            onAddHomework={(partial) => {
              setSelectedDate(null);
              openHomeworkModal(partial);
            }}
            onEditHomework={(hw) => {
              setSelectedDate(null);
              openHomeworkModal(hw);
            }}
            onSetOverride={setDayOverride}
          />
        )}
    </div>
  );
};

interface DayViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  homework: Homework[];
  classes: Class[];
  getDayType: (date: Date) => 'a' | 'b' | 'none';
  onAddHomework: (partial: Partial<Homework>) => void;
  onEditHomework: (hw: Homework) => void;
  onSetOverride: (date: Date, type: 'a' | 'b' | 'none') => void;
}

const DayViewModal: React.FC<DayViewModalProps> = ({isOpen, onClose, date, homework, classes, getDayType, onAddHomework, onEditHomework, onSetOverride}) => {
  if (!isOpen) return null;

  const dayType = getDayType(date);
  const scheduledClasses = classes.filter(c => {
    if (c.scheduleType === 'everyday') return c.daysOfWeek.includes(date.toLocaleString('en-US', { weekday: 'long' }));
    return c.scheduleType === `${dayType}-day`;
  });

  return (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-theme-glass border border-theme-border rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 relative animate-zoomIn max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-theme-text-secondary hover:text-theme-text-primary transition-colors z-10"><X size={24} /></button>
        <div className="flex items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-theme-text-primary">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
          {dayType !== 'none' && <span className="ml-4 text-xs font-bold bg-theme-accent text-white px-2 py-1 rounded-full">{dayType.toUpperCase()} DAY</span>}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-theme-text-primary mb-2">Scheduled Classes</h3>
            {scheduledClasses.length > 0 ? (
              <ul className="space-y-2">
                {scheduledClasses.map(c => (
                  <li key={c.id} className="flex items-center justify-between bg-black/10 p-3 rounded-lg">
                     <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                        <span className="text-theme-text-primary font-medium">{c.name}</span>
                      </div>
                      <button onClick={() => onAddHomework({classId: c.id, dueDate: date.toISOString()})} className="p-2 text-theme-text-secondary hover:text-theme-primary transition-transform duration-200 hover:scale-110"><Plus size={18} /></button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-theme-text-secondary">No classes scheduled.</p>}
          </div>

          <div>
            <h3 className="font-semibold text-theme-text-primary mb-2">Homework Due</h3>
             {homework.length > 0 ? (
              <ul className="space-y-2">
                {homework.map(hw => {
                  const itemClass = classes.find(c => c.id === hw.classId);
                  return (
                    <li key={hw.id} onClick={() => onEditHomework(hw)} className={`flex items-center gap-3 bg-black/10 p-3 rounded-lg cursor-pointer hover:bg-black/20 ${hw.isComplete ? 'opacity-60' : ''}`}>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: itemClass?.color }}></span>
                      <span className={`text-theme-text-primary font-medium ${hw.isComplete ? 'line-through' : ''}`}>{hw.title}</span>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="text-sm text-theme-text-secondary">No homework due on this day.</p>}
          </div>
          
           <div>
              <h3 className="font-semibold text-theme-text-primary mb-2">Day Override</h3>
              <div className="flex gap-2">
                <button onClick={() => onSetOverride(date, 'a')} className={`px-3 py-1 text-sm rounded-md transition-colors ${dayType === 'a' ? 'bg-theme-primary text-white' : 'bg-black/20 text-theme-text-secondary'}`}>Set A</button>
                <button onClick={() => onSetOverride(date, 'b')} className={`px-3 py-1 text-sm rounded-md transition-colors ${dayType === 'b' ? 'bg-theme-primary text-white' : 'bg-black/20 text-theme-text-secondary'}`}>Set B</button>
                <button onClick={() => onSetOverride(date, 'none')} className="px-3 py-1 text-sm rounded-md bg-black/20 text-theme-text-secondary">Clear</button>
              </div>
            </div>

        </div>
      </div>
    </div>
  )
}


interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onQuickAdd: () => void;
  profile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onQuickAdd, profile }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'classes', icon: BookOpen, label: 'Classes' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'focus', icon: Timer, label: 'Focus Timer'},
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-theme-glass border-r border-theme-border flex-col p-6 z-30 shadow-2xl">
      <div className="text-theme-accent text-2xl font-bold mb-12 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/></svg>
        <span>Nebula</span>
      </div>
      <nav className="flex-1 space-y-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as View)}
            className={`flex items-center justify-start space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${activeView === item.id ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-secondary hover:bg-white/10'}`}
          >
            <item.icon className="h-6 w-6" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto mb-4 border-t border-theme-border/50 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-theme-primary flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(profile.name)}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-theme-text-primary truncate">{profile.name}</p>
            <p className="text-xs text-theme-text-secondary truncate">{profile.school || 'No school set'}</p>
          </div>
        </div>
      </div>
      <button onClick={onQuickAdd} className="flex items-center justify-center space-x-3 w-full py-3 px-4 rounded-lg bg-theme-primary hover:bg-opacity-80 text-white transition-all duration-200 shadow-lg">
        <Plus className="h-6 w-6" />
        <span>Add Homework</span>
      </button>
    </aside>
  );
};

interface HomeworkSectionProps {
  title: string;
  items: Homework[];
  classes: Class[];
  onToggle: (id: string) => void;
  onEdit: (item: Homework) => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
}

const HomeworkSection: React.FC<HomeworkSectionProps> = ({ title, items, classes, onToggle, onEdit, onDelete, style }) => (
  <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg animate-slideInUp" style={style}>
    <h2 className="text-xl font-semibold text-theme-text-primary mb-4">{title}</h2>
    {items.length > 0 ? (
      <div className="space-y-4">
        {items.map(item => (
          <HomeworkItem 
            key={item.id} 
            item={item} 
            itemClass={classes.find(c => c.id === item.classId)}
            onToggleComplete={onToggle} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    ) : (
      <p className="text-theme-text-secondary">No homework due.</p>
    )}
  </div>
);

export default App;
