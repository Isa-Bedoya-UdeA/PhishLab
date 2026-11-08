/**
 * Single source of truth for PhishLab experimental prototype versioning,
 * institutional attribution, and research scope metadata.
 */

export const APP_VERSION = '2.1.0-exp';
export const APP_RELEASE_DATE = 'Noviembre 2026';
export const RESEARCH_PROJECT_NAME = 'PhishLab — Prototipo Experimental de Investigación';
export const INSTITUTIONAL_ATTRIBUTION =
  'Universidad de Antioquia — Proyecto de Investigación en Ingeniería de Sistemas';

export const RESEARCH_QUESTION =
  '¿Qué características de los mensajes de phishing dificultan su identificación por parte de estudiantes universitarios sin formación en ciberseguridad?';

export interface PrototypeScopeLimitation {
  title: string;
  description: string;
  rationale: string;
}

export const PROTOTYPE_SCOPE_LIMITATIONS: PrototypeScopeLimitation[] = [
  {
    title: 'Interacción estrictamente individual',
    description:
      'No incluye salas de chat, reportes colaborativos, alertas entre pares ni reputación comunitaria.',
    rationale:
      'Garantiza la validez interna del estudio psicométrico evitando sesgos de conformidad social, contagio de opiniones y varianza extrínseca entre participantes.',
  },
  {
    title: 'Focalización exclusiva en correo electrónico',
    description:
      'No incorpora ataques de quishing (códigos QR), suplantación biométrica, deepfakes multimedia ni mensajería instantánea.',
    rationale:
      'Delimita el constructo experimental a las señales lingüísticas, visuales y contextuales en el canal de comunicación formal universitario más atacado.',
  },
  {
    title: 'Entorno de simulación pedagógico determinista',
    description:
      'No es un antivirus, filtro antispam, cliente de correo real ni analizador automático de amenazas.',
    rationale:
      'La evaluación se realiza comparando las decisiones del participante contra un ground truth anotado por expertos, midiendo el juicio humano y no el rendimiento de algoritmos de detección.',
  },
  {
    title: 'Almacenamiento local soberano (Client-Side)',
    description:
      'Todos los datos se guardan exclusivamente en el navegador local (localStorage). No existen servidores centrales de sincronización.',
    rationale:
      'Protege la privacidad de los participantes y asegura que la investigación pueda ser auditada mediante la exportación manual de archivos CSV.',
  },
];
