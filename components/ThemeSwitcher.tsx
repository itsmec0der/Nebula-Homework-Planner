

import React, { useRef } from 'react';
import { Camera, LogOut, LogIn, Sun, Moon } from 'lucide-react';
import type { Theme, ScheduleSettings, UserProfile } from '../types';
import { THEMES } from '../constants';

interface SettingsViewProps {
  themeMode: 'light' | 'dark';
  onThemeModeChange: (mode: 'light' | 'dark') => void;
  scheduleSettings: ScheduleSettings | null;
  onScheduleSettingsChange: (settings: ScheduleSettings | null) => void;
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onLogout: () => void;
  isGuest: boolean;
}

const SettingsView: React.FC<SettingsViewProps> = ({ themeMode, onThemeModeChange, scheduleSettings, onScheduleSettingsChange, profile, onProfileChange, onLogout, isGuest }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onProfileChange({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onProfileChange({ ...profile, avatar: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onScheduleSettingsChange({
      ...(scheduleSettings || { startDate: new Date().toISOString().split('T')[0], startDayType: 'a', weekends: false }),
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-theme-text-primary mb-2">Settings</h1>
      <p className="text-theme-text-secondary mb-8">Personalize your Nebula experience.</p>
      
      <div className="space-y-8">
        <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Your Profile</h2>
          <div className={`flex flex-col sm:flex-row items-center gap-6 ${isGuest ? 'opacity-60' : ''}`}>
            <div className="shrink-0 text-center">
              <div className="relative w-24 h-24 mx-auto">
                <div className="w-24 h-24 rounded-full bg-theme-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden select-none">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(profile.name)}</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/png, image/jpeg, image/gif"
                  className="hidden"
                  disabled={isGuest}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-theme-secondary rounded-full flex items-center justify-center text-white hover:bg-opacity-80 transition-all"
                  aria-label="Change profile picture"
                  disabled={isGuest}
                >
                  <Camera size={16} />
                </button>
              </div>
              <p className="text-xs text-theme-text-secondary mt-2">Supports JPG, PNG, GIF</p>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-theme-text-secondary mb-1">Name</label>
                <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary disabled:opacity-70" placeholder="e.g., Alex Doe" disabled={isGuest} />
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-theme-text-secondary mb-1">School</label>
                  <input type="text" id="school" name="school" value={profile.school} onChange={handleProfileChange} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary disabled:opacity-70" placeholder="e.g., Nebula High" disabled={isGuest} />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-theme-text-secondary mb-1">Grade</label>
                  <input type="text" id="grade" name="grade" value={profile.grade} onChange={handleProfileChange} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary disabled:opacity-70" placeholder="e.g., 11th Grade" disabled={isGuest} />
                </div>
              </div>
            </div>
          </div>
          {isGuest && (
            <p className="text-center text-sm text-theme-text-secondary mt-4">Log in to create a persistent profile.</p>
          )}
           <div className="mt-6 border-t border-theme-border -mx-6 px-6 pt-4">
            <button 
              onClick={onLogout}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold rounded-lg transition-all ${isGuest ? 'bg-theme-primary/20 text-theme-primary hover:bg-theme-primary/30' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
            >
              {isGuest ? (
                <>
                  <LogIn size={18} /> Log In / Sign Up
                </>
              ) : (
                <>
                  <LogOut size={18} /> Log Out
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Appearance</h2>
          <div className="flex items-center justify-between rounded-lg p-4 bg-black/10">
            <span className="font-semibold text-theme-text-primary">Color Mode</span>
            <div className="flex items-center gap-4">
              <Sun size={20} className={`transition-colors ${themeMode === 'light' ? 'text-theme-primary' : 'text-theme-text-secondary'}`} />
              <button
                type="button"
                role="switch"
                aria-checked={themeMode === 'dark'}
                onClick={() => onThemeModeChange(themeMode === 'light' ? 'dark' : 'light')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 focus:ring-offset-theme-glass ${themeMode === 'dark' ? 'bg-theme-primary' : 'bg-black/30'}`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    themeMode === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
              <Moon size={20} className={`transition-colors ${themeMode === 'dark' ? 'text-theme-primary' : 'text-theme-text-secondary'}`} />
            </div>
          </div>
        </div>

        <div className="bg-theme-glass border border-theme-border rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Schedule Settings</h2>
            <div className="space-y-4 max-w-md">
                <p className="text-sm text-theme-text-secondary">
                  Set up your school's A/B day rotation. This will automatically label days in the calendar and filter your class list.
                </p>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-theme-text-secondary mb-1">Rotation Start Date</label>
                  <input type="date" id="startDate" name="startDate" value={scheduleSettings?.startDate || ''} onChange={handleSettingsChange} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-theme-text-secondary mb-1">Start Date Is</label>
                   <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="startDayType" value="a" checked={scheduleSettings?.startDayType === 'a'} onChange={handleSettingsChange} className="form-radio text-theme-primary bg-transparent" />
                        <span className="text-theme-text-primary">A Day</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="startDayType" value="b" checked={scheduleSettings?.startDayType === 'b'} onChange={handleSettingsChange} className="form-radio text-theme-primary bg-transparent" />
                        <span className="text-theme-text-primary">B Day</span>
                      </label>
                   </div>
                </div>
                 <div>
                   <label className="flex items-center space-x-2">
                        <input type="checkbox" name="weekends" checked={scheduleSettings?.weekends || false} onChange={handleSettingsChange} className="form-checkbox text-theme-primary bg-transparent" />
                        <span className="text-theme-text-primary">Rotation includes weekends</span>
                      </label>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
