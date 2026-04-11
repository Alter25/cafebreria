import SwitchIcon from "./SwitchIcon";
import ImagePlaceHolder from "./ImagePlaceHolder";
import Switch from "./Switch";

import { useState } from "react";
interface Props {
  title: string;
  description: string;
  price?: number;
}

export default function DisplayCard({ title = "Cafe con leche", description = "contenido", price = 45 }: Props) {

  const [showContent, setShowContent] = useState(true);

  return <div className="bg-amber-smoke min-w-[80%] px-4 py-1 mx-4 border font-serif font-semibold rounded-xl">
    <div className="flex min-h-12 items-center">
      <div className="mx-2 basis-1/2">
        <h1 className='text-xl font-semibold tracking-wider capitalize'>{title}</h1>
      </div>
      {!showContent && <div>$<span className="text-lg">{price}</span> Mxn.</div>

      }
      <div className="mx-8 flex items-center">
        <span>Activo:</span>
        <span className="">
          <Switch />
        </span>
      </div>
      <div className="ml-auto">
        <button onClick={() => setShowContent(!showContent)}><SwitchIcon size={20} className="border rounded-full p-1" isShowing={showContent} /></button>
      </div>
    </div>
    {showContent &&
      <div className="min-h-8 p-2 border-t flex">
        <div className="flex-1 ml-2 flex flex-col">
          <div className="italic flex-1">{description}</div>
          <div className="mb-4">$<span className="text-lg">{price}</span> Mxn.</div>
        </div>
        <ImagePlaceHolder className="w-40 h-40" />
      </div>
    }
  </div>
}