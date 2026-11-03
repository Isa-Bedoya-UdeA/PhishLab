export type MessageClassification =
  | 'legitimate'
  | 'phishing'
  | 'insufficient_information';

export type SignalCategory =
  | 'linguistic'
  | 'visual'
  | 'contextual';

export type EmailElementType =
  | 'word'
  | 'sender_name'
  | 'sender_address'
  | 'domain'
  | 'subject'
  | 'link'
  | 'attachment'
  | 'visual_element';

export interface EmailElement {
  id: string;
  text: string;
  type: EmailElementType;
  category?: SignalCategory;
  subcategory?: string;
  isRelevantClue: boolean;
  explanation?: string;
  /**
   * Optional prefix or suffix punctuation that should be rendered alongside the word
   * without being part of the selectable element itself (or clean formatting).
   */
  trailingSpace?: boolean;
  newlineAfter?: boolean;
  paragraphBreakAfter?: boolean;
}

export interface ApparentLink {
  id: string;
  label: string;
  displayedUrl: string;
  elementId: string;
  category?: SignalCategory;
  subcategory?: string;
  isRelevantClue?: boolean;
  explanation?: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  elementId: string;
  fileSize?: string;
  fileType?: string;
  category?: SignalCategory;
  subcategory?: string;
  isRelevantClue?: boolean;
  explanation?: string;
}

export interface ExerciseSignal {
  elementIds: string[];
  category: SignalCategory;
  explanation: string;
  title: string;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  senderName: string;
  senderAddress: string;
  domain: string;
  subject: string;
  dateLabel: string;
  preview: string;
  bodyElements: EmailElement[];
  metadataElements: EmailElement[];
  apparentLinks: ApparentLink[];
  attachments: EmailAttachment[];
  referenceClassification: MessageClassification;
  referenceExplanation: string;
  signals: ExerciseSignal[];
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
