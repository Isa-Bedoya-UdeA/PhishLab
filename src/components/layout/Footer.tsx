import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface FooterProps {
  onOpenDisclaimer: () => void;
  onSelectTab: (tab: 'dashboard' | 'inbox' | 'history' | 'settings') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDisclaimer, onSelectTab }) => {
  return (
    <footer className="border-t border-[#263A50] bg-[#08111F] text-xs text-[#A7B5C7] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Mission Statement */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#35E0D0]" />
          <span className="font-semibold text-[#F1F5F9]">PhishLab</span>
          <span>— Laboratorio Educativo de Ciberseguridad</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="hover:text-[#F1F5F9] transition-colors"
          >
            Dashboard
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectTab('inbox')}
            className="hover:text-[#F1F5F9] transition-colors"
          >
            Bandeja
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectTab('history')}
            className="hover:text-[#F1F5F9] transition-colors"
          >
            Historial
          </button>
          <span>·</span>
          <button
            onClick={onOpenDisclaimer}
            className="text-[#35E0D0] hover:text-[#48C8F5] transition-colors font-medium underline underline-offset-2"
          >
            Aviso de simulación
          </button>
        </div>
      </div>
    </footer>
  );
};
