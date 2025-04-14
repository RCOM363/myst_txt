import { Message } from "@/model/user.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  checkProfanity?: boolean;
  messages?: Array<Message>;
  questions?: string;
  totalPages?: number;
  currentPage?: number;
  totalViews?: number;
  totalMessages?: number;
}
