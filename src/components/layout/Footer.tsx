import React from 'react';
import { ShieldCheck, BookOpen, GraduationCap } from 'lucide-react';
import {
  APP_VERSION,
  APP_RELEASE_DATE,
  INSTITUTIONAL_ATTRIBUTION,
} from '../../shared/constants/version.ts';

export interface FooterProps {
  onOpenDisclaimer: () => void;
  onOpenTheory: () => void;
  onOpenTutorial: () => void;
  onSelectTab: (tab: 'dashboard' | 'inbox' | 'history' | 'settings') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDisclaimer,
  onOpenTheory,
  onOpenTutorial,
  onSelectTab,
}) => {
  return (
    <footer className="border-t border-[#263A50] bg-[#08111F] text-xs text-[#A7B5C7] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Attribution */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-[#35E0D0] shrink-0" />
            <span className="font-semibold text-[#F1F5F9]">PhishLab</span>
            <span className="font-mono text-[11px] text-[#35E0D0] bg-[#35E0D0]/10 px-1.5 py-0.5 rounded border border-[#35E0D0]/30">
              {APP_VERSION}
            </span>
            <span className="hidden md:inline text-[11px] text-[#A7B5C7]">· {INSTITUTIONAL_ATTRIBUTION} ({APP_RELEASE_DATE})</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={onOpenTutorial}
              className="text-[#35E0D0] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tutorial guiado</span>
            </button>
            <span>·</span>
            <button
              onClick={onOpenTheory}
              className="text-[#F1F5F9] hover:text-[#35E0D0] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Marco teórico & referencias</span>
            </button>
            <span>·</span>
            <button
              onClick={onOpenDisclaimer}
              className="text-[#A7B5C7] hover:text-[#F1F5F9] transition-colors cursor-pointer"
            >
              Aviso ético
            </button>
            <span>·</span>
            <button
              onClick={() => onSelectTab('settings')}
              className="hover:text-[#F1F5F9] transition-colors cursor-pointer"
            >
              Configuración
            </button>
          </div>
        </div>

        <div className="text-[11px] text-[#A7B5C7]/70 text-center sm:text-left border-t border-[#263A50]/40 pt-3">
          Entorno pedagógico experimental sin captura de datos remotos · Todos los ejercicios son simulaciones ficticias sin fines de autenticación real.
        </div>
      </div>
    </footer>
  );
};
