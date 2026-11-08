import React from 'react';
import { ShieldAlert, ShieldCheck, HelpCircle, Send } from 'lucide-react';
import { MessageClassification } from '../../domain/types/exercise.ts';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';

export interface ClassificationBarProps {
  selectedClassification: MessageClassification | null;
  onSelectClassification: (cls: MessageClassification) => void;
  onSubmit: () => void;
  isSubmitted?: boolean;
  disabled?: boolean;
  selectedCluesCount?: number;
}

export const ClassificationBar: React.FC<ClassificationBarProps> = ({
  selectedClassification,
  onSelectClassification,
  onSubmit,
  isSubmitted = false,
  disabled = false,
  selectedCluesCount,
}) => {
  if (isSubmitted) return null;

  return (
    <Card padding="lg" className="bg-[#0D1B2A] border-[#263A50] space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#263A50] pb-3">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F9] tracking-tight">
            Clasificación del mensaje
          </h3>
          <p className="text-xs text-[#A7B5C7]">
            Selecciona una de las tres opciones y confirma tu decisión tras marcar los indicios en el correo.
          </p>
        </div>
        {selectedCluesCount !== undefined && (
          <span className="text-xs font-mono text-[#35E0D0]">
            {selectedCluesCount} indicios seleccionados
          </span>
        )}
      </div>

      {/* Three Mutually Exclusive Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Legitimate */}
        <button
          type="button"
          onClick={() => !disabled && onSelectClassification('legitimate')}
          disabled={disabled}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer touch-manipulation active:scale-[0.99] flex flex-col justify-between gap-3 min-h-[96px] ${
            selectedClassification === 'legitimate'
              ? 'border-[#4ADE80] bg-[#4ADE80]/15 ring-2 ring-[#4ADE80]'
              : 'border-[#263A50] bg-[#122438] hover:border-[#4ADE80]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <ShieldCheck
              className={`w-5 h-5 ${
                selectedClassification === 'legitimate' ? 'text-[#4ADE80]' : 'text-[#A7B5C7]'
              }`}
            />
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedClassification === 'legitimate'
                  ? 'border-[#4ADE80] bg-[#4ADE80]'
                  : 'border-[#263A50]'
              }`}
            >
              {selectedClassification === 'legitimate' && (
                <div className="w-1.5 h-1.5 bg-[#08111F] rounded-full" />
              )}
            </div>
          </div>
          <div>
            <span className="font-bold text-sm text-[#F1F5F9] block">Es legítimo</span>
            <span className="text-[11px] text-[#A7B5C7] block mt-0.5 leading-snug">
              La comunicación y los canales son auténticos y coherentes.
            </span>
          </div>
        </button>

        {/* Phishing */}
        <button
          type="button"
          onClick={() => !disabled && onSelectClassification('phishing')}
          disabled={disabled}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer touch-manipulation active:scale-[0.99] flex flex-col justify-between gap-3 min-h-[96px] ${
            selectedClassification === 'phishing'
              ? 'border-[#FB7185] bg-[#FB7185]/15 ring-2 ring-[#FB7185]'
              : 'border-[#263A50] bg-[#122438] hover:border-[#FB7185]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <ShieldAlert
              className={`w-5 h-5 ${
                selectedClassification === 'phishing' ? 'text-[#FB7185]' : 'text-[#A7B5C7]'
              }`}
            />
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedClassification === 'phishing'
                  ? 'border-[#FB7185] bg-[#FB7185]'
                  : 'border-[#263A50]'
              }`}
            >
              {selectedClassification === 'phishing' && (
                <div className="w-1.5 h-1.5 bg-[#08111F] rounded-full" />
              )}
            </div>
          </div>
          <div>
            <span className="font-bold text-sm text-[#F1F5F9] block">
              Es sospechoso o probablemente phishing
            </span>
            <span className="text-[11px] text-[#A7B5C7] block mt-0.5 leading-snug">
              Presenta señales de manipulación, dominios anómalos o fraude.
            </span>
          </div>
        </button>

        {/* Insufficient Information */}
        <button
          type="button"
          onClick={() => !disabled && onSelectClassification('insufficient_information')}
          disabled={disabled}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer touch-manipulation active:scale-[0.99] flex flex-col justify-between gap-3 min-h-[96px] ${
            selectedClassification === 'insufficient_information'
              ? 'border-[#FBBF24] bg-[#FBBF24]/15 ring-2 ring-[#FBBF24]'
              : 'border-[#263A50] bg-[#122438] hover:border-[#FBBF24]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <HelpCircle
              className={`w-5 h-5 ${
                selectedClassification === 'insufficient_information'
                  ? 'text-[#FBBF24]'
                  : 'text-[#A7B5C7]'
              }`}
            />
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedClassification === 'insufficient_information'
                  ? 'border-[#FBBF24] bg-[#FBBF24]'
                  : 'border-[#263A50]'
              }`}
            >
              {selectedClassification === 'insufficient_information' && (
                <div className="w-1.5 h-1.5 bg-[#08111F] rounded-full" />
              )}
            </div>
          </div>
          <div>
            <span className="font-bold text-sm text-[#F1F5F9] block">
              No tengo suficiente información
            </span>
            <span className="text-[11px] text-[#A7B5C7] block mt-0.5 leading-snug">
              Falta contexto y se debe verificar por un canal alternativo.
            </span>
          </div>
        </button>
      </div>

      {/* Submit CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#263A50]">
        <span className="text-xs text-[#A7B5C7]">
          {selectedClassification
            ? '¿Listo para evaluar? Tu respuesta será contrastada con el modelo pedagógico.'
            : 'Debes seleccionar una clasificación para habilitar el envío.'}
        </span>

        <Button
          variant="primary"
          size="md"
          icon={<Send className="w-4 h-4" />}
          onClick={onSubmit}
          disabled={!selectedClassification || disabled}
        >
          Confirmar respuesta y evaluar
        </Button>
      </div>
    </Card>
  );
};
