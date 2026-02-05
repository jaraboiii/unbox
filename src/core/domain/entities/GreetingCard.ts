export interface GreetingCard {
  id: string;
  senderName: string;
  receiverName: string;
  templateId: string;
  customMessage?: string;
  passcode?: string;
  passcodeHint?: string;
  passcodeMessage?: string;
  youtubeUrl?: string;
  images: string[];
  eventImages?: string[];
  imageCaptions?: string[];
  eventDescriptions?: string[];
  createdAt: Date;
  viewCount: number;
  isPublic: boolean;
}

export type CreateCardInput = Omit<GreetingCard, 'id' | 'createdAt' | 'viewCount'>;
