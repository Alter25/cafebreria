import SwitchIcon from "./SwitchIcon";
import ImagePlaceHolder from "./ImagePlaceHolder";

import { useState } from "react";
interface Props {
  title: string;
  content: string;
  grupo?: string;
}

export default function DisplayCard({ title = "titulo", content = "contenido", grupo = "pan" }: Props) {

  const [showContent, setShowContent] = useState(true);

  return <div className="bg-amber-smoke min-w-[80%] px-2 py-1 mx-4 border rounded-xl">
    <div className="flex min-h-12 items-center">
      <h1 className='flex-1 ml-2'>{title}</h1>
      <button onClick={() => setShowContent(!showContent)}><SwitchIcon size={20} className="border rounded-full p-1" isShowing={showContent} /></button>
    </div>
    {showContent &&
      <div className="min-h-8 p-2 border-t flex">
        <div className="flex-1 ml-2">
          <div className="my-2">Nombre: <span>{grupo}</span></div>
          {content}
        </div>
        <ImagePlaceHolder size={40} />
      </div>
    }
  </div>
}