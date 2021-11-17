import { ClientInfo } from "@kosy/kosy-app-api/types";
import { getRandomName } from "./getRandomName"

const findUnclaimedSeatNumber = (clients: ClientInfo []) => {
    //Creates a "first element start at 1" array where each index represents an occupied seat
    let seatIsOccupied = clients.reduce((seatIsOccupied, client) => {
        seatIsOccupied[client.seatNumber] = true;
        return seatIsOccupied;
    }, new Array(999));

    //Goes through the table's seat numbers and tries to find an unclaimed one
    for (let seatNumber = 0; seatNumber <= 999; seatNumber++) {
        if (!seatIsOccupied[seatNumber]) {
            return seatNumber;
        }
    }
    
    //If no seat was found, throw an exception?
    throw "No more available unclaimed seats...";
}

//Generates a somewhat random client that is seated at the table
export function generateClientInfo (clients: ClientInfo []): ClientInfo {
    let clientId = Date.now().toString();
    return {
        clientUuid: clientId,
        clientName: getRandomName(),
        seatNumber: findUnclaimedSeatNumber(clients)
    }
}