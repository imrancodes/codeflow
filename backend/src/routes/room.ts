    import express from "express";
    import { handleCreateRoom, handleJoinRoom } from "../controller/room";

    const roomRoute = express.Router();

    roomRoute.post('/createroom', handleCreateRoom)
    roomRoute.post('/joinroom', handleJoinRoom)

    export default roomRoute;
