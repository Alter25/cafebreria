import { cn } from "../../lib/utils";
interface Props {
  className: string;
}

export default function ImagePlaceHolder({ className }: Props) {
  return <div className={cn(`border rounded-xl`, className)}></div>
}