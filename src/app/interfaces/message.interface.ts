export interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    message: string;
    errors: string[];
  }
  audioUrl?: string;
  imageInfo?: any;
}

