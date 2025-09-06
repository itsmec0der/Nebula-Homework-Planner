import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Homework, Class } from '../types';

interface CalendarViewProps {
  homework: Homework[];
  classes: Class[];
  onDayClick: (date: Date) => void;
  getDayType: (date: Date) => 'a' | 'b' | 'none';
}

const CalendarView: React.FC<CalendarViewProps> = ({ homework, classes, onDayClick, getDayType }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days: Date[] = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const getHomeworkForDate = (date: Date) => {
    return homework.filter(h => {
      const dueDate = new Date(h.dueDate);
      return dueDate.getFullYear() === date.getFullYear() &&
             dueDate.getMonth() === date.getMonth() &&
             dueDate.getDate() === date.getDate();
    });
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="bg-theme-glass border border-theme-border rounded-2xl p-4 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-theme-text-primary">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded-md border border-theme-border/50 text-theme-text-secondary hover:bg-black/20 transition-colors"
            aria-label="Go to today's date"
          >
            Today
          </button>
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/10 text-theme-text-secondary" aria-label="Previous month">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/10 text-theme-text-secondary" aria-label="Next month">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-theme-text-secondary text-xs sm:text-sm py-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="hidden sm:block">{day}</div>
        ))}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="sm:hidden">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map((date, index) => {
          const homeworkForDay = getHomeworkForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(date, new Date());
          const dayType = getDayType(date);
          
          return (
            <div
              key={index}
              onClick={() => onDayClick(date)}
              className={`h-24 sm:h-28 md:h-32 p-1 sm:p-2 border border-theme-border/50 rounded-lg flex flex-col cursor-pointer transition-colors hover:bg-white/5 ${isCurrentMonth ? '' : 'opacity-40'}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs sm:text-sm font-medium flex items-center justify-center ${isToday ? 'bg-theme-primary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6' : 'text-theme-text-primary'}`}>
                  {date.getDate()}
                </span>
                {dayType !== 'none' && <span className="text-[10px] sm:text-xs font-bold text-theme-accent">{dayType.toUpperCase()}</span>}
              </div>
              <div className="flex-1 mt-1 overflow-y-auto space-y-1">
                 {homeworkForDay.slice(0, 3).map(hw => {
                   const itemClass = classes.find(c => c.id === hw.classId);
                   return (
                     <div 
                      key={hw.id} 
                      className={`w-full h-1.5 rounded-full`}
                      style={{backgroundColor: itemClass?.color || '#888888'}}
                    ></div>
                  );
                 })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;