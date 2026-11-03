import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        className={`relative w-full ${maxWidthClasses} bg-[#0D1B2A] border border-[#263A50] rounded-2xl shadow-2xl p-6 sm:p-7 z-10 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-[#F1F5F9] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-[#A7B5C7] mt-1 leading-relaxed">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="text-[#A7B5C7] hover:text-[#F1F5F9] p-1.5 rounded-lg hover:bg-[#122438] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-[#F1F5F9]">{children}</div>
      </div>
    </div>
  );
};
