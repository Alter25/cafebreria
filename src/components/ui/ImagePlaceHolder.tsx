
interface Props {
  size: number;
}

export default function ImagePlaceHolder({ size }: Props) {
  return <div className={`w-${size} h-${size} border rounded-xl`}></div>
}