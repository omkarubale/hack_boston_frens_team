import { useEffect, useState } from "react";
import { useContract, useProvider, useSigner, useAccount } from "wagmi";
import GamePage from "../GamePage";


import Abi from '../../abis/FrensHub.json'
import ADDRESS from '../../abis/address.json';
import { getFrens, getProfile } from "../../utils";
import CreateProfile from "../CreateProfile";


export default function FrenTable() {

    const { data: signer, isError, isLoading } = useSigner()
    const { address, isConnecting, isDisconnected } = useAccount()

    const provider = useProvider();

    const [handle, setHandle] = useState<string | null>(null);
    const [frens, setFrens] = useState<any>([]);

    const [frenToAdd, setFrenToAdd] = useState("");

    const FrensHub = useContract({
        addressOrName: ADDRESS.FrensHubAddress,
        contractInterface: Abi.abi,
        signerOrProvider: signer,
    })

    const addFren = () => {
        if (!signer) return;
        if (!FrensHub) return;

        FrensHub
            .nftForHandle(frenToAdd)
            .then((tokenId: any) => {
                console.log(tokenId);
                return FrensHub.requestFrens(tokenId)
            })
            .then(console.log)
            .catch(console.error)
        
    }

    useEffect(() => {
        if (!signer) return;
        if (!FrensHub) return;

        getFrens(FrensHub, address)
            .then((f) => setFrens(f))
            .catch(console.error)

        getProfile(FrensHub, address)
            .then((hand) => setHandle(hand));


    }, [FrensHub, signer]);


    return (
        <div>
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8 flex flex-col gap-10">
                <header>
                    <div className="sm:justify-between sm:items-center sm:flex">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Welcome {handle},
                            </h1>
                        </div>
                    </div>
                </header>

                <div>
                        <label htmlFor="default-search" 
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" 
                                className="w-5 h-5 text-gray-500 dark:text-gray-400" 
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" 
                                stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="search" id="default-search" 
                            onChange={(e) => setFrenToAdd(e.target.value)}
                            value={frenToAdd}
                            className="block p-4 pl-10 w-full text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Search Frens" required />
                            <button type="button"
                            onClick={addFren}
                             className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Add Fren
                                </button>
                        </div>




                </div>

                <div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="p-4 font-medium text-left text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            Avatar
                                        </div>
                                    </th>
                                    <th className="p-4 font-medium text-left text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            Handle
                                        </div>
                                    </th>

                                    <th className="p-4 font-medium text-left text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            Address
                                        </div>
                                    </th>
                                    <th className="p-4 font-medium text-left text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            Status
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {frens.map((fren: any) => (
                                    <tr>
                                        <td className="sticky left-0 p-4 bg-white">
                                            <img className="w-10 h-10 rounded-full" src={`https://avatars.dicebear.com/api/avataaars/${address}.svg`} alt="Rounded avatar" />
                                        </td>
                                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                                            {fren.handle}
                                        </td>
                                        <td className="p-4 text-gray-700 whitespace-nowrap">{fren.address}</td>
                                        <td className="p-4 text-gray-700 whitespace-nowrap">
                                            <strong
                                                className="bg-red-100 text-red-700 px-3 py-1.5 rounded text-xs font-medium"
                                            >
                                                {fren.status == 2? "Accepted" : "Pending"}
                                            </strong>
                                        </td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}