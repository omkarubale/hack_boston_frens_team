import ethers from "ethers";
import React, { useState } from "react";
import { useProvider, useSigner, useContract, useNetwork } from "wagmi";

import Abi from '../../abis/FrensHub.json'
import {FrensHubAddress}  from '../../abis/address';

export default function CreateProfile({ }) {


    const { data: signer, isError, isLoading } = useSigner()
    const provider = useProvider();

    const { chain } = useNetwork();


    const [handle, setHandle] = useState("");

    const FrensHub = useContract({
        addressOrName: FrensHubAddress(chain),
        contractInterface: Abi.abi,
        signerOrProvider: signer,
    })


    const handleClaim = (e:any) => {
        FrensHub
            .createProfile(handle)
            .then(console.log)
            .catch(console.error);
    }

    return (
        <div>
            <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
                        Create your Frens profile today
                    </h1>

                    <form action="" className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
                        <p className="text-lg font-medium"></p>

                        <div>
                            <label htmlFor="email" className="text-sm font-medium">Handle</label>

                            <div className="relative mt-1">
                                <input
                                    type="text"
                                    id="text"
                                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    placeholder="Enter Handle"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClaim}
                            className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                        >
                            Claim Handle
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
}