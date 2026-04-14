import { cn } from "../../lib/utils";
interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function ImagePlaceHolder({ className, children }: Props) {
  return <div className={cn(`rounded-xl`, className)}>{children}</div>
}