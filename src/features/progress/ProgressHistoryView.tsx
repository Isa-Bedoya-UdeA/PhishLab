import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileSpreadsheet,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { ExerciseAttempt } from '../../domain/types/attempt.ts';
import { Exercise } from '../../domain/types/exercise.ts';
import { attemptRepository } from '../../infrastructure/repositories/AttemptRepository.ts';
import { exerciseRepository } from '../../infrastructure/repositories/ExerciseRepository.ts';
import {
  downloadExerciseResultsCsv,
  downloadClueResultsCsv,
  downloadClueSummaryCsv,
  downloadAllCsvFiles,
  calculateCluesSummary,
  ClueSummaryItem,
} from '../../shared/utils/csvExport.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';

export interface ProgressHistoryViewProps {
  onSelectExercise: (id: string) => void;
}

export const ProgressHistoryView: React.FC<ProgressHistoryViewProps> = ({ onSelectExercise }) => {
  const [attempts, setAttempts] = useState<ExerciseAttempt[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'attempts' | 'clues_analysis'>('attempts');
  const [clueFilter, setClueFilter] = useState<'all' | 'clues_only' | 'neutral_only'>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [list, exList] = await Promise.all([
        attemptRepository.getAllAttempts(),
        exerciseRepository.getAll(),
      ]);
      setAttempts(list);
      setExercises(exList);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#A7B5C7] space-y-3">
        <div className="w-8 h-8 border-2 border-[#35E0D0] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cargando historial de intentos y datos de investigación...</span>
      </div>
    );
  }

  const cluesSummary: ClueSummaryItem[] = calculateCluesSummary(attempts, exercises);

  // Top insights for researchers
  const realClues = cluesSummary.filter((c) => c.isRelevantClue && c.totalExposed > 0);
  const neutralElements = cluesSummary.filter((c) => !c.isRelevantClue && c.totalExposed > 0);

  // Most recognized clues
  const mostRecognizedClues = [...realClues]
    .sort((a, b) => b.recognitionRatePct - a.recognitionRatePct)
    .slice(0, 3);

  // Most missed clues (highest omission rate)
  const mostMissedClues = [...realClues]
    .sort((a, b) => b.omissionRatePct - a.omissionRatePct)
    .slice(0, 3);

  // Most false-alarmed legitimate/neutral elements
  const mostFalseAlarmed = [...neutralElements]
    .sort((a, b) => b.falseAlarmRatePct - a.falseAlarmRatePct)
    .slice(0, 3);

  const filteredClues = cluesSummary.filter((c) => {
    if (clueFilter === 'clues_only') return c.isRelevantClue;
    if (clueFilter === 'neutral_only') return !c.isRelevantClue;
    return true;
  });

  const getClassificationBadge = (cls: ExerciseAttempt['selectedClassification']) => {
    switch (cls) {
      case 'legitimate':
        return <span className="text-[#4ADE80] font-medium text-xs">Legítimo</span>;
      case 'phishing':
        return <span className="text-[#FB7185] font-medium text-xs">Phishing</span>;
      case 'insufficient_information':
        return <span className="text-[#FBBF24] font-medium text-xs">Insuficiente</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263A50]">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-[#35E0D0]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9]">
              Registro de Resultados y Exportación para Investigación
            </h1>
          </div>
          <p className="text-xs text-[#A7B5C7] mt-1">
            Captura de decisiones individuales por indicio, cálculo de métricas agregadas y exportación
            en archivos CSV estructurados para análisis estadístico.
          </p>
        </div>
      </div>

      {/* Export Center Card */}
      {attempts.length > 0 && (
        <Card padding="md" className="bg-[#0D1B2A] border-[#263A50] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#263A50] pb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#35E0D0]">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportación de datos de investigación (CSV)</span>
            </div>
            <span className="text-[11px] text-[#A7B5C7]">
              Formatos delimitados por coma compatibles con Excel, Python (pandas) y R
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {/* All 3 CSVs */}
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => downloadAllCsvFiles(attempts, exercises)}
              className="w-full"
            >
              Descargar 3 CSVs (Paquete)
            </Button>

            {/* Exercise Results CSV */}
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-[#35E0D0]" />}
              onClick={() => downloadExerciseResultsCsv(attempts)}
              className="w-full text-xs"
            >
              resultados_ejercicios.csv
            </Button>

            {/* Clue Granular Results CSV */}
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-[#48C8F5]" />}
              onClick={() => downloadClueResultsCsv(attempts, exercises)}
              className="w-full text-xs"
            >
              resultados_indicios.csv
            </Button>

            {/* Clue Summary CSV */}
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-[#C4B5FD]" />}
              onClick={() => downloadClueSummaryCsv(attempts, exercises)}
              className="w-full text-xs"
            >
              resumen_indicios.csv
            </Button>
          </div>
        </Card>
      )}

      {/* Navigation Sub-Tabs */}
      {attempts.length > 0 && (
        <div className="flex items-center gap-2 border-b border-[#263A50] pb-2">
          <button
            onClick={() => setActiveTab('attempts')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              activeTab === 'attempts'
                ? 'bg-[#35E0D0] text-[#08111F] border-[#35E0D0] font-bold'
                : 'bg-[#122438] text-[#A7B5C7] border-[#263A50] hover:text-[#F1F5F9]'
            }`}
          >
            Historial de intentos ({attempts.length})
          </button>
          <button
            onClick={() => setActiveTab('clues_analysis')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              activeTab === 'clues_analysis'
                ? 'bg-[#35E0D0] text-[#08111F] border-[#35E0D0] font-bold'
                : 'bg-[#122438] text-[#A7B5C7] border-[#263A50] hover:text-[#F1F5F9]'
            }`}
          >
            Analítica agregada por indicio ({cluesSummary.length} elementos)
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {attempts.length === 0 ? (
        <Card padding="lg" className="text-center py-16 space-y-3 border-dashed border-[#263A50]">
          <History className="w-10 h-10 text-[#A7B5C7] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#F1F5F9]">No hay registros de intentos aún</h3>
          <p className="text-xs text-[#A7B5C7] max-w-sm mx-auto">
            Completa tu primer análisis en la bandeja de entrada para visualizar la tabla cronológica
            y descargar los datos científicos en formato CSV.
          </p>
        </Card>
      ) : activeTab === 'attempts' ? (
        /* TAB 1: Attempts by Exercise */
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-[#263A50] bg-[#0D1B2A]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#263A50] bg-[#122438] text-[#A7B5C7] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Intento</th>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Ejercicio</th>
                  <th className="py-3 px-4">Clasificación Elegida</th>
                  <th className="py-3 px-4 text-center">Acierto General</th>
                  <th className="py-3 px-4 text-center">TP / FP / FN</th>
                  <th className="py-3 px-4 text-right">F1 Indicios</th>
                  <th className="py-3 px-4 text-right">Puntaje Final</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263A50] font-sans">
                {attempts.map((att, idx) => {
                  const isCorrect = att.metrics.isClassificationCorrect;
                  const dateStr = new Date(att.completedAt).toLocaleString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const anonId = `PART-${String(attempts.length - idx).padStart(4, '0')}`;

                  return (
                    <tr key={att.id} className="hover:bg-[#122438]/50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-[#35E0D0] font-mono font-medium">
                        {anonId}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[#A7B5C7] font-mono">{dateStr}</td>
                      <td className="py-3 px-4 font-semibold text-[#F1F5F9] max-w-xs truncate">
                        {att.exerciseTitle}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getClassificationBadge(att.selectedClassification)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-[#4ADE80] font-medium font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sí</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#FB7185] font-medium font-mono">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap font-mono text-[11px]">
                        <span className="text-[#4ADE80]">{att.metrics.tp}</span> /{' '}
                        <span className="text-[#FB7185]">{att.metrics.fp}</span> /{' '}
                        <span className="text-[#FBBF24]">{att.metrics.fn}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#35E0D0] whitespace-nowrap tabular-nums">
                        {att.metrics.f1.toFixed(3)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#F1F5F9] whitespace-nowrap tabular-nums">
                        {att.metrics.finalScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectExercise(att.exerciseId)}
                          className="text-[#35E0D0] hover:text-[#48C8F5] font-medium text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Revisar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-[#A7B5C7] flex flex-wrap items-center justify-between gap-3 px-1">
            <span>
              Mostrando {attempts.length} intento{attempts.length === 1 ? '' : 's'} guardados localmente.
            </span>
            <span className="font-mono text-[#35E0D0]">
              Matriz: TP = Indicios correctos | FP = Selecciones erradas | FN = Indicios omitidos
            </span>
          </div>
        </div>
      ) : (
        /* TAB 2: Clues Analytics (Aggregated) */
        <div className="space-y-6">
          {/* Top Research Insight Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Most Recognized Clues */}
            <Card padding="md" className="space-y-2 border-[#4ADE80]/30">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4ADE80] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Indicios más reconocidos</span>
              </span>
              <p className="text-[11px] text-[#A7B5C7]">Señales de phishing identificadas con mayor tasa:</p>
              <div className="space-y-1.5 pt-1">
                {mostRecognizedClues.length > 0 ? (
                  mostRecognizedClues.map((c) => (
                    <div
                      key={c.elementId}
                      className="bg-[#08111F] p-2 rounded-lg border border-[#263A50] text-xs flex justify-between items-center"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[#F1F5F9] font-medium block truncate">"{c.text}"</span>
                        <span className="text-[10px] text-[#A7B5C7]">{c.subcategory}</span>
                      </div>
                      <span className="font-mono font-bold text-[#4ADE80] text-xs shrink-0">
                        {c.recognitionRatePct.toFixed(0)}% ({c.totalTP}/{c.totalExposed})
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#A7B5C7]">Sin datos de señales evaluadas</span>
                )}
              </div>
            </Card>

            {/* Most Missed Clues */}
            <Card padding="md" className="space-y-2 border-[#FBBF24]/30">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FBBF24] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Señales más inadvertidas</span>
              </span>
              <p className="text-[11px] text-[#A7B5C7]">Señales de phishing que pasaron desapercibidas:</p>
              <div className="space-y-1.5 pt-1">
                {mostMissedClues.length > 0 ? (
                  mostMissedClues.map((c) => (
                    <div
                      key={c.elementId}
                      className="bg-[#08111F] p-2 rounded-lg border border-[#263A50] text-xs flex justify-between items-center"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[#F1F5F9] font-medium block truncate">"{c.text}"</span>
                        <span className="text-[10px] text-[#A7B5C7]">{c.subcategory}</span>
                      </div>
                      <span className="font-mono font-bold text-[#FBBF24] text-xs shrink-0">
                        {c.omissionRatePct.toFixed(0)}% omitido
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#A7B5C7]">Sin datos de señales evaluadas</span>
                )}
              </div>
            </Card>

            {/* Legitimate Elements causing False Alarms */}
            <Card padding="md" className="space-y-2 border-[#FB7185]/30">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FB7185] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Falsas sospechas (Falsos Positivos)</span>
              </span>
              <p className="text-[11px] text-[#A7B5C7]">Elementos legítimos marcados como sospechosos:</p>
              <div className="space-y-1.5 pt-1">
                {mostFalseAlarmed.length > 0 ? (
                  mostFalseAlarmed.map((c) => (
                    <div
                      key={c.elementId}
                      className="bg-[#08111F] p-2 rounded-lg border border-[#263A50] text-xs flex justify-between items-center"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[#F1F5F9] font-medium block truncate">"{c.text}"</span>
                        <span className="text-[10px] text-[#A7B5C7]">{c.subcategory}</span>
                      </div>
                      <span className="font-mono font-bold text-[#FB7185] text-xs shrink-0">
                        {c.falseAlarmRatePct.toFixed(0)}% error ({c.totalFP}/{c.totalExposed})
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#A7B5C7]">Sin falsas alarmas registradas</span>
                )}
              </div>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#F1F5F9]">
              Tabla consolidada de indicios evaluables ({filteredClues.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setClueFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  clueFilter === 'all'
                    ? 'bg-[#122438] text-[#35E0D0] border-[#35E0D0] font-semibold'
                    : 'bg-[#0D1B2A] text-[#A7B5C7] border-[#263A50]'
                }`}
              >
                Todos los elementos
              </button>
              <button
                onClick={() => setClueFilter('clues_only')}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  clueFilter === 'clues_only'
                    ? 'bg-[#122438] text-[#35E0D0] border-[#35E0D0] font-semibold'
                    : 'bg-[#0D1B2A] text-[#A7B5C7] border-[#263A50]'
                }`}
              >
                Solo indicios reales (Phishing)
              </button>
              <button
                onClick={() => setClueFilter('neutral_only')}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  clueFilter === 'neutral_only'
                    ? 'bg-[#122438] text-[#35E0D0] border-[#35E0D0] font-semibold'
                    : 'bg-[#0D1B2A] text-[#A7B5C7] border-[#263A50]'
                }`}
              >
                Solo elementos legítimos / neutros
              </button>
            </div>
          </div>

          {/* Complete Clues Aggregate Table */}
          <div className="overflow-x-auto rounded-xl border border-[#263A50] bg-[#0D1B2A]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#263A50] bg-[#122438] text-[#A7B5C7] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Ejercicio</th>
                  <th className="py-3 px-3">Elemento Evaluado</th>
                  <th className="py-3 px-3">Dimensión</th>
                  <th className="py-3 px-3">Subcategoría</th>
                  <th className="py-3 px-3 text-center">Referencia</th>
                  <th className="py-3 px-3 text-center">Expuestos (N)</th>
                  <th className="py-3 px-3 text-center">TP</th>
                  <th className="py-3 px-3 text-center">FN</th>
                  <th className="py-3 px-3 text-center">FP</th>
                  <th className="py-3 px-3 text-center">TN</th>
                  <th className="py-3 px-3 text-right">Tasa Reconocimiento</th>
                  <th className="py-3 px-3 text-right">Tasa Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263A50] font-sans">
                {filteredClues.map((item) => {
                  return (
                    <tr key={`${item.exerciseId}-${item.elementId}`} className="hover:bg-[#122438]/40">
                      <td className="py-2.5 px-3 text-[#A7B5C7] font-mono text-[11px] whitespace-nowrap">
                        {item.exerciseId}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#F1F5F9] max-w-xs truncate" title={item.text}>
                        {item.text}
                      </td>
                      <td className="py-2.5 px-3 text-[#C4B5FD] whitespace-nowrap">{item.category}</td>
                      <td className="py-2.5 px-3 text-[#A7B5C7] whitespace-nowrap font-mono text-[11px]">
                        {item.subcategory}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {item.isRelevantClue ? (
                          <span className="text-[#FB7185] font-semibold">Indicio Real</span>
                        ) : (
                          <span className="text-[#A7B5C7]">Neutro/Legítimo</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#F1F5F9]">
                        {item.totalExposed}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-[#4ADE80]">{item.totalTP}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-[#FBBF24]">{item.totalFN}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-[#FB7185]">{item.totalFP}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-[#A7B5C7]">{item.totalTN}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#4ADE80] whitespace-nowrap">
                        {item.totalExposed > 0 ? `${item.recognitionRatePct.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#FB7185] whitespace-nowrap">
                        {item.totalExposed > 0
                          ? item.isRelevantClue
                            ? `${item.omissionRatePct.toFixed(1)}% (FN)`
                            : `${item.falseAlarmRatePct.toFixed(1)}% (FP)`
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
