import {
  EmailElement,
  Exercise,
  ExerciseSignal,
  MessageClassification,
  SignalCategory,
  ApparentLink,
  EmailAttachment,
} from '../../domain/types/exercise.ts';

export interface RawWordConfig {
  word: string;
  isClue?: boolean;
  category?: SignalCategory;
  subcategory?: string;
  explanation?: string;
}

export interface RawParagraphConfig {
  words: (string | RawWordConfig)[];
}

export interface RawExerciseDefinition {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  senderName: string;
  senderNameClue?: { isClue: boolean; category?: SignalCategory; subcategory?: string; explanation?: string };
  senderAddress: string;
  senderAddressClue?: { isClue: boolean; category?: SignalCategory; subcategory?: string; explanation?: string };
  domain: string;
  domainClue?: { isClue: boolean; category?: SignalCategory; subcategory?: string; explanation?: string };
  subject: string;
  subjectClue?: { isClue: boolean; category?: SignalCategory; subcategory?: string; explanation?: string };
  dateLabel: string;
  preview: string;
  paragraphs: (string | (string | RawWordConfig)[])[];
  apparentLinks?: Array<{
    id: string;
    label: string;
    displayedUrl: string;
    isClue?: boolean;
    category?: SignalCategory;
    subcategory?: string;
    explanation?: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    fileSize?: string;
    fileType?: string;
    category?: SignalCategory;
    subcategory?: string;
    isClue?: boolean;
    explanation?: string;
  }>;
  visualNotice?: {
    text: string;
    isClue?: boolean;
    category?: SignalCategory;
    subcategory?: string;
    explanation?: string;
  };
  referenceClassification: MessageClassification;
  referenceExplanation: string;
  signals: Array<{
    elementIds?: string[];
    matchWords?: string[];
    category: SignalCategory;
    title: string;
    explanation: string;
  }>;
  learningObjective: string;
  practicalRecommendation: string;
  institutionalVisuals?: {
    organizationName?: string;
    department?: string;
    noticeBadge?: string;
    securityBanner?: string;
    footerNotice?: string;
  };
}

export function inferSubcategory(
  type: string,
  text: string,
  isClue: boolean,
  explicitSubcategory?: string,
  explanation?: string
): string {
  if (explicitSubcategory) return explicitSubcategory;

  switch (type) {
    case 'sender_name':
      return isClue ? 'remitente_suplantado' : 'remitente_habitual';
    case 'sender_address':
      return isClue ? 'direccion_anomala' : 'direccion_institucional';
    case 'domain':
      return isClue ? 'dominio_externo' : 'dominio_institucional';
    case 'subject':
      if (isClue && text.toUpperCase().includes('URGENTE')) return 'urgencia';
      return isClue ? 'asunto_sospechoso' : 'asunto_ordinario';
    case 'link':
      if (isClue) {
        const exp = (explanation || '').toLowerCase();
        if (exp.includes('pago') || exp.includes('tarifa')) return 'enlace_pago';
        if (exp.includes('token') || exp.includes('credenciales') || exp.includes('acceso')) return 'enlace_credenciales';
        return 'enlace_externo_sospechoso';
      }
      return 'enlace_institucional_legitimo';
    case 'attachment':
      return isClue ? 'adjunto_sospechoso' : 'adjunto_legitimo';
    case 'visual_element':
      return 'identidad_visual';
    case 'word':
    default:
      if (isClue) {
        const exp = (explanation || '').toLowerCase();
        const txt = text.toLowerCase();
        if (
          exp.includes('urgencia') ||
          exp.includes('temporal') ||
          exp.includes('horas') ||
          exp.includes('minutos') ||
          exp.includes('plazo') ||
          exp.includes('cuenta regresiva')
        ) {
          return 'urgencia';
        }
        if (
          exp.includes('amenaza') ||
          exp.includes('suspendido') ||
          exp.includes('bloqueado') ||
          exp.includes('devuelto') ||
          exp.includes('irrevocable')
        ) {
          return 'amenaza';
        }
        if (
          exp.includes('pago') ||
          exp.includes('tasa') ||
          txt.includes('$') ||
          exp.includes('dinero') ||
          exp.includes('cobro')
        ) {
          return 'solicitud_pago';
        }
        if (
          exp.includes('código') ||
          exp.includes('token') ||
          exp.includes('mfa') ||
          exp.includes('otp') ||
          exp.includes('credenciales') ||
          exp.includes('contraseña')
        ) {
          return 'solicitud_credenciales';
        }
        if (
          exp.includes('imperativo') ||
          exp.includes('coercitivo') ||
          exp.includes('obligatorio') ||
          exp.includes('autoridad')
        ) {
          return 'autoridad_presion';
        }
        return 'lenguaje_persuasivo';
      }
      return 'texto_ordinario';
  }
}

export function inferCategory(type: string, explicitCategory?: SignalCategory): SignalCategory {
  if (explicitCategory) return explicitCategory;
  if (type === 'visual_element') return 'visual';
  if (
    type === 'sender_name' ||
    type === 'sender_address' ||
    type === 'domain' ||
    type === 'link' ||
    type === 'attachment'
  ) {
    return 'contextual';
  }
  return 'linguistic';
}

/**
 * Builds a pristine, fully synchronized Exercise domain model with categories and subcategories.
 */
export function buildExercise(def: RawExerciseDefinition): Exercise {
  const metadataElements: EmailElement[] = [];

  // Metadata element 1: Sender Name
  const senderNameCat = inferCategory('sender_name', def.senderNameClue?.category);
  const senderNameSub = inferSubcategory(
    'sender_name',
    def.senderName,
    def.senderNameClue?.isClue ?? false,
    def.senderNameClue?.subcategory,
    def.senderNameClue?.explanation
  );
  metadataElements.push({
    id: `${def.id}-meta-sender-name`,
    text: def.senderName,
    type: 'sender_name',
    category: senderNameCat,
    subcategory: senderNameSub,
    isRelevantClue: def.senderNameClue?.isClue ?? false,
    explanation: def.senderNameClue?.explanation,
  });

  // Metadata element 2: Sender Address
  const senderAddressCat = inferCategory('sender_address', def.senderAddressClue?.category);
  const senderAddressSub = inferSubcategory(
    'sender_address',
    def.senderAddress,
    def.senderAddressClue?.isClue ?? false,
    def.senderAddressClue?.subcategory,
    def.senderAddressClue?.explanation
  );
  metadataElements.push({
    id: `${def.id}-meta-sender-address`,
    text: def.senderAddress,
    type: 'sender_address',
    category: senderAddressCat,
    subcategory: senderAddressSub,
    isRelevantClue: def.senderAddressClue?.isClue ?? false,
    explanation: def.senderAddressClue?.explanation,
  });

  // Metadata element 3: Domain
  const domainCat = inferCategory('domain', def.domainClue?.category);
  const domainSub = inferSubcategory(
    'domain',
    def.domain,
    def.domainClue?.isClue ?? false,
    def.domainClue?.subcategory,
    def.domainClue?.explanation
  );
  metadataElements.push({
    id: `${def.id}-meta-domain`,
    text: def.domain,
    type: 'domain',
    category: domainCat,
    subcategory: domainSub,
    isRelevantClue: def.domainClue?.isClue ?? false,
    explanation: def.domainClue?.explanation,
  });

  // Metadata element 4: Subject
  const subjectCat = inferCategory('subject', def.subjectClue?.category);
  const subjectSub = inferSubcategory(
    'subject',
    def.subject,
    def.subjectClue?.isClue ?? false,
    def.subjectClue?.subcategory,
    def.subjectClue?.explanation
  );
  metadataElements.push({
    id: `${def.id}-meta-subject`,
    text: def.subject,
    type: 'subject',
    category: subjectCat,
    subcategory: subjectSub,
    isRelevantClue: def.subjectClue?.isClue ?? false,
    explanation: def.subjectClue?.explanation,
  });

  // Optional visual notice element
  if (def.visualNotice) {
    const visualCat = inferCategory('visual_element', def.visualNotice.category);
    const visualSub = inferSubcategory(
      'visual_element',
      def.visualNotice.text,
      def.visualNotice.isClue ?? false,
      def.visualNotice.subcategory,
      def.visualNotice.explanation
    );
    metadataElements.push({
      id: `${def.id}-visual-notice`,
      text: def.visualNotice.text,
      type: 'visual_element',
      category: visualCat,
      subcategory: visualSub,
      isRelevantClue: def.visualNotice.isClue ?? false,
      explanation: def.visualNotice.explanation,
    });
  }

  // Build body elements word by word
  const bodyElements: EmailElement[] = [];
  let wordIndex = 0;

  def.paragraphs.forEach((paragraph, pIdx) => {
    const isLastParagraph = pIdx === def.paragraphs.length - 1;

    let words: (string | RawWordConfig)[] = [];
    if (typeof paragraph === 'string') {
      words = paragraph.trim().split(/\s+/).filter(Boolean);
    } else {
      words = paragraph;
    }

    words.forEach((item, wIdx) => {
      wordIndex++;
      const isLastWordInParagraph = wIdx === words.length - 1;

      let wordText = '';
      let isClue = false;
      let category: SignalCategory | undefined;
      let subcategory: string | undefined;
      let explanation: string | undefined;

      if (typeof item === 'string') {
        wordText = item;
      } else {
        wordText = item.word;
        isClue = item.isClue ?? false;
        category = item.category;
        subcategory = item.subcategory;
        explanation = item.explanation;
      }

      const inferredCat = inferCategory('word', category);
      const inferredSub = inferSubcategory('word', wordText, isClue, subcategory, explanation);

      bodyElements.push({
        id: `${def.id}-w${wordIndex}`,
        text: wordText,
        type: 'word',
        category: inferredCat,
        subcategory: inferredSub,
        isRelevantClue: isClue,
        explanation,
        trailingSpace: !isLastWordInParagraph,
        newlineAfter: false,
        paragraphBreakAfter: isLastWordInParagraph && !isLastParagraph,
      });
    });
  });

  // Build Apparent Links
  const apparentLinks: ApparentLink[] = (def.apparentLinks || []).map((link, idx) => {
    const elementId = `${def.id}-link-${link.id || idx + 1}`;
    const linkCat = inferCategory('link', link.category);
    const linkSub = inferSubcategory(
      'link',
      link.displayedUrl,
      link.isClue ?? false,
      link.subcategory,
      link.explanation
    );
    return {
      id: link.id || `${idx + 1}`,
      label: link.label,
      displayedUrl: link.displayedUrl,
      elementId,
      category: linkCat,
      subcategory: linkSub,
      isRelevantClue: link.isClue ?? false,
      explanation: link.explanation,
    };
  });

  // Build Attachments
  const attachments: EmailAttachment[] = (def.attachments || []).map((att, idx) => {
    const elementId = `${def.id}-att-${att.id || idx + 1}`;
    const attCat = inferCategory('attachment', att.category);
    const attSub = inferSubcategory(
      'attachment',
      att.name,
      att.isClue ?? false,
      att.subcategory,
      att.explanation
    );
    return {
      id: att.id || `${idx + 1}`,
      name: att.name,
      elementId,
      fileSize: att.fileSize,
      fileType: att.fileType,
      category: attCat,
      subcategory: attSub,
      isRelevantClue: att.isClue ?? false,
      explanation: att.explanation,
    };
  });

  // Compile final signals
  const signals: ExerciseSignal[] = def.signals.map((sig) => {
    const elementIds = [...(sig.elementIds || [])];
    return {
      elementIds,
      category: sig.category,
      title: sig.title,
      explanation: sig.explanation,
    };
  });

  return {
    id: def.id,
    title: def.title,
    difficulty: def.difficulty,
    scenario: def.scenario,
    senderName: def.senderName,
    senderAddress: def.senderAddress,
    domain: def.domain,
    subject: def.subject,
    dateLabel: def.dateLabel,
    preview: def.preview,
    bodyElements,
    metadataElements,
    apparentLinks,
    attachments,
    referenceClassification: def.referenceClassification,
    referenceExplanation: def.referenceExplanation,
    signals,
    learningObjective: def.learningObjective,
    practicalRecommendation: def.practicalRecommendation,
    institutionalVisuals: def.institutionalVisuals,
  };
}
