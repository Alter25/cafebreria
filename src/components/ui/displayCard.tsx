import SwitchIcon from "./SwitchIcon";

import { useState } from "react";
interface Props {
  title: string;
  content: string;
}

export default function DisplayCard({ title = "titulo", content = "contenido" }: Props) {

  const [showContent, setShowContent] = useState(false);

  return <div className="bg-amber-smoke min-w-120 px-2 py-1 mx-4 border rounded-xl">
    <div className="flex">
      <h1 className='flex-1'>{title}</h1>
      <button onClick={() => setShowContent(!showContent)}><SwitchIcon size={20} className="border rounded-full p-1" isShowing={showContent} /></button>
    </div>
    {showContent &&
      <div className="min-h-8 p-2 border-t">
        <div>
          {content}
        </div>
      </div>
    }
  </div>
}