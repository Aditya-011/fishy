import './App.css'
import { useState } from 'react';

import { SocketContext, socket } from './context/SocketContext';
import { UserContext } from './context/context';
import Routes from './Routes';
import {Toaster} from 'react-hot-toast'
import { set } from 'firebase/database';
import { v4 as uuidv4 } from "uuid";


function App() {
 const userID = uuidv4()
  console.log(userID);
const [code, setcode] = useState('');
  return (
    <SocketContext.Provider value = {socket}>
      <UserContext.Provider value={userID}>
       <Toaster position="top-right" reverseOrder={false}/>
    <Routes code={code} setcode={setcode}></Routes>
      </UserContext.Provider>
    </SocketContext.Provider>
  )
}

export default App;
