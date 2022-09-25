import { useEffect, useState } from "react";
import { useContract, useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import GamePage from "../GamePage";


import Abi from '../../abis/GameHub.json'
import {GameHubAddress} from '../../abis/address';
import { getFrens, getGames, getProfile } from "../../utils";
import CreateProfile from "../CreateProfile";


export default function HomePage() {


    const { data: signer, isError, isLoading } = useSigner()
    const { address, isConnecting, isDisconnected } = useAccount()

    const {chain} = useNetwork();

    const [games, setGames] = useState<any>([]);

    const GameHub = useContract({
        addressOrName: GameHubAddress(chain),
        contractInterface: Abi.abi,
        signerOrProvider: signer,
    })


    useEffect(() => {
        if (!signer) return;
        if (!GameHub) return;
        console.log(GameHub.address)
        getGames(GameHub)
            .then((f) => setGames(f))
            .catch(console.error)

    }, [GameHub, signer]);



    const someGames = [
        {
            name:"Age of Zen",
            link: "https://aoz.world/",
            img:"https://klaytn.foundation/wp-content/uploads/age-of-zen-aoz.png"
        },
        {
            name:"A3 Still Alive",
            link: "https://a3global.netmarble.com/en/update/2209",
            img:"https://sgimage.netmarble.com/images/netmarble/survivalgb/20210415/rkbz1618463338624.jpg   "
        },{
            name:"Ni No Kuni Cross Worlds",
            link: "https://aoz.world/",
            img:" https://cdn.mmoculture.com/mmo-images/2021/06/Ni-no-Kuni-Cross-Worlds-image.png"
        },
        {
            name:"Crypto Golf Impact",
            link: "https://aoz.world/",
            img:" https://gamingonphone.com/wp-content/uploads/2022/04/Crypto-Golf-Impact-1.jpg"
        },
    ];



    return (
        <div>
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8 flex flex-col gap-10">
                <header>

                    <div className="sm:justify-between sm:items-center sm:flex">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Dicover Games!
                            </h1>
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-3 gap-4">
                    {games.map((game: any) => (
                        <GamePage  name={game.name} link={game.link} imageUri={game.img}/>
                    ))}
                    {someGames.map((game: any) => (
                        <GamePage  name={game.name} link={game.link} imageUri={game.img}/>
                    ))}

                </div>

            </div>







        </div>
    );
}