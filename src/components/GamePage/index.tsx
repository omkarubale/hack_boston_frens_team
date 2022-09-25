import { useState } from "react";
import { useNetwork } from "wagmi";


export default function GamePage({ name, imageUri, link }: {name: any, imageUri:any, link:any}) {

    const {chain} = useNetwork();
    const [reputation, setReputation] = useState("")

    return (
        <a
  href="#"
  className="block overflow-hidden border border-gray-100 rounded-lg shadow-sm"
>
  <img
    alt="Office"
    src={imageUri}
    className="object-cover w-full h-56"
  />

  <div className="p-6">
    <h5 className="text-xl font-bold">
      {name}
    </h5>

    <p className="mt-2 text-sm text-gray-500">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
    {chain?.id === 97 ? <p></p>: <></>}
    <p></p>
    <div
      className="inline-block pb-1 mt-4 font-medium text-blue-600 border-b border-blue-500"
    >
        <a href={link}>Play</a>
        <span aria-hidden="true">&rarr;</span>
    </div>
  </div>
</a>

    );
}