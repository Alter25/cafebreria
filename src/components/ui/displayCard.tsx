import type { Product } from "../../types/types";
import SwitchIcon from "./SwitchIcon";
import ImagePlaceHolder from "./ImagePlaceHolder";
import Switch from "./Switch";

import { useState } from "react";
interface Props {
  product: Product;
}

export default function DisplayCard({ product }: Props) {

  const [showContent, setShowContent] = useState(true);

  return <div className="bg-amber-smoke min-w-[80%] px-4 py-1 mx-4 my-1 border font-serif font-semibold rounded-xl">
    <div className="flex min-h-12 items-center">
      <div className="mx-2 basis-1/2">
        <h1 className='text-xl font-semibold tracking-wider capitalize'>{product.name}</h1>
      </div>
      {!showContent && <div>$<span className="text-lg">{product.price}</span> Mxn.</div>

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
      <div className="min-h-8 p-2 border-t flex justify-between">
        <div className="basis-2/3 ml-2 flex flex-col">
          <div className="italic flex-1">{product.description}</div>
          <div className="mb-4">$<span className="text-lg">{product.price}</span> Mxn.</div>
        </div>
        <div className="flex justify-end">
          <ImagePlaceHolder className="rounded-xl w-40 h-30" >
            {
              product.img_url &&
              <img src={product.img_url} alt="image" className="object-cover w-fit h-full rounded-xl border" />
            }
          </ImagePlaceHolder>
        </div>
      </div>
    }
  </div>
}