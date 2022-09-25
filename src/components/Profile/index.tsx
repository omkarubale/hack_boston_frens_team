import { useEffect, useState } from "react";
import { useContract, useProvider, useSigner, useAccount } from "wagmi";
import GamePage from "../GamePage";


import Abi from '../../abis/FrensHub.json'
import ADDRESS from '../../abis/address.json';
import { getProfile } from "../../utils";
import CreateProfile from "../CreateProfile";
import FrenTable from "../FrenTable";


export default function HomePage() {


    const { data: signer, isError, isLoading } = useSigner()
    const { address, isConnecting, isDisconnected } = useAccount()

    const provider = useProvider();

    const [handle, setHandle] = useState<string | null>(null);

    const FrensHub = useContract({
        addressOrName: ADDRESS.FrensHubAddress,
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