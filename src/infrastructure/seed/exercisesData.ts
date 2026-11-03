import { Exercise } from '../../domain/types/exercise.ts';
import { buildExercise, RawExerciseDefinition } from './exerciseBuilder.ts';

const rawExercises: RawExerciseDefinition[] = [
  // =========================================================================
  // EJERCICIO 1 — Notificación de seguridad de una cuenta (PHISHING)
  // =========================================================================
  {
    id: 'ex-01',
    title: 'Notificación de seguridad de cuenta institucional',
    difficulty: 'beginner',
    scenario: 'Recibes un correo en tu bandeja que alerta sobre un inicio de sesión no reconocido en tu cuenta institucional, exigiendo verificar tu identidad en menos de 24 horas.',
    senderName: 'Centro de Servicios Digitales y Seguridad',
    senderNameClue: {
      isClue: false,
      explanation: 'El nombre visible parece formal y creíble, pero los nombres pueden ser configurados libremente por quien envía el mensaje.',
    },
    senderAddress: 'seguridad-cuentas@servicios-portal-auth.net',
    senderAddressClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'La dirección utiliza un dominio externo (servicios-portal-auth.net) no perteneciente a la universidad o entidad oficial correspondiente.',
    },
    domain: 'servicios-portal-auth.net',
    domainClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'El dominio servicios-portal-auth.net no coincide con la infraestructura legítima de la institución.',
    },
    subject: 'URGENTE: Actividad inusual detectada en su cuenta institucional',
    subjectClue: {
      isClue: true,
      category: 'linguistic',
      explanation: 'El uso de términos como «URGENTE» en mayúsculas en el asunto busca inducir un estado de alarma inmediata para reducir el análisis crítico.',
    },
    dateLabel: '25 de octubre, 08:32',
    preview: 'Hemos detectado un intento de acceso no reconocido desde un dispositivo desconocido. Para evitar la suspensión...',
    paragraphs: [
      [
        'Estimado', 'usuario', 'de', 'la', 'comunidad', 'universitaria,',
      ],
      [
        'Le', 'informamos', 'que', 'nuestro', 'sistema', 'de', 'monitoreo', 'automatizado',
        'ha', 'detectado', 'un', 'intento', 'de', 'inicio', 'de', 'sesión', 'no', 'reconocido',
        'en', 'su', 'cuenta', 'institucional', 'desde', 'una', 'ubicación', 'geográfica',
        'no', 'habitual.',
      ],
      [
        'Por', 'protocolo', 'estricto', 'de', 'seguridad,', 'es',
        { word: 'obligatorio', isClue: true, category: 'linguistic', explanation: 'Uso de lenguaje imperativo y coercitivo para forzar la acción.' },
        'que', 'realice', 'la', 'verificación', 'de', 'sus', 'credenciales',
        { word: 'dentro', isClue: true, category: 'linguistic', explanation: 'Presión temporal artificial para forzar una respuesta precipitada.' },
        { word: 'de', isClue: true, category: 'linguistic', explanation: 'Presión temporal artificial.' },
        { word: 'las', isClue: true, category: 'linguistic', explanation: 'Presión temporal artificial.' },
        { word: 'próximas', isClue: true, category: 'linguistic', explanation: 'Presión temporal artificial.' },
        { word: '24', isClue: true, category: 'linguistic', explanation: 'Plazo estricto de 24 horas característico de técnicas de ingeniería social.' },
        { word: 'horas.', isClue: true, category: 'linguistic', explanation: 'Establecimiento de cuenta regresiva.' },
        'De', 'lo', 'contrario,', 'su', 'acceso', 'a', 'los', 'servicios', 'digitales', 'y', 'al', 'correo',
        { word: 'será', isClue: true, category: 'linguistic', explanation: 'Amenaza de consecuencias negativas directas.' },
        { word: 'suspendido', isClue: true, category: 'linguistic', explanation: 'Amenaza de suspensión de la cuenta.' },
        { word: 'de', isClue: true, category: 'linguistic', explanation: 'Amenaza.' },
        { word: 'manera', isClue: true, category: 'linguistic', explanation: 'Amenaza.' },
        { word: 'preventiva', isClue: true, category: 'linguistic', explanation: 'Amenaza de restricción.' },
        { word: 'e', isClue: true, category: 'linguistic', explanation: 'Amenaza.' },
        { word: 'irrevocable.', isClue: true, category: 'linguistic', explanation: 'Término intimidatorio para inducir temor.' },
      ],
      [
        'Por', 'favor,', 'acceda', 'al', 'siguiente', 'enlace', 'para', 'confirmar', 'su', 'identidad',
        'y', 'restablecer', 'sus', 'parámetros', 'de', 'autenticación:',
      ],
      [
        'Atentamente,',
      ],
      [
        'Dirección', 'de', 'Tecnología', 'y', 'Seguridad', 'de', 'la', 'Información.',
      ],
      [
        'Referencia', 'interna:', 'INC-SEC-88204-REV',
      ],
    ],
    apparentLinks: [
      {
        id: 'link-1',
        label: 'Verificar cuenta institucional ahora',
        displayedUrl: 'https://portal-validacion-seguridad.net/verificar-acceso?id=88204',
        isClue: true,
        category: 'contextual',
        explanation: 'La URL aparente redirige a un dominio ajeno (portal-validacion-seguridad.net) en lugar del portal oficial de la institución.',
      },
    ],
    visualNotice: {
      text: 'Aviso de seguridad: Este correo fue verificado por el filtro perimetral institucional.',
      isClue: true,
      category: 'visual',
      explanation: 'El mensaje simula una leyenda o sello visual de seguridad para crear una falsa sensación de confianza.',
    },
    referenceClassification: 'phishing',
    referenceExplanation: 'El mensaje presenta múltiples señales convergentes: discrepancia contextual del dominio del remitente y del enlace de verificación respecto a la institución, presión temporal estricta (24 horas) y amenaza de suspensión de cuenta para forzar la introducción de credenciales.',
    signals: [
      {
        elementIds: ['ex-01-meta-sender-address', 'ex-01-meta-domain', 'ex-01-link-link-1'],
        category: 'contextual',
        title: 'Discrepancia de dominios y enlaces no institucionales',
        explanation: 'Tanto la dirección del remitente como el enlace de validación apuntan a dominios externos no oficiales creados para capturar datos.',
      },
      {
        elementIds: ['ex-01-meta-subject', 'ex-01-w41', 'ex-01-w42', 'ex-01-w43', 'ex-01-w44', 'ex-01-w45', 'ex-01-w46', 'ex-01-w57', 'ex-01-w58', 'ex-01-w63'],
        category: 'linguistic',
        title: 'Presión temporal y amenazas de suspensión',
        explanation: 'El mensaje utiliza la urgencia en mayúsculas y la amenaza explícita de suspensión en 24 horas para provocar una reacción apresurada.',
      },
      {
        elementIds: ['ex-01-visual-notice'],
        category: 'visual',
        title: 'Falsa leyenda institucional de verificación',
        explanation: 'Se incluye un texto con apariencia de sello de seguridad institucional para generar una falsa percepción de legitimidad.',
      },
    ],
    learningObjective: 'Reconocer que las amenazas de bloqueo y los dominios externos en solicitudes de credenciales son indicios críticos de phishing.',
    practicalRecommendation: 'Nunca ingrese credenciales a través de un enlace recibido por correo. Si sospecha de un problema en su cuenta, ingrese directamente escribiendo la dirección oficial en su navegador o consulte con la mesa de ayuda institucional.',
    institutionalVisuals: {
      organizationName: 'Portal Universitario de Autenticación',
      department: 'División de Gestión y Soporte Tecnológico',
      securityBanner: 'ALERTA DE SEGURIDAD PERIMETRAL',
      footerNotice: 'Este mensaje contiene información confidencial dirigida exclusivamente al destinatario.',
    },
  },

  // =========================================================================
  // EJERCICIO 2 — Recordatorio académico legítimo (LEGÍTIMO)
  // =========================================================================
  {
    id: 'ex-02',
    title: 'Publicación del calendario de evaluaciones parciales',
    difficulty: 'beginner',
    scenario: 'La coordinación académica de tu facultad envía una circular formal con el calendario de exámenes parciales y el periodo habilitado para revisiones presenciales.',
    senderName: 'Coordinación Académica — Facultad de Ingeniería',
    senderNameClue: {
      isClue: false,
      explanation: 'El nombre corresponde con un área académica habitual de la universidad.',
    },
    senderAddress: 'coordinacion.academica@universidad-norte.edu',
    senderAddressClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'La dirección de correo utiliza el dominio oficial institucional (@universidad-norte.edu) de manera coherente con la procedencia del mensaje.',
    },
    domain: 'universidad-norte.edu',
    domainClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'El dominio universidad-norte.edu corresponde al servidor oficial de la institución educativa.',
    },
    subject: 'Publicación del calendario oficial de evaluaciones parciales y revisiones',
    subjectClue: {
      isClue: false,
      explanation: 'El asunto es puramente informativo, sin términos alarmistas ni apremios injustificados.',
    },
    dateLabel: '24 de octubre, 14:15',
    preview: 'Estimados estudiantes, se encuentra disponible para su consulta el cronograma de exámenes parciales del segundo periodo...',
    paragraphs: [
      [
        'Estimados', 'estudiantes,',
      ],
      [
        'Nos', 'comunicamos', 'para', 'informarles', 'que', 'el', 'Consejo', 'de', 'Facultad',
        'ha', 'aprobado', 'el', 'calendario', 'oficial', 'de', 'evaluaciones', 'parciales',
        'correspondiente', 'al', 'segundo', 'periodo', 'del', 'semestre', 'en', 'curso.',
      ],
      [
        'El', 'cronograma', 'detalla', 'las', 'fechas,', 'aulas', 'asignadas', 'y', 'los',
        'horarios', 'de', 'revisión', 'con', 'el', 'profesorado', 'de', 'cada', 'asignatura.',
        'Les', 'recordamos', 'que', 'las', 'solicitudes', 'de', 'reprogramación', 'por',
        'causas', 'médicas', 'o', 'fuerza', 'mayor', 'deben', 'tramitarse', 'conforme',
        'al', 'reglamento', 'académico', 'a', 'través', 'del', 'campus', 'virtual.',
      ],
      [
        'Pueden', 'consultar', 'el', 'documento', 'completo', 'en', 'el', 'portal', 'de',
        'la', 'facultad', 'o', 'descargarlo', 'en', 'el', 'archivo', 'adjunto', 'a', 'este',
        'mensaje.',
      ],
      [
        'Cordialmente,',
      ],
      [
        'Dra.', 'Elena', 'Valenzuela', 'M.',
      ],
      [
        'Coordinadora', 'de', 'Gestión', 'Curricular', '—', 'Universidad', 'Norte',
      ],
    ],
    apparentLinks: [
      {
        id: 'link-1',
        label: 'Consultar cronograma en el campus institucional',
        displayedUrl: 'https://campus.universidad-norte.edu/evaluaciones/calendario-2026',
        isClue: true,
        category: 'contextual',
        explanation: 'El enlace apunta a la dirección canónica y oficial de la universidad (campus.universidad-norte.edu), coherente con el remitente.',
      },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Calendario_Oficial_Evaluaciones_2026.pdf',
        fileSize: '348 KB',
        fileType: 'application/pdf',
        isClue: false,
        explanation: 'Documento en formato estándar no ejecutable coherente con el propósito del correo.',
      },
    ],
    referenceClassification: 'legitimate',
    referenceExplanation: 'El mensaje es plenamente coherente con la vida académica: proviene del dominio oficial de la institución, la URL aparente pertenece al mismo servidor educativo, no solicita contraseñas ni datos sensibles, y el tono es formal e informativo sin apremios desproporcionados.',
    signals: [
      {
        elementIds: ['ex-02-meta-sender-address', 'ex-02-meta-domain', 'ex-02-link-link-1'],
        category: 'contextual',
        title: 'Coherencia del dominio y canales institucionales',
        explanation: 'Tanto el remitente como el enlace pertenecen al dominio oficial de la universidad, sin solicitudes de claves ni cobros.',
      },
      {
        elementIds: [],
        category: 'linguistic',
        title: 'Lenguaje informativo sin manipulación psicológica',
        explanation: 'La redacción es neutra y profesional, recordando procedimientos reglamentarios sin emplear ultimátums artificiales.',
      },
    ],
    learningObjective: 'Comprender que los correos formales con enlaces y adjuntos pueden ser completamente legítimos cuando el contexto y los dominios son plenamente coherentes y no solicitan datos sensibles.',
    practicalRecommendation: 'Revisar la coherencia entre el remitente, los enlaces y los procedimientos cotidianos. La presencia de un enlace o un adjunto no es por sí misma una prueba de fraude.',
    institutionalVisuals: {
      organizationName: 'Universidad Norte — Facultad de Ingeniería',
      department: 'Secretaría de Asuntos Académicos y Registro',
      footerNotice: 'Universidad Norte · Acreditación Institucional de Alta Calidad · Notificación oficial.',
    },
  },

  // =========================================================================
  // EJERCICIO 3 — Aviso de entrega pendiente (PHISHING)
  // =========================================================================
  {
    id: 'ex-03',
    title: 'Incidencia en la entrega de paquetería comercial',
    difficulty: 'intermediate',
    scenario: 'Recibes una notificación de una empresa de envíos que señala la retención de un paquete por falta de datos y solicita abonar una pequeña tasa de gestión para no devolverlo.',
    senderName: 'Servicio de Distribución y Envíos Express',
    senderNameClue: {
      isClue: false,
      explanation: 'Nombre comercial genérico utilizado para despertar curiosidad sobre supuestas compras recientes.',
    },
    senderAddress: 'atencion-clientes@logistica-envios-express.com',
    senderAddressClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'Dirección de correo bajo un dominio genérico que no corresponde a ningún operador con el que se haya contratado previamente un servicio.',
    },
    domain: 'logistica-envios-express.com',
    domainClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'Dominio genérico comercial que no aporta credenciales de trazabilidad legítimas.',
    },
    subject: 'Incidencia en la entrega de su envío #EXP-7749102: Acción requerida',
    subjectClue: {
      isClue: false,
      explanation: 'Uso de un código de envío simulado para dar una apariencia realista de trámite en curso.',
    },
    dateLabel: '25 de octubre, 11:40',
    preview: 'Su paquete con número de seguimiento EXP-7749102 se encuentra retenido en el centro de clasificación por dirección incompleta...',
    paragraphs: [
      [
        'Estimado/a', 'destinatario/a,',
      ],
      [
        'Le', 'informamos', 'que', 'su', 'paquete', 'con', 'número', 'de', 'seguimiento',
        'EXP-7749102', 'no', 'ha', 'podido', 'ser', 'entregado', 'en', 'la', 'fecha',
        'prevista', 'debido', 'a', 'una', 'discrepancia', 'en', 'la', 'dirección', 'registrada.',
      ],
      [
        'El', 'envío', 'se', 'encuentra', 'temporalmente', 'custodiado', 'en', 'el', 'centro',
        'logístico', 'regional.', 'Para', 'programar', 'un', 'segundo', 'intento', 'de', 'entrega,',
        'es', 'necesario', 'actualizar', 'los', 'datos', 'de', 'contacto', 'y',
        { word: 'abonar', isClue: true, category: 'linguistic', explanation: 'Petición inusual de pago de tarifas imprevistas para liberar un paquete.' },
        { word: 'la', isClue: true, category: 'linguistic', explanation: 'Petición de pago.' },
        { word: 'tasa', isClue: true, category: 'linguistic', explanation: 'Exigencia de dinero no pactado.' },
        { word: 'de', isClue: true, category: 'linguistic', explanation: 'Exigencia de dinero.' },
        { word: 'gestión', isClue: true, category: 'linguistic', explanation: 'Justificación ambigua de cobro.' },
        { word: 'aduanera', isClue: true, category: 'linguistic', explanation: 'Cobro no solicitado.' },
        'por', 'un', 'importe', 'de',
        { word: '$2.40', isClue: true, category: 'linguistic', explanation: 'Monto pequeño intencionado para no levantar sospechas y facilitar que la víctima ingrese datos de tarjeta.' },
        'USD.',
      ],
      [
        'Si', 'el', 'trámite', 'no', 'se', 'completa',
        { word: 'dentro', isClue: true, category: 'linguistic', explanation: 'Presión por límite de tiempo.' },
        { word: 'de', isClue: true, category: 'linguistic', explanation: 'Presión temporal.' },
        { word: 'las', isClue: true, category: 'linguistic', explanation: 'Presión temporal.' },
        { word: 'próximas', isClue: true, category: 'linguistic', explanation: 'Presión temporal.' },
        { word: '48', isClue: true, category: 'linguistic', explanation: 'Plazo límite perentorio para impedir la reflexión del usuario.' },
        { word: 'horas,', isClue: true, category: 'linguistic', explanation: 'Límite de tiempo.' },
        'el', 'paquete',
        { word: 'será', isClue: true, category: 'linguistic', explanation: 'Amenaza de pérdida del bien.' },
        { word: 'devuelto', isClue: true, category: 'linguistic', explanation: 'Amenaza de devolución.' },
        'al', 'remitente', 'y', 'se', 'aplicarán', 'cargos', 'adicionales', 'de', 'almacenamiento.',
      ],
      [
        'Puede', 'actualizar', 'su', 'dirección', 'y', 'formalizar', 'el', 'pago', 'en', 'el', 'siguiente', 'enlace:',
      ],
      [
        'Departamento', 'de', 'Operaciones', '—', 'Logística', 'Express',
      ],
    ],
    apparentLinks: [
      {
        id: 'link-1',
        label: 'Completar datos de entrega y abonar tasa de $2.40',
        displayedUrl: 'https://pago-tasas-distribucion.com/rastreo-pago?ref=EXP-7749102',
        isClue: true,
        category: 'contextual',
        explanation: 'La URL aparente redirige a pago-tasas-distribucion.com, un portal sospechoso no relacionado con una empresa oficial de envíos, diseñado para capturar datos de pago.',
      },
    ],
    referenceClassification: 'phishing',
    referenceExplanation: 'El mensaje presenta una estafa clásica de suplantación de paquetería: se notifica una entrega no solicitada previamente, se exige un micropago con tarjeta bancaria y se amenaza con la devolución en 48 horas a través de un enlace a un dominio no oficial.',
    signals: [
      {
        elementIds: ['ex-03-meta-sender-address', 'ex-03-meta-domain', 'ex-03-link-link-1'],
        category: 'contextual',
        title: 'Cobro imprevisto y enlace de pago no verificado',
        explanation: 'Se solicita un pago mediante un dominio externo de cobranza sin respaldo de una compra previa realizada por el usuario.',
      },
      {
        elementIds: ['ex-03-w50', 'ex-03-w52', 'ex-03-w56', 'ex-03-w64', 'ex-03-w65', 'ex-03-w70', 'ex-03-w71'],
        category: 'linguistic',
        title: 'Micropago señuelo y amenaza de devolución',
        explanation: 'El cobro de una cifra pequeña ($2.40 USD) busca vencer la resistencia del usuario mediante la urgencia de no perder el supuesto paquete.',
      },
    ],
    learningObjective: 'Identificar que las solicitudes de pago imprevistas para paquetería, incluso por montos reducidos, suelen ser vectores de fraude para robar datos de tarjetas.',
    practicalRecommendation: 'Si no espera ningún paquete, desconfíe. Si tiene envíos pendientes, acceda directamente a la aplicación o sitio oficial de la tienda donde compró, sin abrir enlaces recibidos por correo.',
    institutionalVisuals: {
      organizationName: 'Logística & Distribución Express',
      department: 'Centro Automatizado de Envíos Nacionales',
      securityBanner: 'NOTIFICACIÓN DE CUSTODIA TEMPORAL',
      footerNotice: 'Conserve este comprobante para cualquier aclaración ante el operador logístico.',
    },
  },

  // =========================================================================
  // EJERCICIO 4 — Notificación legítima de aula virtual (LEGÍTIMO)
  // =========================================================================
  {
    id: 'ex-04',
    title: 'Notificación de entrega en aula virtual universitaria',
    difficulty: 'intermediate',
    scenario: 'El sistema automatizado del campus virtual notifica la apertura de una entrega de taller con fecha límite de recepción.',
    senderName: 'Campus Virtual — Notificaciones de Aula',
    senderNameClue: {
      isClue: false,
      explanation: 'Remitente automatizado de la plataforma de aprendizaje del campus.',
    },
    senderAddress: 'notificaciones-aulas@plataforma-educativa-virtual.org',
    senderAddressClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'El dominio coincide con la plataforma tecnológica educativa formal utilizada por la institución.',
    },
    domain: 'plataforma-educativa-virtual.org',
    domainClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'Dominio institucional correspondiente a la plataforma del entorno virtual de aprendizaje.',
    },
    subject: 'Nueva actividad disponible: Entrega del Borrador de Proyecto de Investigación',
    subjectClue: {
      isClue: false,
      explanation: 'Asunto descriptivo y acorde al calendario de un curso universitario regular.',
    },
    dateLabel: '25 de octubre, 16:00',
    preview: 'Se ha habilitado en el aula virtual la entrega de la Actividad 3: Borrador de Proyecto. La fecha límite de recepción es el 30 de octubre...',
    paragraphs: [
      [
        'Estimado/a', 'estudiante,',
      ],
      [
        'Le', 'informamos', 'que', 'en', 'el', 'curso', 'Taller', 'de', 'Metodología', 'de',
        'la', 'Investigación', '(Grupo', '02)', 'se', 'ha', 'habilitado', 'el', 'buzón',
        'de', 'entrega', 'para', 'la', 'actividad:',
      ],
      [
        '«Actividad', '3:', 'Borrador', 'del', 'Marco', 'Metodológico', 'y', 'Cronograma».',
      ],
      [
        'Fecha', 'límite', 'de', 'entrega:', '30', 'de', 'octubre', 'de', '2026', 'a', 'las', '23:59', 'horas.',
      ],
      [
        'Recuerde', 'que', 'el', 'documento', 'debe', 'subirse', 'en', 'formato', 'PDF', 'siguiendo',
        'la', 'rúbrica', 'disponible', 'en', 'el', 'módulo', 'del', 'curso.', 'No', 'se',
        'recibirán', 'trabajos', 'por', 'correo', 'electrónico.',
      ],
      [
        'Puede', 'acceder', 'directamente', 'a', 'la', 'consigna', 'y', 'al', 'espacio', 'de',
        'subida', 'a', 'través', 'del', 'aula', 'virtual:',
      ],
      [
        'Este', 'es', 'un', 'mensaje', 'generado', 'automáticamente', 'por', 'la', 'plataforma', 'educativa.',
      ],
    ],
    apparentLinks: [
      {
        id: 'link-1',
        label: 'Ver consigna y buzón en el aula virtual',
        displayedUrl: 'https://plataforma-educativa-virtual.org/cursos/metodologia/actividad-3',
        isClue: true,
        category: 'contextual',
        explanation: 'El enlace apunta a la ruta canónica y segura de la plataforma educativa oficial (@plataforma-educativa-virtual.org), sin redirigir a sitios externos.',
      },
    ],
    referenceClassification: 'legitimate',
    referenceExplanation: 'Es una notificación legítima típica de un aula virtual. Contiene una fecha límite y un enlace directo a la plataforma educativa oficial, sin solicitar credenciales ni contraseñas. Demuestra que la presencia de plazos y enlaces no convierte automáticamente un mensaje en phishing.',
    signals: [
      {
        elementIds: ['ex-04-meta-sender-address', 'ex-04-meta-domain', 'ex-04-link-link-1'],
        category: 'contextual',
        title: 'Coherencia de la plataforma institucional',
        explanation: 'La URL y el remitente corresponden con exactitud al dominio del entorno virtual de aprendizaje.',
      },
      {
        elementIds: [],
        category: 'linguistic',
        title: 'Plazo académico ordinario',
        explanation: 'La fecha límite de 5 días es habitual en un entorno formativo y no constituye presión maliciosa.',
      },
    ],
    learningObjective: 'Aprender que los mensajes legítimos también incluyen enlaces y fechas límite; no se debe asumir fraude únicamente porque un correo señale una fecha de vencimiento.',
    practicalRecommendation: 'Compruebe que el enlace apunte al dominio legítimo de su aula virtual y que el correo no solicite sus credenciales de acceso.',
    institutionalVisuals: {
      organizationName: 'Plataforma de Entornos Virtuales de Aprendizaje',
      department: 'Dirección de Innovación y Educación Digital',
      footerNotice: 'Campus Virtual · Sistema automatizado de notificaciones pedagógicas.',
    },
  },

  // =========================================================================
  // EJERCICIO 5 — Mensaje con información insuficiente (INSUFFICIENT INFORMATION)
  // =========================================================================
  {
    id: 'ex-05',
    title: 'Notificación de documento compartido en red colaborativa',
    difficulty: 'advanced',
    scenario: 'Recibes un mensaje escueto indicando que se ha actualizado un documento compartido en un espacio en la nube, sin especificar el remitente individual ni el proyecto.',
    senderName: 'Colaboración en la Nube',
    senderNameClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'El nombre visible es ambiguo y no identifica a un contacto o colega específico.',
    },
    senderAddress: 'comunicaciones@red-colaborativa-docs.org',
    senderAddressClue: {
      isClue: false,
      explanation: 'La dirección pertenece a un dominio estructurado, pero no permite saber si la persona que compartió el archivo es un contacto conocido.',
    },
    domain: 'red-colaborativa-docs.org',
    domainClue: {
      isClue: false,
      explanation: 'El dominio tiene estructura formal, pero no existen datos suficientes en el correo para validar si el servicio es empleado legítimamente por el equipo de trabajo.',
    },
    subject: 'Un archivo compartido ha sido actualizado: Resumen_Reunion_Octubre.pdf',
    subjectClue: {
      isClue: false,
      explanation: 'El asunto nombra un documento genérico sin contexto de autoría.',
    },
    dateLabel: '25 de octubre, 09:20',
    preview: 'El documento Resumen_Reunion_Octubre.pdf ha recibido cambios recientes. Puede consultarlo en el visor de documentos en línea...',
    paragraphs: [
      [
        'Hola,',
      ],
      [
        'Le', 'comunicamos', 'que', 'se', 'han', 'registrado', 'nuevas', 'modificaciones',
        'en', 'el', 'documento', 'compartido', '«Resumen_Reunion_Octubre.pdf».',
      ],
      [
        'El', 'archivo', 'se', 'encuentra', 'disponible', 'para', 'su', 'lectura',
        'en', 'la', 'carpeta', 'compartida', 'del', 'espacio', 'de', 'trabajo.',
      ],
      [
        'Para', 'revisar', 'las', 'versiones', 'recientes,', 'puede', 'acceder',
        'a', 'través', 'del', 'enlace', 'proporcionado', 'a', 'continuación:',
      ],
      [
        'Si', 'no', 'reconoce', 'este', 'archivo,', 'puede', 'ignorar', 'este', 'aviso.',
      ],
      [
        'Equipo', 'de', 'Soporte', 'de', 'Espacios', 'Compartidos',
      ],
    ],
    apparentLinks: [
      {
        id: 'link-1',
        label: 'Abrir Resumen_Reunion_Octubre.pdf en el visor',
        displayedUrl: 'https://red-colaborativa-docs.org/doc/view?id=83912',
        isClue: false,
        explanation: 'El enlace es coherente con el dominio del remitente, pero no hay indicios suficientes para confirmar la legitimidad del remitente ni del archivo.',
      },
    ],
    referenceClassification: 'insufficient_information',
    referenceExplanation: 'El correo carece de información contextual determinante: no hay amenazas, ni solicitudes flagrantes de contraseñas, ni errores evidentes, pero tampoco se identifica qué persona u organización comparte el archivo. Ante la falta de contexto suficiente, no se puede clasificar de forma concluyente como legítimo ni como phishing.',
    signals: [
      {
        elementIds: ['ex-05-meta-sender-name'],
        category: 'contextual',
        title: 'Ausencia de identidad del autor o proyecto',
        explanation: 'El mensaje no indica quién compartió el documento ni en el marco de qué actividad, lo que impide comprobar su autenticidad desde el propio correo.',
      },
      {
        elementIds: [],
        category: 'linguistic',
        title: 'Falta de elementos concluyentes de fraude o legitimidad',
        explanation: 'No hay señales explícitas de urgencia, coerción ni solicitudes de credenciales, pero tampoco hay firmas de personas identificables.',
      },
    ],
    learningObjective: 'Reconocer que cuando la información es insuficiente para determinar la autenticidad de un mensaje, la respuesta metodológicamente correcta es admitir la incertidumbre y verificar por otros canales.',
    practicalRecommendation: 'No abra el enlace. Contacte a sus colegas o al coordinador de su equipo mediante un canal independiente (chat interno, llamada o en persona) para confirmar si alguien compartió dicho documento.',
    institutionalVisuals: {
      organizationName: 'Plataforma de Documentos en la Nube',
      department: 'Servicio de Trabajo Colaborativo',
      footerNotice: 'Notificación de actividad sobre recursos compartidos en red.',
    },
  },

  // =========================================================================
  // EJERCICIO 6 — Supuesto soporte técnico (PHISHING)
  // =========================================================================
  {
    id: 'ex-06',
    title: 'Solicitud de sincronización de autenticación por soporte técnico',
    difficulty: 'advanced',
    scenario: 'Un supuesto ingeniero de la mesa de ayuda de soporte técnico te informa que tu token de doble factor (MFA) falló y te pide responder con el código numérico recibido en tu teléfono.',
    senderName: 'Mesa de Ayuda Informática — Soporte Técnico TI',
    senderNameClue: {
      isClue: false,
      explanation: 'El nombre emula un canal de soporte técnico legítimo con tono profesional.',
    },
    senderAddress: 'soporte-tecnico-mesadeayuda@gestion-incidencias-ti.com',
    senderAddressClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'El dominio gestion-incidencias-ti.com es externo e independiente, ajeno al sistema formal de la organización.',
    },
    domain: 'gestion-incidencias-ti.com',
    domainClue: {
      isClue: true,
      category: 'contextual',
      explanation: 'Dominio externo no perteneciente a la infraestructura de la universidad o empresa.',
    },
    subject: 'Ticket #INC-84920: Sincronización requerida para su token de autenticación MFA',
    subjectClue: {
      isClue: false,
      explanation: 'Uso de un código de ticket formal (#INC-84920) para simular un proceso de atención técnica regular.',
    },
    dateLabel: '25 de octubre, 17:10',
    preview: 'Nos encontramos atendiendo una incidencia en la sincronización de tokens MFA. Por favor, confirme el código de 6 dígitos...',
    paragraphs: [
      [
        'Estimado/a', 'colaborador/a,',
      ],
      [
        'Le', 'contacta', 'el', 'Área', 'de', 'Soporte', 'Técnico', 'e', 'Infraestructura',
        'en', 'relación', 'con', 'el', 'ticket', 'abierto', '#INC-84920.', 'Hemos', 'detectado',
        'una', 'desincronización', 'en', 'su', 'dispositivo', 'de', 'doble', 'factor',
        'de', 'autenticación', '(MFA).',
      ],
      [
        'Para', 'completar', 'el', 'reajuste', 'del', 'servidor', 'sin', 'interrumpir',
        'su', 'conexión,', 'el', 'sistema', 'enviará', 'un', 'código', 'de', 'verificación',
        'temporal', 'a', 'su', 'teléfono', 'móvil', 'o', 'aplicación', 'autenticadora.',
      ],
      [
        'Le', 'solicitamos', 'que',
        { word: 'nos', isClue: true, category: 'linguistic', explanation: 'Petición directa de divulgación de credencial a un tercero.' },
        { word: 'proporcione', isClue: true, category: 'linguistic', explanation: 'Petición explícita de código de seguridad.' },
        { word: 'el', isClue: true, category: 'linguistic', explanation: 'Petición de código.' },
        { word: 'código', isClue: true, category: 'linguistic', explanation: 'Solicitud de código de verificación confidencial.' },
        { word: 'de', isClue: true, category: 'linguistic', explanation: 'Solicitud de credencial temporal.' },
        { word: '6', isClue: true, category: 'linguistic', explanation: 'Solicitud de token MFA numérico.' },
        { word: 'dígitos', isClue: true, category: 'linguistic', explanation: 'Token de un solo uso (OTP).' },
        'respondiendo', 'a', 'este', 'mensaje', 'o', 'ingresándolo', 'en', 'el', 'asistente',
        'en', 'línea',
        { word: 'en', isClue: true, category: 'linguistic', explanation: 'Presión temporal.' },
        { word: 'los', isClue: true, category: 'linguistic', explanation: 'Presión de tiempo.' },
        { word: 'próximos', isClue: true, category: 'linguistic', explanation: 'Plazo perentorio.' },
        { word: '15', isClue: true, category: 'linguistic', explanation: 'Plazo de 15 minutos para forzar el envío del código antes de que expire.' },
        { word: 'minutos.', isClue: true, category: 'linguistic', explanation: 'Tiempo límite típico de un OTP.' },
      ],
      [
        'En', 'caso', 'de', 'no', 'confirmar', 'el', 'código,', 'su', 'perfil',
        { word: 'quedará', isClue: true, category: 'linguistic', explanation: 'Amenaza de bloqueo.' },
        { word: 'bloqueado', isClue: true, category: 'linguistic', explanation: 'Amenaza de suspensión de acceso.' },
        'hasta', 'su', 'validación', 'personal', 'en', 'la', 'oficina', 'central.',
      ],
      [
        'Ing.', 'Carlos', 'Mendoza', '—', 'Especialista', 'en', 'Redes', 'y', 'Soporte', 'TI',
      ],
      [
        'Mesa', 'de', 'Servicios', 'Tecnológicos', '·', 'Ext.', '4102',
      ],
    ],
    apparentLinks: [
      {
        id: 'link-1',
        label: 'Ingresar código en el asistente de sincronización',
        displayedUrl: 'https://soporte-validacion-token.com/mfa-sync?ticket=INC-84920',
        isClue: true,
        category: 'contextual',
        explanation: 'Enlace a un portal externo no institucional (soporte-validacion-token.com) destinado a recolectar códigos MFA en tiempo real.',
      },
    ],
    referenceClassification: 'phishing',
    referenceExplanation: 'Es un ataque sofisticado de ingeniería social dirigido a vulnerar el doble factor de autenticación (MFA). El soporte técnico legítimo NUNCA solicita códigos de verificación, tokens dinámicos ni contraseñas. Además, el remitente y el enlace utilizan dominios externos.',
    signals: [
      {
        elementIds: ['ex-06-w55', 'ex-06-w56', 'ex-06-w57', 'ex-06-w58', 'ex-06-w59', 'ex-06-w60', 'ex-06-w61'],
        category: 'linguistic',
        title: 'Solicitud ilícita de código de doble factor (MFA/OTP)',
        explanation: 'El personal de soporte técnico jamás solicita códigos temporales ni contraseñas bajo ninguna circunstancia operativa.',
      },
      {
        elementIds: ['ex-06-meta-sender-address', 'ex-06-meta-domain', 'ex-06-link-link-1'],
        category: 'contextual',
        title: 'Dominios no institucionales y enlace malicioso',
        explanation: 'La dirección y el enlace operan en dominios ajenos a la organización para capturar el código y vulnerar la sesión.',
      },
      {
        elementIds: ['ex-06-w68', 'ex-06-w69', 'ex-06-w70', 'ex-06-w71', 'ex-06-w72', 'ex-06-w77', 'ex-06-w78'],
        category: 'linguistic',
        title: 'Plazo crítico de 15 minutos y amenaza de bloqueo',
        explanation: 'El plazo perentorio coincide con el tiempo de vida del código MFA para que el atacante pueda usarlo antes de expirar.',
      },
    ],
    learningObjective: 'Interiorizar la regla fundamental de que ningún área legítima de soporte técnico solicita códigos de verificación de doble factor ni contraseñas.',
    practicalRecommendation: 'Nunca comparta un código de verificación, SMS o token con nadie, ni por correo, ni por teléfono, ni en páginas web no oficiales. Reporte el intento inmediatamente a la seguridad informática de su institución.',
    institutionalVisuals: {
      organizationName: 'Dirección de Tecnologías de Información y Comunicación',
      department: 'Mesa de Ayuda y Gestión de Identidades',
      securityBanner: 'GESTIÓN DE INCIDENCIAS DE SEGURIDAD',
      footerNotice: 'Aviso: La mesa de soporte nunca le solicitará contraseñas ni códigos de autenticación.',
    },
  },
];

export const INITIAL_EXERCISES: Exercise[] = rawExercises.map(buildExercise);
