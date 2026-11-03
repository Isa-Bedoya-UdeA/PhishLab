import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';

export interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onAccept }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onAccept}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#263A50]">
          <div className="w-10 h-10 rounded-xl bg-[#35E0D0]/10 border border-[#35E0D0]/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-[#35E0D0]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F1F5F9] tracking-tight">
              Entorno de simulación educativa
            </h2>
            <p className="text-xs text-[#A7B5C7]">Aviso general de seguridad y metodología</p>
          </div>
        </div>

        <div className="bg-[#122438] p-4 rounded-xl border border-[#263A50] text-[#F1F5F9] text-sm leading-relaxed space-y-3">
          <p>
            Todos los correos, remitentes, instituciones, empresas, direcciones, enlaces, archivos
            y situaciones que aparecen en <strong className="text-[#35E0D0]">PhishLab</strong> han
            sido creados o adaptados con fines educativos.
          </p>
          <p className="text-[#A7B5C7]">
            No representan comunicaciones reales ni deben interpretarse como evidencia sobre una
            organización existente. Los mensajes se presentan en un entorno simulado y no se envían
            ni se reciben correos reales.
          </p>
          <p className="text-xs text-[#C4B5FD] font-mono bg-[#0D1B2A] p-2.5 rounded-lg border border-[#263A50]">
            ⚡ Ningún enlace es navegable hacia el exterior. Todas las acciones se ejecutan localmente
            en este laboratorio.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="md"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={onAccept}
          >
            Entendido, comenzar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
