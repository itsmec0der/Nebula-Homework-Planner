
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  confirmVariant = 'danger' 
}) => {
  if (!isOpen) return null;

  const confirmButtonColor = confirmVariant === 'danger'
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-theme-primary hover:opacity-90';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-theme-glass border border-theme-border rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-zoomIn">
        <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full ${confirmVariant === 'danger' ? 'bg-red-500/20' : 'bg-theme-primary/20'} flex items-center justify-center mb-4`}>
                <AlertTriangle size={32} className={confirmVariant === 'danger' ? 'text-red-500' : 'text-theme-primary'} />
            </div>
            <h2 className="text-2xl font-bold text-theme-text-primary mb-2">{title}</h2>
            <p className="text-theme-text-secondary mb-8">{message}</p>
            <div className="flex justify-center gap-4 w-full">
                <button onClick={onClose} className="flex-1 px-6 py-2 bg-black/20 text-white font-semibold rounded-lg hover:bg-black/40 transition-colors">
                    Cancel
                </button>
                <button onClick={onConfirm} className={`flex-1 px-6 py-2 text-white font-semibold rounded-lg transition-colors shadow-md ${confirmButtonColor}`}>
                    {confirmText}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
