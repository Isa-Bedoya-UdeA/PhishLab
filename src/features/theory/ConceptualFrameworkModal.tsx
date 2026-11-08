import React from 'react';
import {
  BookOpen,
  X,
  ShieldCheck,
  Binary,
  Layers,
  Sparkles,
  Code2,
} from 'lucide-react';
import {
  APP_VERSION,
  APP_RELEASE_DATE,
  RESEARCH_PROJECT_NAME,
  INSTITUTIONAL_ATTRIBUTION,
  RESEARCH_QUESTION,
  PROTOTYPE_SCOPE_LIMITATIONS,
} from '../../shared/constants/version.ts';
import { Button } from '../../components/ui/Button.tsx';

export interface ConceptualFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptualFrameworkModal: React.FC<ConceptualFrameworkModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const academicReferences = [
    {
      authors: 'Vishwanath, A., Herath, T., Chen, R., Wang, J., & Rao, H. R.',
      year: '2011',
      title: 'Why do people get phished? Testing the heuristic-systematic model of information processing',
      journal: 'Decision Support Systems, 51(3), 576–586',
      doi: '10.1016/j.dss.2011.03.002',
      contribution:
        'Fundamenta el procesamiento heurístico rápido de señales superficiales (marcas, logotipos, urgencia) frente al análisis sistemático minucioso del contexto.',
    },
    {
      authors: 'Jakobsson, M., & Myers, S.',
      year: '2006',
      title: 'Phishing and Countermeasures: Understanding the Increasing Problem of Electronic Identity Theft',
      journal: 'Wiley-Interscience, Hoboken, NJ',
      doi: 'ISBN: 978-0-471-78245-2',
      contribution:
        'Define el constructo técnico del phishing contextual y la necesidad de diferenciar la clasificación global de la detección de evidencias específicas.',
    },
    {
      authors: 'Ferreira, A., & Teles, S.',
      year: '2019',
      title: 'Persuasion: How phishing emails deceive users',
      journal: 'International Conference on Human Aspects of Information Security, Privacy and Trust (HCII), Springer, Cham, 439–453',
      doi: '10.1007/978-3-030-22312-0_31',
      contribution:
        'Sustenta la categorización de tácticas de influencia social: autoridad, escasez temporal, reciprocidad y coherencia situacional.',
    },
    {
      authors: 'Alsharnouby, M., Alaca, F., & Chiasson, S.',
      year: '2015',
      title: 'Why phishing still works: User strategies for detecting phishing flags',
      journal: 'Computers & Security, 52, 191–204',
      doi: '10.1016/j.cose.2015.04.004',
      contribution:
        'Demuestra empíricamente que los usuarios suelen fijarse en el contenido del cuerpo antes que en las cabeceras técnicas y dominios.',
    },
    {
      authors: 'Workman, M.',
      year: '2008',
      title: 'Wisecrackers: A theory-grounded investigation of phishing and pretext social engineering threats',
      journal: 'Information & Management, 45(6), 362–373',
      doi: '10.1016/j.im.2008.04.003',
      contribution:
        'Aporta el modelo de pretexting en ingeniería social y la manipulación del rol contextual universitario.',
    },
    {
      authors: 'ENISA — Agencia de la Unión Europea para la Ciberseguridad',
      year: '2023',
      title: 'ENISA Threat Landscape: Social Engineering & Phishing Attack Vectors',
      journal: 'European Union Agency for Cybersecurity Publications Office',
      doi: 'Cat. Number: TP-09-23-264-EN-N',
      contribution:
        'Respalda la relevancia de entrenar la discriminación entre falsos positivos y falsos negativos en comunidades académicas.',
    },
  ];

  const softwareStack = [
    { name: 'React 19', role: 'Renderizado de interfaz declarativa, componentes y ganchos de estado' },
    { name: 'TypeScript', role: 'Tipado estricto, entidades de dominio y validación de contratos' },
    { name: 'Tailwind CSS v4', role: 'Sistema de diseño y estilos responsive optimizados' },
    { name: 'Lucide React', role: 'Iconografía visual de accesibilidad y estados de evaluación' },
    { name: 'Vitest', role: 'Suite de pruebas unitarias automatizadas para evaluador y exportación CSV' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theory-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6"
    >
      <div className="w-full max-w-4xl bg-[#08111F] border border-[#263A50] rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col">
        {/* Header */}
        <div className="bg-[#0D1B2A] border-b border-[#263A50] px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#35E0D0]/15 border border-[#35E0D0]/40 flex items-center justify-center text-[#35E0D0]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="theory-modal-title" className="text-lg font-bold text-[#F1F5F9] leading-tight">
                  Marco Teórico y Fundamentación Conceptual
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#35E0D0]/10 text-[#35E0D0] border border-[#35E0D0]/30">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-[#A7B5C7]">
                {RESEARCH_PROJECT_NAME} · {INSTITUTIONAL_ATTRIBUTION}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A7B5C7] hover:text-[#F1F5F9] hover:bg-[#122438] transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-[#F1F5F9]">
          {/* Research Core Question */}
          <div className="p-4 bg-[#122438] border-l-4 border-[#35E0D0] rounded-r-xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#35E0D0] block">
              Pregunta Central de Investigación
            </span>
            <p className="text-base font-medium italic text-[#F1F5F9] leading-relaxed">
              «{RESEARCH_QUESTION}»
            </p>
            <p className="text-xs text-[#A7B5C7] leading-relaxed">
              El prototipo evalúa la interacción cognitiva directa entre el estudiante y los elementos del correo.
              Se distingue rigurosamente la clasificación global (juicio superficial) de la detección de evidencias (análisis sistemático).
            </p>
          </div>

          {/* Operational Definitions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#35E0D0]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#F1F5F9]">
                1. Definición Operativa de Phishing y Señales
              </h3>
            </div>
            <p className="text-xs text-[#A7B5C7] leading-relaxed">
              Se define el <strong className="text-[#F1F5F9]">phishing</strong> como un ataque de ingeniería social en el cual un atacante suplanta una entidad creíble mediante mensajes electrónicos simulados para inducir a la víctima a realizar acciones perjudiciales (como revelar credenciales o acceder a enlaces no autorizados).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#263A50] space-y-1.5">
                <span className="text-xs font-bold text-[#35E0D0] block">Señales Lingüísticas</span>
                <p className="text-xs text-[#A7B5C7] leading-relaxed">
                  Urgencia temporal artificial, amenazas de suspensión, lenguaje imperativo o solicitudes inusuales que buscan provocar reacciones impulsivas.
                </p>
              </div>

              <div className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#263A50] space-y-1.5">
                <span className="text-xs font-bold text-[#48C8F5] block">Señales Visuales</span>
                <p className="text-xs text-[#A7B5C7] leading-relaxed">
                  Formatos institucionales, firmas corporativas y sellos de seguridad simulados que buscan generar una falsa sensación de autenticidad formal.
                </p>
              </div>

              <div className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#263A50] space-y-1.5">
                <span className="text-xs font-bold text-[#C4B5FD] block">Señales Contextuales</span>
                <p className="text-xs text-[#A7B5C7] leading-relaxed">
                  Discrepancias técnicas entre el nombre mostrado y la dirección real (<code className="text-[#35E0D0] text-[11px]">&lt;correo@dominio&gt;</code>), dominios externos (.com en lugar de .edu) y URLs no autorizadas.
                </p>
              </div>
            </div>
          </div>

          {/* Psychometric Metrics & Formula */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#35E0D0]">
              <Binary className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#F1F5F9]">
                2. Modelo de Evaluación y Métricas de Rendimiento
              </h3>
            </div>

            <div className="bg-[#0D1B2A] p-4 rounded-xl border border-[#263A50] space-y-3 text-xs leading-relaxed">
              <p className="text-[#A7B5C7]">
                Para evitar que el participante obtenga una puntuación alta marcando palabras al azar o seleccionando indiscriminadamente todo el texto, se emplea la métrica balanceada <strong className="text-[#F1F5F9]">F1-Score</strong> sobre los elementos seleccionados:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] py-1">
                <div className="bg-[#122438] p-2.5 rounded-lg border border-[#4ADE80]/30 text-center">
                  <span className="text-[#4ADE80] font-bold block">TP</span>
                  <span className="text-[10px] text-[#A7B5C7]">Indicios detectados</span>
                </div>
                <div className="bg-[#122438] p-2.5 rounded-lg border border-[#FB7185]/30 text-center">
                  <span className="text-[#FB7185] font-bold block">FP</span>
                  <span className="text-[10px] text-[#A7B5C7]">Selecciones erróneas</span>
                </div>
                <div className="bg-[#122438] p-2.5 rounded-lg border border-[#FBBF24]/30 text-center">
                  <span className="text-[#FBBF24] font-bold block">FN</span>
                  <span className="text-[10px] text-[#A7B5C7]">Indicios omitidos</span>
                </div>
                <div className="bg-[#122438] p-2.5 rounded-lg border border-[#263A50] text-center">
                  <span className="text-[#A7B5C7] font-bold block">TN</span>
                  <span className="text-[10px] text-[#A7B5C7]">Elementos neutros</span>
                </div>
              </div>

              <div className="bg-[#08111F] p-3 rounded-lg border border-[#263A50] font-mono text-xs text-[#35E0D0] space-y-1">
                <div>Precisión = TP / (TP + FP)</div>
                <div>Recall = TP / (TP + FN)</div>
                <div>F1 = 2 × (Precisión × Recall) / (Precisión + Recall)</div>
                <div className="pt-1 text-[#F1F5F9] font-bold">
                  Puntaje Final = 0.70 × (100 × F1) + 0.30 × P_clasificación
                </div>
              </div>

              <p className="text-[11px] text-[#A7B5C7] italic">
                * Nota metodológica: Este puntaje ponderado es un índice formativo y psicométrico para la investigación empírica. No constituye una certificación profesional de seguridad informática.
              </p>
            </div>
          </div>

          {/* Deliberate Scope Limitations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#35E0D0]">
              <Layers className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#F1F5F9]">
                3. Delimitación Metodológica y Alcance del Prototipo
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROTOTYPE_SCOPE_LIMITATIONS.map((lim, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#263A50] space-y-1"
                >
                  <span className="text-xs font-bold text-[#F1F5F9] block">{lim.title}</span>
                  <p className="text-[11px] text-[#A7B5C7]">{lim.description}</p>
                  <p className="text-[10px] text-[#35E0D0] pt-1">
                    <strong>Justificación:</strong> {lim.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Academic Citations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#35E0D0]">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#F1F5F9]">
                4. Referencias Académicas de Investigación
              </h3>
            </div>
            <div className="space-y-3">
              {academicReferences.map((ref, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#263A50] text-xs space-y-1 leading-relaxed"
                >
                  <div className="text-[#F1F5F9]">
                    <span className="font-semibold">{ref.authors}</span> ({ref.year}).{' '}
                    <span className="italic">{ref.title}</span>. {ref.journal}.
                  </div>
                  <div className="text-[11px] font-mono text-[#35E0D0]">{ref.doi}</div>
                  <div className="text-[11px] text-[#A7B5C7] bg-[#122438] p-2 rounded-lg mt-1 border border-[#263A50]/60">
                    <strong className="text-[#F1F5F9]">Aporte metodológico:</strong> {ref.contribution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Software Stack Distinction */}
          <div className="space-y-3 pt-2 border-t border-[#263A50]">
            <div className="flex items-center gap-2 text-[#C4B5FD]">
              <Code2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#F1F5F9]">
                5. Arquitectura de Software y Librerías Tecnológicas
              </h3>
            </div>
            <p className="text-xs text-[#A7B5C7] leading-relaxed">
              Las siguientes librerías de código abierto corresponden a la implementación técnica del software web y se diferencian conceptualmente de las fuentes bibliográficas de ciberseguridad:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {softwareStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D1B2A] p-2.5 rounded-lg border border-[#263A50] space-y-0.5"
                >
                  <span className="font-bold text-[#C4B5FD] block">{tech.name}</span>
                  <span className="text-[11px] text-[#A7B5C7] block">{tech.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0D1B2A] border-t border-[#263A50] px-5 py-3.5 flex items-center justify-between">
          <div className="text-[11px] text-[#A7B5C7]">
            Versión: <span className="font-mono text-[#35E0D0]">{APP_VERSION}</span> ({APP_RELEASE_DATE})
          </div>
          <Button variant="primary" size="sm" onClick={onClose}>
            Entendido, cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
