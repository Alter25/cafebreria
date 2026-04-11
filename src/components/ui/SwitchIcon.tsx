import { Plus, Minus } from "lucide-react";

interface Props {
  isShowing: boolean;
  size?: number;
  className?: string;
}

export default function SwitchIcon({ isShowing, size, className }: Props) {
  return (isShowing ? <Minus size={size} className={`${className}`} /> : <Plus size={size} className={`${className}`} />)
}
