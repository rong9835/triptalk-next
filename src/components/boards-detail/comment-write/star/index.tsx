import { Rate } from 'antd';

interface StarProps {
  rating: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export default function Star({ rating, onChange, disabled = false }: StarProps) {
  return <Rate onChange={onChange} value={rating} disabled={disabled} />;
}
