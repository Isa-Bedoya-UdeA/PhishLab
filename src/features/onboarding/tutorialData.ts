import { Exercise } from '../../domain/types/exercise.ts';
import { buildExercise } from '../../infrastructure/seed/exerciseBuilder.ts';

/**
 * Fictional guided tutorial exercise.
 * IMPORTANT: This exercise is strictly for onboarding and guided practice.
 * It MUST NEVER be saved to AttemptRepository, localStorage attempts, or CSV exports.
 */
export const TUTORIAL_EXERCISE: Exercise = buildExercise({
  id: 'ex-tutorial',
  title: 'Tutorial Práctico: Aviso de préstamo bibliotecario',
  difficulty: 'beginner',
  scenario:
    'Un estudiante recibe un correo avisando que un libro prestado en la biblioteca central vencerá hoy y solicitando confirmar su cuenta en un enlace externo para evitar multas académicas.',
  senderName: 'Sistema de Bibliotecas Universitarias',
  senderNameClue: {
    isClue: false,
    category: 'linguistic',
    subcategory: 'autoridad_institucional',
    explanation: 'El nombre visible parece institucional y formal, lo cual suele inducir confianza rápida.',
  },
  senderAddress: 'alertas-biblioteca@universidad-servicios-seguros.com',
  senderAddressClue: {
    isClue: true,
    category: 'contextual',
    subcategory: 'direccion_anomala',
    explanation:
      'Indicio contextual clave: El dominio "universidad-servicios-seguros.com" no corresponde al dominio institucional oficial de la universidad (.edu).',
  },
  domain: 'universidad-servicios-seguros.com',
  domainClue: {
    isClue: true,
    category: 'contextual',
    subcategory: 'dominio_externo',
    explanation:
      'Dominio comercial (.com) que emula el nombre institucional para confundir al lector.',
  },
  subject: 'URGENTE: Préstamo bibliotecario por vencer hoy y validación de usuario',
  subjectClue: {
    isClue: true,
    category: 'linguistic',
    subcategory: 'urgencia',
    explanation:
      'El uso de "URGENTE" en mayúsculas en el asunto busca forzar una respuesta apresurada antes de reflexionar.',
  },
  dateLabel: 'Hoy, 09:15 AM',
  preview: 'Estimado estudiante: Su préstamo bibliotecario vence el día de hoy. Ingrese para renovar...',
  paragraphs: [
    [
      'Estimado',
      'estudiante,',
    ],
    [
      'Le',
      'recordamos',
      'que',
      'el',
      'libro',
      '"Fundamentos',
      'de',
      'Algoritmos"',
      'vence',
      'el',
      'día',
      'de',
      'hoy',
      'a',
      'las',
      '18:00',
      'horas.',
      'Para',
      'evitar',
      'una',
      {
        word: 'suspensión',
        isClue: true,
        category: 'linguistic',
        subcategory: 'amenaza',
        explanation: 'Amenaza desproporcionada: una biblioteca no suspende académicamente por un atraso de préstamo.',
      },
      {
        word: 'académica',
        isClue: true,
        category: 'linguistic',
        subcategory: 'amenaza',
        explanation: 'Táctica coercitiva de intimidación.',
      },
      {
        word: 'inmediata,',
        isClue: true,
        category: 'linguistic',
        subcategory: 'urgencia',
        explanation: 'Presión temporal urgente.',
      },
      'debe',
      'confirmar',
      'sus',
      {
        word: 'credenciales',
        isClue: true,
        category: 'contextual',
        subcategory: 'solicitud_credenciales',
        explanation: 'Petición inusual de credenciales para una simple renovación de biblioteca.',
      },
      'universitarias',
      'y',
      'renovar',
      'el',
      'préstamo',
      'a',
      'través',
      'de',
      'nuestro',
      'portal',
      {
        word: 'antes',
        isClue: true,
        category: 'linguistic',
        subcategory: 'urgencia',
        explanation: 'Plazo límite artificial.',
      },
      {
        word: 'del',
        isClue: false,
      },
      {
        word: 'mediodía.',
        isClue: true,
        category: 'linguistic',
        subcategory: 'urgencia',
        explanation: 'Límite de tiempo estricto para evitar verificación.',
      },
    ],
    [
      'Por',
      'favor',
      'valide',
      'su',
      'cuenta',
      'en',
      'el',
      'enlace',
      'inferior',
      'ingresando',
      'su',
      {
        word: 'usuario',
        isClue: true,
        category: 'contextual',
        subcategory: 'solicitud_credenciales',
        explanation: 'Captura de credenciales.',
      },
      'y',
      {
        word: 'clave',
        isClue: true,
        category: 'contextual',
        subcategory: 'solicitud_credenciales',
        explanation: 'Solicitud directa de clave institucional por enlace de correo.',
      },
      'institucional.',
    ],
    [
      'Atentamente,',
    ],
    [
      'Dirección',
      'del',
      'Sistema',
      'de',
      'Bibliotecas',
    ],
  ],
  apparentLinks: [
    {
      id: '1',
      label: 'Renovar Préstamo y Validar Credenciales',
      displayedUrl: 'https://biblioteca.universidad-servicios-seguros.com/renovacion-express',
      isClue: true,
      category: 'contextual',
      subcategory: 'enlace_credenciales',
      explanation:
        'El enlace conduce a un dominio no institucional (.com en lugar de .edu). Inspeccionar la URL revela el intento de captura de credenciales.',
    },
  ],
  attachments: [],
  referenceClassification: 'phishing',
  referenceExplanation:
    'El mensaje es un ataque de phishing (suplantación de identidad). Utiliza una situación universitaria cotidiana (un libro por devolver) combinada con una amenaza coercitiva exagerada (suspensión académica), un plazo de tiempo artificial urgente ("antes del mediodía"), un remitente con dominio falso (universidad-servicios-seguros.com) y un enlace que solicita credenciales institucionales.',
  signals: [
    {
      title: 'Dominio y remitente discrepantes',
      category: 'contextual',
      elementIds: ['ex-tutorial-meta-sender-address', 'ex-tutorial-meta-domain', 'ex-tutorial-link-1'],
      explanation:
        'El correo proviene de un dominio comercial (.com) que emula el nombre institucional, y el enlace de renovación apunta al mismo servidor no autorizado.',
    },
    {
      title: 'Urgencia artificial y amenaza coercitiva',
      category: 'linguistic',
      elementIds: ['ex-tutorial-meta-subject'],
      explanation:
        'Apela al miedo con amenazas extremas ("suspensión académica inmediata") y un límite de tiempo arbitrario para reducir el análisis reflexivo.',
    },
    {
      title: 'Petición injustificada de credenciales',
      category: 'contextual',
      elementIds: [],
      explanation:
        'Ningún servicio de biblioteca requiere reenviar o revalidar contraseñas institucionales a través de enlaces directos para extender un préstamo.',
    },
  ],
  learningObjective:
    'Reconocer cómo los atacantes usan pretextos cotidianos universitarios y amenazas desmedidas para apresurar la entrega de credenciales en dominios externos.',
  practicalRecommendation:
    'Ante cualquier aviso sobre préstamos o multas de biblioteca, ingresa directamente desde tu navegador al catálogo oficial de la universidad sin utilizar los enlaces del correo.',
  institutionalVisuals: {
    organizationName: 'Universidad — Sistema de Bibliotecas',
    department: 'División de Servicios al Usuario y Préstamos',
    securityBanner: 'SIMULACIÓN DE PRÁCTICA GUIADA — NO GENERA DATOS EXPERIMENTALES',
    footerNotice:
      'Aviso de práctica pedagógica: Este mensaje forma parte del tutorial de inducción de PhishLab. Las acciones realizadas aquí son para aprendizaje y no se computan en el estudio experimental.',
  },
});

export interface TutorialStep {
  id: number;
  title: string;
  instruction: string;
  highlightTarget?: 'headers' | 'body' | 'links' | 'classification' | 'feedback';
  tip: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Bienvenido al Laboratorio PhishLab',
    instruction:
      'PhishLab investiga qué señales de los correos hacen dudar a los estudiantes. Aquí no evaluamos reflejos ni velocidad, sino tu capacidad de análisis crítico individual.',
    tip: 'En cada ejercicio verás un correo simulado realista. Tu tarea consta de dos partes: seleccionar los indicios y clasificar el mensaje.',
  },
  {
    id: 2,
    title: 'Paso 1: Inspecciona el remitente y las cabeceras',
    instruction:
      'Observa el nombre, la dirección completa del remitente (<...>) y el dominio. Haz clic sobre ellos si consideras que aportan evidencia a favor o en contra de la autenticidad.',
    highlightTarget: 'headers',
    tip: 'Los atacantes suelen usar nombres institucionales reales, pero direcciones con dominios externos o sutilmente alterados.',
  },
  {
    id: 3,
    title: 'Paso 2: Marca o desmarca palabras del cuerpo',
    instruction:
      'Cada palabra del correo es interactiva. Puedes hacer clic o tocar con tu dedo cualquier palabra para seleccionarla como indicio relevante. Haz clic de nuevo para desmarcarla.',
    highlightTarget: 'body',
    tip: 'No marques palabras al azar ni selecciones todo el párrafo. Marca solo los fragmentos clave (por ejemplo: amenazas, plazos urgentes, peticiones inusuales).',
  },
  {
    id: 4,
    title: 'Paso 3: Inspecciona los enlaces con seguridad',
    instruction:
      'Usa el botón "Inspeccionar URL" para ver a dónde conduce realmente un enlace en nuestro visor seguro. Ningún enlace de PhishLab te llevará a páginas externas ni descargará archivos.',
    highlightTarget: 'links',
    tip: 'Compara siempre el texto visible del enlace con su destino técnico real.',
  },
  {
    id: 5,
    title: 'Paso 4: Elige tu clasificación final',
    instruction:
      'Tienes 3 opciones posibles: «Es legítimo», «Es sospechoso o probablemente phishing», o «No tengo suficiente información para decidir». Elige la que mejor describa la situación y presiona Confirmar.',
    highlightTarget: 'classification',
    tip: 'Si un correo tiene apariencia normal pero no aporta datos suficientes para estar seguro, "Información insuficiente" es una respuesta completamente válida.',
  },
  {
    id: 6,
    title: 'Paso 5: Retroalimentación y matriz de confusión',
    instruction:
      'Tras confirmar tu respuesta, verás qué indicios acertaste (Verdaderos Positivos), cuáles omitiste (Falsos Negativos) y cuáles marcaste incorrectamente (Falsos Positivos).',
    highlightTarget: 'feedback',
    tip: 'El puntaje ponderado (70% indicios / 30% clasificación) es una métrica pedagógica del estudio, diseñada para valorar el análisis fundamentado.',
  },
];
