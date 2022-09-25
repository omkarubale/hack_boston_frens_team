import { useEffect, useState } from "react";
import { useContract, useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import GamePage from "../GamePage";


import Abi from '../../abis/FrensHub.json'
import {FrensHubAddress} from '../../abis/address';
import { getProfile } from "../../utils";
import CreateProfile from "../CreateProfile";
import FrenTable from "../FrenTable";


export default function HomePage() {


    const { data: signer, isError, isLoading } = useSigner()
    const { address, isConnecting, isDisconnected } = useAccount()
    
    const { chain } = useNetwork();

    const provider = useProvider();

    const [handle, setHandle] = useState<string | null>(null);

    const FrensHub = useContract({
        addressOrName: FrensHubAddress(chain),
        contractInterface: Abi.abi,
        signerOrProvider: signer,
    })

    useEffect(() => {
        if (!signer) return;
        if (!FrensHub) return;
        console.log(address);
        getProfile(FrensHub, address)
            .then((hand) => setHandle(hand));
        
        
    }, [FrensHub, signer])

    if (!handle) {
        return <CreateProfile />
    } else {
        return (
            <FrenTable />
        )
    }

}