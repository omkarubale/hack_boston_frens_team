

export function FrensHubAddress(chain) {
    if(chain.id === 1001) {
        return "0x21f33E1dA335F3EF50CCc5e5016161152eeC5ea4"
    } else if(chain.id === 41) {
        return  "0x0439825eBBFac2Eb70695c051b7F2de2453a1990" //telos
    } else return "0x0439825eBBFac2Eb70695c051b7F2de2453a1990";
}
export function GameHubAddress(chain) {
   if(chain.id === 1001) { //klaytn
        return "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1"
    } else if(chain.id === 41) { //telos
        return  "0xD13Ec912Ce431414a33ceAfC8Ae419f7B7Ad5054"
    } else return "0xD13Ec912Ce431414a33ceAfC8Ae419f7B7Ad5054";

}
