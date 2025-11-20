export interface StayWriteHeaderProps {
  title?: string;
  subtitle?: string;
  tags?: string[];
  bookmarkCount?: number;
  onDelete?: () => void;
  onLink?: () => void;
  onLocation?: () => void;
  onBookmark?: () => void;
}
