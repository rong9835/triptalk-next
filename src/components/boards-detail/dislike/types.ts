export interface DislikeProps {
  boardId: string;
  initialDislikeCount?: number;
  initialIsDisliked?: boolean;
  onDislikeChange?: (isDisliked: boolean) => void;
}
