import { Building, Floor, Table, Room, ClientInfo } from './lib/kosyclient';
import { listOfRandomNames } from './lib/listOfRandomNames';

const defaultBuilding: Building = {
    buildingKey: "TestBuilding",
    buildingName: "TestBuilding"
}

const defaultFloor: Floor = {
    floorUuid: "TestFloor",
    floorName: "TestFloor"
}

const defaultTable: Table = {
    tableUuid: "TestTable",
    tableName: "TestTable",
    numberOfSeats: 999
}

const defaultRoom: Room = {
    roomUuid: "TestRoom",
    roomName: "TestRoom"
}

const findUnclaimedSeatNumber = (table: Table, clients: ClientInfo []) => {
    //Creates a "first element start at 1" array where each index represents an occupied seat
    let seatIsOccupied = clients.reduce((seatIsOccupied, client) => {
        //If the client is seated at a table
        switch (client.clientLocation.type) {
            case "seated-at-table":
                //Sets the seat as "occupied"
                seatIsOccupied[client.clientLocation.seatNumber] = true;
                break;
            default:
                break;
        }
        return seatIsOccupied;
    }, new Array(++table.numberOfSeats));

    //Goes through the table's seat numbers and tries to find an unclaimed one
    for (let seatNumber = 1; seatNumber <= table.numberOfSeats; seatNumber++) {
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
    let seatNumber = findUnclaimedSeatNumber(defaultTable, clients);
    return {
        clientUuid: clientId,
        clientName: listOfRandomNames[seatNumber -1 ],
        clientLocation: {
            type: "seated-at-table",
            building: defaultBuilding,
            floor: defaultFloor,
            room: defaultRoom,
            table: defaultTable,
            seatNumber: seatNumber
        }
    }
}