import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  ShieldCheck,
  Inbox,
  History,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Target,
} from 'lucide-react';
import { DashboardStats } from '../../domain/types/attempt.ts';
import { Exercise } from '../../domain/types/exercise.ts';
import { attemptRepository } from '../../infrastructure/repositories/AttemptRepository.ts';
import { exerciseRepository } from '../../infrastructure/repositories/ExerciseRepository.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';

export interface DashboardViewProps {
  onStartTraining: () => void;
  onGoToInbox: () => void;
  onGoToHistory: () => void;
  onSelectExercise: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartTraining,
  onGoToInbox,
  onGoToHistory,
  onSelectExercise,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const exList = await exerciseRepository.getAll();
      const loadedStats = await attemptRepository.getDashboardStats(exList.length);
      setExercises(exList);
      setStats(loadedStats);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#A7B5C7] space-y-3">
        <div className="w-8 h-8 border-2 border-[#35E0D0] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cargando panel de control...</span>
      </div>
    );
  }

  const hasAttempts = stats.totalAttempts > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1B2A] via-[#122438] to-[#0D1B2A] border border-[#263A50] p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35E0D0]/10 border border-[#35E0D0]/30 text-xs font-semibold text-[#35E0D0]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Laboratorio Educativo de Ciberseguridad</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F1F5F9] leading-tight">
            Entrenamiento interactivo en detección de phishing
          </h1>

          <p className="text-sm sm:text-base text-[#A7B5C7] leading-relaxed">
            Evalúa mensajes simulados de alta verosimilitud identificando señales lingüísticas de
            urgencia o presión, consistencia contextual en remitentes y dominios, y elementos
            visuales institucionales.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              icon={<PlayCircle className="w-5 h-5" />}
              onClick={onStartTraining}
            >
              Comenzar a entrenar
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Inbox className="w-5 h-5" />}
              onClick={onGoToInbox}
            >
              Bandeja de entrada
            </Button>

            <Button
              variant="ghost"
              size="lg"
              icon={<History className="w-5 h-5" />}
              onClick={onGoToHistory}
            >
              Historial de intentos
            </Button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      {hasAttempts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Exercises Completed */}
          <Card padding="md" className="space-y-1">
            <span className="text-xs font-semibold text-[#A7B5C7] block uppercase tracking-wider">
              Ejercicios completados
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#F1F5F9] tabular-nums">
              {stats.uniqueCompletedCount}
              <span className="text-sm text-[#A7B5C7] font-normal"> / {exercises.length}</span>
            </div>
            <span className="text-[11px] text-[#A7B5C7] block">
              {stats.totalAttempts} intento{stats.totalAttempts === 1 ? '' : 's'} en total
            </span>
          </Card>

          {/* Classification Accuracy */}
          <Card padding="md" className="space-y-1">
            <span className="text-xs font-semibold text-[#A7B5C7] block uppercase tracking-wider">
              Acierto de clasificación
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#4ADE80] tabular-nums">
              {stats.accuracyRate.toFixed(1)}%
            </div>
            <span className="text-[11px] text-[#A7B5C7] block">
              Proporción de mensajes correctamente catalogados
            </span>
          </Card>

          {/* Average Clues Detection Score */}
          <Card padding="md" className="space-y-1">
            <span className="text-xs font-semibold text-[#A7B5C7] block uppercase tracking-wider">
              Puntaje medio de indicios
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#35E0D0] tabular-nums">
              {stats.averageCluesScore.toFixed(1)}
              <span className="text-sm text-[#A7B5C7] font-normal"> / 100</span>
            </div>
            <span className="text-[11px] text-[#A7B5C7] block">
              F1 medio ponderado en selección de palabras
            </span>
          </Card>

          {/* Average Final Score */}
          <Card padding="md" className="space-y-1">
            <span className="text-xs font-semibold text-[#A7B5C7] block uppercase tracking-wider">
              Puntaje final medio
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#C4B5FD] tabular-nums">
              {stats.averageFinalScore.toFixed(1)}
              <span className="text-sm text-[#A7B5C7] font-normal"> / 100</span>
            </div>
            <span className="text-[11px] text-[#A7B5C7] block">
              Ponderación: 70% indicios + 30% clasificación
            </span>
          </Card>
        </div>
      ) : (
        /* Empty State */
        <Card padding="lg" className="text-center py-12 space-y-4 border-dashed border-[#263A50]">
          <div className="w-12 h-12 rounded-2xl bg-[#35E0D0]/10 border border-[#35E0D0]/30 flex items-center justify-center text-[#35E0D0] mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-[#F1F5F9]">
              Aún no hay intentos registrados
            </h3>
            <p className="text-xs sm:text-sm text-[#A7B5C7] leading-relaxed">
              Inicia tu primer ejercicio práctico para generar estadísticas de precisión, detección
              de indicios lingüísticos y análisis contextual.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<PlayCircle className="w-4 h-4" />}
            onClick={onStartTraining}
          >
            Iniciar primer ejercicio
          </Button>
        </Card>
      )}

      {/* Advanced Research Analytics: Frequent Errors and Category Recall */}
      {hasAttempts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frequent Errors Analysis */}
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#263A50] pb-3">
              <AlertTriangle className="w-5 h-5 text-[#FBBF24]" />
              <h2 className="text-base font-bold text-[#F1F5F9]">
                Patrones y errores frecuentes detectados
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0D1B2A] p-3 rounded-xl border border-[#263A50] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#F1F5F9] block">
                    Falsos Positivos de Clasificación
                  </span>
                  <span className="text-[#A7B5C7]">Mensajes legítimos catalogados como phishing</span>
                </div>
                <span className="font-mono font-bold text-base text-[#FB7185]">
                  {stats.frequentErrors.falsePositivesCount}
                </span>
              </div>

              <div className="bg-[#0D1B2A] p-3 rounded-xl border border-[#263A50] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#F1F5F9] block">
                    Falsos Negativos de Clasificación
                  </span>
                  <span className="text-[#A7B5C7]">Mensajes de phishing catalogados como legítimos</span>
                </div>
                <span className="font-mono font-bold text-base text-[#FB7185]">
                  {stats.frequentErrors.falseNegativesCount}
                </span>
              </div>

              <div className="bg-[#0D1B2A] p-3 rounded-xl border border-[#263A50] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#F1F5F9] block">
                    Incertidumbre no reconocida
                  </span>
                  <span className="text-[#A7B5C7]">
                    Casos de información insuficiente catalogados erróneamente
                  </span>
                </div>
                <span className="font-mono font-bold text-base text-[#FBBF24]">
                  {stats.frequentErrors.insufficientMisclassified}
                </span>
              </div>

              <div className="bg-[#0D1B2A] p-3 rounded-xl border border-[#263A50] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#F1F5F9] block">
                    Promedio de palabras irrelevantes marcadas
                  </span>
                  <span className="text-[#A7B5C7]">Selección de términos sin valor de indicio</span>
                </div>
                <span className="font-mono font-bold text-base text-[#35E0D0]">
                  {stats.frequentErrors.averageIrrelevantElementsSelected.toFixed(1)}
                </span>
              </div>
            </div>
          </Card>

          {/* Category Performance Breakdown */}
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#263A50] pb-3">
              <TrendingUp className="w-5 h-5 text-[#35E0D0]" />
              <h2 className="text-base font-bold text-[#F1F5F9]">
                Desempeño por dimensión analítica (Recall)
              </h2>
            </div>

            <div className="space-y-4">
              {/* Contextual */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#35E0D0]">Señales Contextuales (Remitente, Dominio, Enlaces)</span>
                  <span className="font-mono text-[#F1F5F9]">
                    {stats.categoryAverages.contextualRecall.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-[#0D1B2A] rounded-full overflow-hidden border border-[#263A50]">
                  <div
                    className="h-full bg-[#35E0D0] transition-all duration-300"
                    style={{ width: `${Math.min(100, stats.categoryAverages.contextualRecall)}%` }}
                  />
                </div>
              </div>

              {/* Linguistic */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#C4B5FD]">Señales Lingüísticas (Urgencia, Amenazas, Presión)</span>
                  <span className="font-mono text-[#F1F5F9]">
                    {stats.categoryAverages.linguisticRecall.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-[#0D1B2A] rounded-full overflow-hidden border border-[#263A50]">
                  <div
                    className="h-full bg-[#C4B5FD] transition-all duration-300"
                    style={{ width: `${Math.min(100, stats.categoryAverages.linguisticRecall)}%` }}
                  />
                </div>
              </div>

              {/* Visual */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#FBBF24]">Señales Visuales (Formatos, Sellos, Diseños)</span>
                  <span className="font-mono text-[#F1F5F9]">
                    {stats.categoryAverages.visualRecall.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-[#0D1B2A] rounded-full overflow-hidden border border-[#263A50]">
                  <div
                    className="h-full bg-[#FBBF24] transition-all duration-300"
                    style={{ width: `${Math.min(100, stats.categoryAverages.visualRecall)}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#A7B5C7] pt-2 leading-relaxed">
                El porcentaje refleja la tasa de indicios que identificas respecto a la totalidad de
                indicios presentes en cada dimensión evaluada.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Last Attempt Card */}
      {stats.lastAttempt && (
        <Card padding="md" className="bg-[#0D1B2A] border-[#263A50]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#A7B5C7] uppercase tracking-wider block">
                Último ejercicio evaluado
              </span>
              <h3 className="text-base font-bold text-[#F1F5F9] mt-0.5">
                {stats.lastAttempt.exerciseTitle}
              </h3>
              <p className="text-xs text-[#A7B5C7]">
                Puntaje final: {stats.lastAttempt.metrics.finalScore.toFixed(1)}/100 · F1 indicios:{' '}
                {stats.lastAttempt.metrics.f1.toFixed(3)}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onSelectExercise(stats.lastAttempt!.exerciseId)}
            >
              Revisar ejercicio
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
