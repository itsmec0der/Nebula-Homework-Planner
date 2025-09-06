
import React from 'react';
import type { Homework, Class } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface HomeworkItemProps {
  item: Homework;
  itemClass?: Class;
  onToggleComplete: (id: string) => void;
  onEdit: (item: Homework) => void;
  onDelete: (id: string) => void;
}

const HomeworkItem: React.FC<HomeworkItemProps> = ({ item, itemClass, onToggleComplete, onEdit, onDelete }) => {
  
  const completedSubtasks = item.subtasks?.filter(st => st.isComplete).length || 0;
  const totalSubtasks = item.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  
  const dueDate = new Date(item.dueDate);
  const isToday = new Date().toDateString() === dueDate.toDateString();

  return (
    <div className={`flex flex-col p-4 rounded-lg transition-all duration-300 group ${item.isComplete ? 'bg-theme-glass/50 opacity-60 scale-95' : 'bg-theme-glass/80 hover:scale-[1.02] hover:shadow-xl'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={() => onToggleComplete(item.id)}
          className="form-checkbox h-5 w-5 rounded-md border-theme-border text-theme-primary focus:ring-theme-primary bg-transparent flex-shrink-0"
        />
        <div className="flex-1 ml-4">
          <p className={`font-medium text-theme-text-primary ${item.isComplete ? 'line-through' : ''}`}>
            {item.title}
          </p>
          <div className="flex items-center text-sm text-theme-text-secondary space-x-4 mt-1">
            {itemClass && (
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: itemClass.color }}></span>
                <span>{itemClass.name}</span>
              </div>
            )}
            {!isToday && 
              <span>
                Due: {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            }
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(item)} className="p-2 text-theme-text-secondary hover:text-theme-primary transition-transform duration-200 hover:scale-110">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-2 text-theme-text-secondary hover:text-red-500 transition-transform duration-200 hover:scale-110">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {totalSubtasks > 0 && (
         <div className="mt-3 ml-9">
            <div className="flex justify-between items-center mb-1 text-xs text-theme-text-secondary">
                <span>Progress</span>
                <span>{completedSubtasks} / {totalSubtasks}</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-1.5">
                <div 
                  className="bg-theme-primary h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkItem;