import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { ApparentLink } from '../../domain/types/exercise.ts';
import { Button } from '../ui/Button.tsx';

export interface UrlInspectionPanelProps {
  link: ApparentLink | null;
  onClose: () => void;
}

export const UrlInspectionPanel: React.FC<UrlInspectionPanelProps> = ({ link, onClose }) => {
  if (!link) return null;

  let urlObject: URL | null = null;
  try {
    urlObject = new URL(link.displayedUrl);
  } catch {
    // fallback if malformed
  }

  return (
    <Modal
      isOpen={Boolean(link)}
      onClose={onClose}
      title="Inspección segura de enlace"
      description="Visualización estática de la dirección URL sin navegación externa."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Safety notification */}
        <div className="flex items-start gap-2.5 bg-[#122438] p-3 rounded-xl border border-[#263A50] text-xs text-[#A7B5C7]">
          <ShieldCheck className="w-4 h-4 text-[#35E0D0] shrink-0 mt-0.5" />
          <span>
            Los enlaces en PhishLab son datos estáticos de simulación. Por seguridad, nunca realizan
            peticiones de red ni abren sitios en el navegador.
          </span>
        </div>

        {/* URL Breakdown */}
        <div className="space-y-3 bg-[#08111F] p-4 rounded-xl border border-[#263A50] font-mono text-xs">
          <div>
            <div className="text-[11px] text-[#A7B5C7] uppercase font-sans tracking-wider mb-1">
              Texto visible en el correo
            </div>
            <div className="text-[#F1F5F9] font-sans font-medium text-sm bg-[#122438] p-2.5 rounded-lg border border-[#263A50]">
              {link.label}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-[#A7B5C7] uppercase font-sans tracking-wider mb-1">
              Dirección de destino aparente
            </div>
            <div className="text-[#35E0D0] break-all bg-[#122438] p-2.5 rounded-lg border border-[#35E0D0]/30 select-all">
              {link.displayedUrl}
            </div>
          </div>

          {urlObject && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#263A50]">
              <div>
                <span className="text-[#A7B5C7] block text-[10px] uppercase font-sans">Protocolo</span>
                <span className="text-[#48C8F5] font-semibold">{urlObject.protocol}</span>
              </div>
              <div>
                <span className="text-[#A7B5C7] block text-[10px] uppercase font-sans">Dominio / Host</span>
                <span className="text-[#C4B5FD] font-semibold">{urlObject.hostname}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#A7B5C7] block text-[10px] uppercase font-sans">Ruta</span>
                <span className="text-[#F1F5F9] break-all">{urlObject.pathname || '/'}</span>
              </div>
              {urlObject.search && (
                <div className="col-span-2">
                  <span className="text-[#A7B5C7] block text-[10px] uppercase font-sans">Parámetros</span>
                  <span className="text-[#A7B5C7] break-all">{urlObject.search}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cerrar inspector
          </Button>
        </div>
      </div>
    </Modal>
  );
};
