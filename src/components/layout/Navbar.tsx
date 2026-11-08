import React from 'react';
import { ShieldCheck, PlayCircle, Menu, X, GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button.tsx';

export type NavTab = 'dashboard' | 'inbox' | 'history' | 'settings';

export interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickTrain: () => void;
  onOpenTutorial: () => void;
  onOpenTheory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickTrain,
  onOpenTutorial,
  onOpenTheory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inbox', label: 'Bandeja de entrada' },
    { id: 'history', label: 'Historial y métricas' },
    { id: 'settings', label: 'Configuración' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08111F]/95 backdrop-blur-md border-b border-[#263A50] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-[#F1F5F9] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#35E0D0] to-[#48C8F5] flex items-center justify-center text-[#08111F] font-black shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#08111F]" />
          </div>
          <span className="font-extrabold tracking-tight">PhishLab</span>
        </button>

        {/* Zone 2: Concise nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#A7B5C7]">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-[#35E0D0] font-semibold'
                    : 'hover:text-[#F1F5F9]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#35E0D0] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Modal triggers */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#35E0D0] hover:bg-[#122438] transition-colors border border-transparent hover:border-[#35E0D0]/30 cursor-pointer"
            title="Abrir práctica guiada interactiva"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Tutorial</span>
          </button>

          <button
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A7B5C7] hover:text-[#F1F5F9] hover:bg-[#122438] transition-colors cursor-pointer"
            title="Consultar marco teórico y referencias académicas"
          >
            <BookOpen className="w-4 h-4" />
            <span>Marco teórico</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            icon={<PlayCircle className="w-4 h-4" />}
            onClick={onQuickTrain}
          >
            Entrenar ahora
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#A7B5C7] hover:text-[#F1F5F9] hover:bg-[#122438] transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#263A50] bg-[#0D1B2A] px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#122438] text-[#35E0D0] font-semibold'
                    : 'text-[#A7B5C7] hover:bg-[#122438] hover:text-[#F1F5F9]'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#263A50] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTutorial();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#35E0D0] hover:bg-[#122438] flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Tutorial interactivo</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTheory();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#A7B5C7] hover:bg-[#122438] flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Marco teórico y referencias</span>
            </button>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              icon={<PlayCircle className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                onQuickTrain();
              }}
            >
              Entrenar ahora
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
