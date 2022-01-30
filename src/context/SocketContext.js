import io from "socket.io-client";
import React from "react";
export const socket = io("https://shielded-escarpment-35022.herokuapp.com/");
export const SocketContext = React.createContext();
