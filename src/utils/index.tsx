

export const getProfile= async (FrensHub: any, address: any) => {

    const user1Profile = await FrensHub.profileIDs(address);
    if(user1Profile == 0) return null;
    const [tokenID, handle, totalFrens ] = await FrensHub.getProfile(user1Profile);
    console.log(handle);
    return handle;
}

export const getFrens =async (FrensHub:any, address: any) => {
    
    const profile = await FrensHub.profileIDs(address);

    const totalFrens  = await FrensHub.totalFrens(profile)

    const frens = [];

    for(let i=0;i<totalFrens;i++) {
        const frenProfile =   await FrensHub.whoFren(profile, i);

        const [tokenID, handle, totalFrens ] = await FrensHub.getProfile(frenProfile);
        const status = await FrensHub.frenStatus(profile, frenProfile);

        const frenAddr = await FrensHub.ownerOf(tokenID);

        frens.push({
            handle,
            address: frenAddr,
            status
        })

    }
    return frens;

  

}

export const getGames = async (GameHub:any) => {
    
    const totalGame  = await GameHub.totalGames();
    const games = [];

    for(let i=0;i<totalGame;i++) {

        const [name, img, link ] = await GameHub.getGame(i);
    

        games.push({
            name,
            img,
            link
        })

    }

    console.log(games)
    return games;

  

}