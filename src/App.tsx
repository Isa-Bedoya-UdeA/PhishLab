import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { DisclaimerModal } from './components/layout/DisclaimerModal.tsx';
import { TutorialModal } from './features/onboarding/TutorialModal.tsx';
import { ConceptualFrameworkModal } from './features/theory/ConceptualFrameworkModal.tsx';
import { DashboardView } from './features/dashboard/DashboardView.tsx';
import { InboxView } from './features/inbox/InboxView.tsx';
import { ExerciseView } from './features/exercise/ExerciseView.tsx';
import { ProgressHistoryView } from './features/progress/ProgressHistoryView.tsx';
import { SettingsView } from './features/settings/SettingsView.tsx';
import { safeStorage, STORAGE_KEYS } from './infrastructure/storage/localStorage.ts';
import { exerciseRepository } from './infrastructure/repositories/ExerciseRepository.ts';
import { attemptRepository } from './infrastructure/repositories/AttemptRepository.ts';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Check first-time disclaimer prompt
  useEffect(() => {
    const hasAcceptedDisclaimer = safeStorage.getItem<boolean>(
      STORAGE_KEYS.DISCLAIMER_ACCEPTED,
      false
    );
    if (!hasAcceptedDisclaimer) {
      setIsDisclaimerOpen(true);
    } else {
      // If disclaimer was already accepted, check if tutorial was completed
      const hasCompletedTutorial = safeStorage.getItem<boolean>(
        STORAGE_KEYS.TUTORIAL_COMPLETED,
        false
      );
      if (!hasCompletedTutorial) {
        setIsTutorialOpen(true);
      }
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    safeStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, true);
    setIsDisclaimerOpen(false);

    // Offer onboarding tutorial right after disclaimer acceptance
    const hasCompletedTutorial = safeStorage.getItem<boolean>(
      STORAGE_KEYS.TUTORIAL_COMPLETED,
      false
    );
    if (!hasCompletedTutorial) {
      setIsTutorialOpen(true);
    }
  };

  const handleSelectExercise = (id: string) => {
    setActiveExerciseId(id);
    setCurrentTab('inbox');
  };

  const handleBackToInbox = () => {
    setActiveExerciseId(null);
    setCurrentTab('inbox');
  };

  const handleGoToDashboard = () => {
    setActiveExerciseId(null);
    setCurrentTab('dashboard');
  };

  const handleQuickTrain = async () => {
    const exercises = await exerciseRepository.getAll();
    if (exercises.length === 0) return;

    // Find first exercise that has not been attempted yet
    const attempts = await attemptRepository.getAllAttempts();
    const completedIds = new Set(attempts.map((a) => a.exerciseId));
    const firstUncompleted = exercises.find((e) => !completedIds.has(e.id));

    if (firstUncompleted) {
      setActiveExerciseId(firstUncompleted.id);
    } else {
      // If all completed, start with the first one
      setActiveExerciseId(exercises[0].id);
    }
    setCurrentTab('inbox');
  };

  const handleDataReset = () => {
    setActiveExerciseId(null);
    setCurrentTab('dashboard');
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#08111F] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#35E0D0]/30 selection:text-[#35E0D0]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveExerciseId(null);
          setCurrentTab(tab);
        }}
        onQuickTrain={handleQuickTrain}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenTheory={() => setIsTheoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeExerciseId ? (
          <ExerciseView
            key={`${activeExerciseId}-${refreshKey}`}
            exerciseId={activeExerciseId}
            onSelectExercise={(id) => setActiveExerciseId(id)}
            onBackToInbox={handleBackToInbox}
            onGoToDashboard={handleGoToDashboard}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                key={`dash-${refreshKey}`}
                onStartTraining={handleQuickTrain}
                onGoToInbox={() => setCurrentTab('inbox')}
                onGoToHistory={() => setCurrentTab('history')}
                onSelectExercise={handleSelectExercise}
                onOpenTutorial={() => setIsTutorialOpen(true)}
              />
            )}
            {currentTab === 'inbox' && (
              <InboxView
                key={`inbox-${refreshKey}`}
                onSelectExercise={handleSelectExercise}
              />
            )}
            {currentTab === 'history' && (
              <ProgressHistoryView
                key={`hist-${refreshKey}`}
                onSelectExercise={handleSelectExercise}
              />
            )}
            {currentTab === 'settings' && (
              <SettingsView
                onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
                onOpenTheory={() => setIsTheoryOpen(true)}
                onOpenTutorial={() => setIsTutorialOpen(true)}
                onDataReset={handleDataReset}
                onGoToHistory={() => setCurrentTab('history')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onSelectTab={(tab) => {
          setActiveExerciseId(null);
          setCurrentTab(tab);
        }}
      />

      {/* First-time & On-demand Simulation Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onAccept={handleAcceptDisclaimer}
      />

      {/* Interactive Guided Onboarding Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onComplete={() => {
          setIsTutorialOpen(false);
          handleQuickTrain();
        }}
      />

      {/* Conceptual Framework and Academic Citations Modal */}
      <ConceptualFrameworkModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
    </div>
  );
};
