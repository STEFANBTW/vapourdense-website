export type ProjectCategory = 'Graphic Design' | 'Web Design' | 'Brand Identity' | 'Editorial' | 'Other';

export interface ProcessPicture {
  id: string;
  url: string;
  caption?: string; // hover description
  type: 'AI' | 'Final'; // marked as Final or AI
}

export interface ProcessStep {
  id: string;
  name: string; // process step name
  description: string; // process step description
  pictures: ProcessPicture[]; // pictures belonging to this step
}

export interface GalleryPicture {
  id: string;
  url: string;
  caption?: string;
  isAI?: boolean; // filtered with moving purple gradient
}

export type ClientRemarkType = 'comment' | 'voice' | 'picture' | 'none';

export interface ClientRemark {
  type: ClientRemarkType;
  comment?: string;
  clientAuthor?: string;
  clientAvatar?: string;
  // Voice note fields
  voiceDuration?: string;
  voiceAudioUrl?: string;
  voiceDate?: string;
  // Picture remark fields
  pictureUrl?: string;
  pictureCaption?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  client: string;
  clientDescription?: string; // description of the client
  shortDescription?: string; // short description of the project
  fullDescription?: string;
  threeWordDesc?: string; // Designer's Remark
  descriptors?: string;
  isRealLife?: boolean;
  price: string;
  currency?: string;
  duration?: string;
  monthYear?: string; // e.g. "October 2026"
  description: string;
  images: string[];
  imageUrl?: string;
  imageScalePercent?: number;
  galleryPictures?: GalleryPicture[];
  processSteps?: ProcessStep[];
  clientRemark?: ClientRemark;
  videos?: string[];
  year: string;
  deliverables?: string[];
  tags?: string[];
  metrics?: string;
  featured?: boolean;
  createdAt: number;
  updatedAt?: number;
}

export type FilterCategory = 'All' | ProjectCategory;

