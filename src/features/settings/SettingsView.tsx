import React, { useState } from 'react';
import {
  Settings,
  ShieldAlert,
  Trash2,
  BookOpen,
  Database,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Layers,
  FileDown,
} from 'lucide-react';
import { safeStorage } from '../../infrastructure/storage/localStorage.ts';
import {
  APP_VERSION,
  APP_RELEASE_DATE,
  RESEARCH_PROJECT_NAME,
  INSTITUTIONAL_ATTRIBUTION,
  RESEARCH_QUESTION,
  PROTOTYPE_SCOPE_LIMITATIONS,
} from '../../shared/constants/version.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Modal } from '../../components/ui/Modal.tsx';

export interface SettingsViewProps {
  onOpenDisclaimer: () => void;
  onOpenTheory: () => void;
  onOpenTutorial: () => void;
  onDataReset: () => void;
  onGoToHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenDisclaimer,
  onOpenTheory,
  onOpenTutorial,
  onDataReset,
  onGoToHistory,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleConfirmReset = () => {
    safeStorage.clearAllPhishLabData();
    setShowConfirmReset(false);
    setResetSuccess(true);
    onDataReset();
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-[#263A50] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#35E0D0]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9]">
              Configuración y Marco del Laboratorio
            </h1>
          </div>
          <p className="text-xs text-[#A7B5C7] mt-1">
            Gobernanza del almacenamiento local, fundamentación académica y control del prototipo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#35E0D0]/10 text-[#35E0D0] border border-[#35E0D0]/30 font-semibold">
            {APP_VERSION}
          </span>
          <span className="text-xs text-[#A7B5C7]">({APP_RELEASE_DATE})</span>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-[#4ADE80]/15 border border-[#4ADE80]/40 rounded-xl text-xs text-[#4ADE80] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>El progreso y los intentos guardados localmente han sido restablecidos con éxito.</span>
        </div>
      )}

      {/* Research Project Description */}
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#35E0D0]">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#F1F5F9]">
              Proyecto y Pregunta de Investigación
            </h2>
          </div>
          <Button variant="secondary" size="sm" icon={<BookOpen className="w-4 h-4" />} onClick={onOpenTheory}>
            Ver marco teórico completo
          </Button>
        </div>

        <blockquote className="border-l-2 border-[#35E0D0] pl-3 py-1.5 text-sm font-medium text-[#F1F5F9] italic bg-[#08111F]/50 rounded-r-lg">
          «{RESEARCH_QUESTION}»
        </blockquote>

        <div className="text-xs text-[#A7B5C7] space-y-1.5 leading-relaxed">
          <p>
            <strong className="text-[#F1F5F9]">{RESEARCH_PROJECT_NAME}</strong> · {INSTITUTIONAL_ATTRIBUTION}.
          </p>
          <p>
            PhishLab evalúa de forma empírica la brecha entre clasificar intuitivamente un correo y detectar con precisión técnica sus evidencias lingüísticas, visuales y contextuales.
          </p>
        </div>
      </Card>

      {/* Interactive Guided Practice & Simulation Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Onboarding Tutorial Access */}
        <Card padding="md" className="space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#35E0D0]">
              <GraduationCap className="w-5 h-5" />
              <h3 className="text-sm font-bold text-[#F1F5F9]">
                Tutorial Interactivo y Práctica
              </h3>
            </div>
            <p className="text-xs text-[#A7B5C7] leading-relaxed">
              Vuelve a realizar el recorrido guiado para practicar la selección de palabras y la inspección de enlaces sin afectar tus métricas de investigación.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<GraduationCap className="w-4 h-4" />}
            onClick={onOpenTutorial}
            className="self-start"
          >
            Abrir tutorial guiado
          </Button>
        </Card>

        {/* Ethical Simulation Notice */}
        <Card padding="md" className="space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#48C8F5]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-[#F1F5F9]">
                Aviso de Entorno Simulado
              </h3>
            </div>
            <p className="text-xs text-[#A7B5C7] leading-relaxed">
              Consulta la declaración de neutralidad ética sobre el carácter ficticio de todos los remitentes, instituciones y direcciones presentadas.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<ShieldAlert className="w-4 h-4" />}
            onClick={onOpenDisclaimer}
            className="self-start"
          >
            Consultar aviso ético
          </Button>
        </Card>
      </div>

      {/* Local Storage Transparency & Data Loss Warning (Requirement 3.3) */}
      <Card padding="lg" className="space-y-4 border-[#263A50]">
        <div className="flex items-center gap-2 text-[#C4B5FD]">
          <Database className="w-5 h-5" />
          <h2 className="text-base font-bold text-[#F1F5F9]">
            Transparencia del Almacenamiento Local y Resguardo de Datos
          </h2>
        </div>

        {/* Highlighted Warning Box */}
        <div className="bg-[#FB7185]/10 border border-[#FB7185]/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FB7185]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>ADVERTENCIA IMPORTANTE SOBRE LA PERSISTENCIA DE DATOS</span>
          </div>
          <p className="text-xs text-[#F1F5F9] leading-relaxed">
            Todos los intentos, selecciones de indicios y matrices de confusión se guardan <strong className="text-[#35E0D0]">únicamente en el localStorage de tu navegador web actual</strong>.
          </p>
          <ul className="text-xs text-[#A7B5C7] list-disc list-inside space-y-1 leading-relaxed">
            <li>
              <strong className="text-[#F1F5F9]">Sin sincronización remota:</strong> No existe una base de datos central ni un servidor en la nube que sincronice tus respuestas.
            </li>
            <li>
              <strong className="text-[#FB7185]">Riesgo de pérdida de datos:</strong> Si limpias el historial de navegación, la memoria caché o las cookies del navegador, tus intentos se borrarán permanentemente.
            </li>
            <li>
              <strong className="text-[#4ADE80]">Recomendación para investigadores:</strong> Descarga los 3 archivos CSV de resultados desde la sección de historial antes de cerrar la sesión de investigación.
            </li>
          </ul>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<FileDown className="w-4 h-4" />}
              onClick={onGoToHistory}
            >
              Ir a exportar archivos CSV
            </Button>
          </div>
        </div>

        {/* Reset Progress Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#263A50]/60">
          <div className="text-xs text-[#A7B5C7]">
            ¿Deseas reiniciar tu entrenamiento y limpiar los registros locales de este dispositivo?
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setShowConfirmReset(true)}
          >
            Borrar progreso local
          </Button>
        </div>
      </Card>

      {/* Scope Limitations Overview */}
      <Card padding="md" className="space-y-3 bg-[#0D1B2A]/60">
        <div className="flex items-center gap-2 text-[#35E0D0]">
          <Layers className="w-4 h-4" />
          <h3 className="text-sm font-bold text-[#F1F5F9]">
            Delimitaciones Metodológicas del Estudio
          </h3>
        </div>
        <p className="text-xs text-[#A7B5C7] leading-relaxed">
          Para garantizar la validez científica del experimento, PhishLab opera bajo una estricta delimitación de alcance:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {PROTOTYPE_SCOPE_LIMITATIONS.map((lim, idx) => (
            <div key={idx} className="bg-[#122438] p-3 rounded-lg border border-[#263A50] text-xs space-y-0.5">
              <span className="font-semibold text-[#F1F5F9] block">{lim.title}</span>
              <span className="text-[11px] text-[#A7B5C7] block">{lim.description}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="¿Restablecer todo el progreso?"
        maxWidth="md"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 bg-[#FB7185]/10 border border-[#FB7185]/30 p-3.5 rounded-xl text-xs text-[#F1F5F9]">
            <AlertTriangle className="w-5 h-5 text-[#FB7185] shrink-0 mt-0.5" />
            <span>
              Esta acción borrará permanentemente todos tus intentos registrados en este dispositivo.
              Las métricas y el historial volverán a su estado inicial.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowConfirmReset(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReset}
            >
              Sí, borrar datos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
