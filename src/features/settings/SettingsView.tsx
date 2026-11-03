import React, { useState } from 'react';
import {
  Settings,
  ShieldAlert,
  Trash2,
  BookOpen,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { safeStorage } from '../../infrastructure/storage/localStorage.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Modal } from '../../components/ui/Modal.tsx';

export interface SettingsViewProps {
  onOpenDisclaimer: () => void;
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenDisclaimer,
  onDataReset,
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
      <div className="border-b border-[#263A50] pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#35E0D0]" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9]">
            Configuración y Marco del Laboratorio
          </h1>
        </div>
        <p className="text-xs text-[#A7B5C7] mt-1">
          Avisos éticos, contexto de investigación y administración del almacenamiento local.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-[#4ADE80]/15 border border-[#4ADE80]/40 rounded-xl text-xs text-[#4ADE80] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>El progreso y los intentos guardados localmente han sido restablecidos con éxito.</span>
        </div>
      )}

      {/* Research Project Description */}
      <Card padding="lg" className="space-y-3">
        <div className="flex items-center gap-2 text-[#35E0D0]">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-base font-bold text-[#F1F5F9]">
            Pregunta de Investigación
          </h2>
        </div>
        <blockquote className="border-l-2 border-[#35E0D0] pl-3 py-1 text-sm font-medium text-[#F1F5F9] italic bg-[#08111F]/50 rounded-r-lg">
          «¿Qué características lingüísticas, visuales y contextuales de los mensajes de phishing
          dificultan su identificación por parte de estudiantes universitarios sin formación en
          ciberseguridad?»
        </blockquote>
        <p className="text-xs text-[#A7B5C7] leading-relaxed">
          PhishLab busca evaluar de forma empírica la diferencia entre clasificar un correo y detectar
          con precisión las evidencias subyacentes. El laboratorio promueve un análisis crítico de las
          situaciones cotidianas sin recurrir a pistas artificiales.
        </p>
      </Card>

      {/* Simulation Notice Section */}
      <Card padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#35E0D0]" />
            <h3 className="text-sm font-bold text-[#F1F5F9]">
              Aviso del entorno de simulación educativa
            </h3>
          </div>
          <p className="text-xs text-[#A7B5C7]">
            Revise la declaración ética sobre el carácter ficticio de los remitentes, dominios y situaciones.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={onOpenDisclaimer}>
          Consultar aviso
        </Button>
      </Card>

      {/* Local Storage Governance */}
      <Card padding="lg" className="space-y-4 border-[#263A50]">
        <div className="flex items-center gap-2 text-[#C4B5FD]">
          <Database className="w-5 h-5" />
          <h2 className="text-base font-bold text-[#F1F5F9]">
            Privacidad y persistencia en el dispositivo
          </h2>
        </div>

        <div className="bg-[#08111F] p-4 rounded-xl border border-[#263A50] text-xs text-[#A7B5C7] space-y-2 leading-relaxed">
          <p>
            • Todos los intentos, respuestas y métricas calculadas se guardan de forma exclusiva en el{' '}
            <strong className="text-[#F1F5F9]">localStorage</strong> de este navegador.
          </p>
          <p>
            • Ningún dato personal ni respuesta se transmite a servidores externos ni bases de datos remotas.
          </p>
          <p>
            • El almacenamiento pertenece al navegador y equipo actual, por lo que no se centraliza
            automáticamente entre diferentes dispositivos.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-[#A7B5C7]">
            ¿Deseas reiniciar tu entrenamiento desde cero?
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
