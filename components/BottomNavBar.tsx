
import React from 'react';
import { Home, Calendar, BookOpen, BarChart3, Plus } from 'lucide-react';
import type { View } from '../types';

interface BottomNavBarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onQuickAdd: () => void;
}

const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'classes', icon: BookOpen, label: 'Classes' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView, onQuickAdd }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-theme-glass/80 backdrop-blur-lg border-t border-theme-border z-40">
            <div className="flex justify-around items-center h-full max-w-md mx-auto relative px-2">
                {navItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                        {/* Add space for the central FAB */}
                        {index === 2 && <div className="w-16 h-16" />} 
                        <button
                            onClick={() => setActiveView(item.id as View)}
                            className={`flex flex-col items-center justify-center space-y-1 w-16 transition-colors duration-200 rounded-lg py-2 ${activeView === item.id ? 'text-theme-primary' : 'text-theme-text-secondary hover:text-theme-text-primary'}`}
                        >
                            <item.icon size={24} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    </React.Fragment>
                ))}
                <button
                    onClick={onQuickAdd}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 bg-theme-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    aria-label="Add Homework"
                >
                    <Plus size={32} />
                </button>
            </div>
        </div>
    );
}

export default BottomNavBar;
