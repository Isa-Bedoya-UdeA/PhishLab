import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Clock, ChevronRight, Inbox as InboxIcon } from 'lucide-react';
import { Exercise } from '../../domain/types/exercise.ts';
import { ExerciseAttempt } from '../../domain/types/attempt.ts';
import { exerciseRepository } from '../../infrastructure/repositories/ExerciseRepository.ts';
import { attemptRepository } from '../../infrastructure/repositories/AttemptRepository.ts';
import { Card } from '../../components/ui/Card.tsx';

export interface InboxViewProps {
  onSelectExercise: (id: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ onSelectExercise }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [latestAttempts, setLatestAttempts] = useState<Map<string, ExerciseAttempt>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const allExercises = await exerciseRepository.getAll();
      const allAttempts = await attemptRepository.getAllAttempts();

      const attemptsMap = new Map<string, ExerciseAttempt>();
      for (const att of allAttempts) {
        if (!attemptsMap.has(att.exerciseId)) {
          attemptsMap.set(att.exerciseId, att);
        }
      }

      setExercises(allExercises);
      setLatestAttempts(attemptsMap);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#A7B5C7] space-y-3">
        <div className="w-8 h-8 border-2 border-[#35E0D0] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cargando bandeja de entrada simulada...</span>
      </div>
    );
  }

  const completedCount = latestAttempts.size;
  const totalCount = exercises.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Inbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#263A50]">
        <div>
          <div className="flex items-center gap-2">
            <InboxIcon className="w-6 h-6 text-[#35E0D0]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9]">
              Bandeja de entrada simulada
            </h1>
          </div>
          <p className="text-xs text-[#A7B5C7] mt-1">
            Explore los correos recibidos y seleccione uno para analizar sus características y responder.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#122438] px-3 py-1.5 rounded-lg border border-[#263A50]">
          <span className="text-[#A7B5C7]">Progreso:</span>
          <span className="text-[#35E0D0] font-bold">
            {completedCount} / {totalCount} completados
          </span>
        </div>
      </div>

      {/* Email List */}
      <div className="space-y-2.5">
        {exercises.map((ex) => {
          const attempt = latestAttempts.get(ex.id);
          const isCompleted = Boolean(attempt);

          return (
            <Card
              key={ex.id}
              variant="interactive"
              padding="none"
              onClick={() => onSelectExercise(ex.id)}
              className="overflow-hidden transition-all duration-150 group"
            >
              <div className="p-4 sm:p-5 flex items-start gap-4">
                {/* Status Indicator */}
                <div className="pt-0.5 shrink-0">
                  {isCompleted ? (
                    <div
                      className="w-8 h-8 rounded-lg bg-[#4ADE80]/15 border border-[#4ADE80]/40 flex items-center justify-center text-[#4ADE80]"
                      title="Ejercicio completado previamente"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-lg bg-[#122438] border border-[#263A50] flex items-center justify-center text-[#35E0D0]"
                      title="Ejercicio pendiente"
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Email Summary */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F1F5F9] truncate">{ex.senderName}</span>
                      <span className="text-[#A7B5C7] truncate font-mono text-[11px] hidden sm:inline">
                        &lt;{ex.senderAddress}&gt;
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#A7B5C7] shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ex.dateLabel}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[#F1F5F9] group-hover:text-[#35E0D0] transition-colors truncate">
                    {ex.subject}
                  </h3>

                  <p className="text-xs text-[#A7B5C7] line-clamp-1 leading-relaxed">
                    {ex.preview}
                  </p>

                  {/* Completion Score Tag if done */}
                  {isCompleted && attempt && (
                    <div className="pt-1 flex items-center gap-3 text-[11px] font-mono">
                      <span className="text-[#4ADE80] font-medium">
                        Puntaje obtenido: {attempt.metrics.finalScore.toFixed(1)}/100
                      </span>
                      <span className="text-[#A7B5C7]">·</span>
                      <span className="text-[#A7B5C7]">
                        F1 Indicios: {attempt.metrics.f1.toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow Action */}
                <div className="shrink-0 pt-3 text-[#A7B5C7] group-hover:text-[#35E0D0] group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
