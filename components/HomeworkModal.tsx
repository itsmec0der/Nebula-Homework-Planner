
import React, { useState, useEffect } from 'react';
import type { Homework, Class, Subtask } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (homework: Homework) => void;
  classes: Class[];
  homework: Homework | Partial<Homework> | null;
}

const HomeworkModal: React.FC<HomeworkModalProps> = ({ isOpen, onClose, onSubmit, classes, homework }) => {
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  const [newSubtask, setNewSubtask] = useState('');
  const [newReminder, setNewReminder] = useState('');


  useEffect(() => {
    if (homework) {
      setTitle(homework.title || '');
      setClassId(homework.classId || (classes.length > 0 ? classes[0].id : ''));
      const initialDate = homework.dueDate ? new Date(homework.dueDate) : new Date();
      setDueDate(initialDate.toISOString().split('T')[0]);
      setNotes(homework.notes || '');
      setSubtasks(homework.subtasks || []);
      setReminders(homework.reminders || []);
    } else {
      setTitle('');
      setClassId(classes.length > 0 ? classes[0].id : '');
      setDueDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setSubtasks([]);
      setReminders([]);
    }
     setNewSubtask('');
     setNewReminder('');
  }, [homework, isOpen, classes]);
  
  const handleAddSubtask = () => {
    if(newSubtask.trim()){
      setSubtasks([...subtasks, {id: Date.now().toString(), title: newSubtask.trim(), isComplete: false}]);
      setNewSubtask('');
    }
  }
  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => st.id === id ? {...st, isComplete: !st.isComplete} : st));
  }
  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  }

  const handleAddReminder = () => {
    if(newReminder){
      setReminders([...reminders, new Date(newReminder).toISOString()]);
      setNewReminder('');
    }
  }
  const deleteReminder = (reminder: string) => {
    setReminders(reminders.filter(r => r !== reminder));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !classId || !dueDate) return;

    const isEditing = homework && 'id' in homework;
    onSubmit({
      id: isEditing ? homework.id : Date.now().toString(),
      title,
      classId,
      dueDate: new Date(dueDate + "T00:00:00").toISOString(),
      notes,
      isComplete: isEditing ? homework.isComplete : false,
      subtasks,
      reminders,
    });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-theme-glass border border-theme-border rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 relative animate-zoomIn max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-theme-text-secondary hover:text-theme-text-primary transition-colors z-10">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-theme-text-primary mb-6">{homework && 'id' in homework ? 'Edit Homework' : 'Add Homework'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Core Details */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-theme-text-secondary mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-theme-text-secondary mb-1">Class</label>
              <select id="class" value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition" required>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-theme-text-secondary mb-1">Due Date</label>
              <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition" required />
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-theme-text-secondary mb-1">Notes</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition" />
          </div>
          
          {/* Subtasks */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-theme-text-secondary">Subtasks</label>
            <div className="flex gap-2">
              <input type="text" value={newSubtask} onChange={e => setNewSubtask(e.target.value)} placeholder="Add a subtask..." className="flex-grow bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition" />
              <button type="button" onClick={handleAddSubtask} className="p-2 bg-theme-secondary text-white rounded-lg hover:opacity-90"><Plus size={20}/></button>
            </div>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center bg-black/10 p-2 rounded-md">
                  <input type="checkbox" checked={st.isComplete} onChange={() => toggleSubtask(st.id)} className="form-checkbox h-4 w-4 rounded border-theme-border text-theme-primary bg-transparent"/>
                  <span className={`ml-2 flex-grow text-theme-text-primary text-sm ${st.isComplete ? 'line-through' : ''}`}>{st.title}</span>
                  <button type="button" onClick={() => deleteSubtask(st.id)} className="text-theme-text-secondary hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
           <div className="space-y-2">
            <label className="block text-sm font-medium text-theme-text-secondary">Reminders</label>
            <div className="flex gap-2">
                <input type="datetime-local" value={newReminder} onChange={e => setNewReminder(e.target.value)} className="flex-grow bg-black/20 border border-theme-border rounded-lg p-2 text-theme-text-primary focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition" />
                <button type="button" onClick={handleAddReminder} className="p-2 bg-theme-secondary text-white rounded-lg hover:opacity-90"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
                {reminders.map(r => (
                    <div key={r} className="flex items-center gap-2 bg-black/10 px-2 py-1 rounded-full text-xs">
                        <span className="text-theme-text-secondary">{new Date(r).toLocaleString()}</span>
                        <button type="button" onClick={() => deleteReminder(r)} className="text-theme-text-secondary hover:text-red-500"><X size={14}/></button>
                    </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="px-6 py-2 bg-theme-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md">
              {homework && 'id' in homework ? 'Save Changes' : 'Add Homework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeworkModal;