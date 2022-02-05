import './App.css'
import { useState,useEffect } from 'react';

import { SocketContext, socket } from './context/SocketContext';
import { UserContext,AuthContext } from './context/context';
import Routes from './Routes';
import {Toaster} from 'react-hot-toast'
import { set } from 'firebase/database';
import { v4 as uuidv4 } from "uuid";


function App() {
  const [userID, setuserID] = useState('');
  const [auth, setAuth] = useState(false);
 useEffect(() => {
 setuserID(uuidv4())
 }, []);
const [code, setcode] = useState('');
  return (
    <SocketContext.Provider value = {socket}>
      <UserContext.Provider value={{userID,setuserID,code,setcode}}>
      <AuthContext.Provider value={{auth,setAuth}}>
      <Toaster position="top-right" reverseOrder={false}/>
        <Routes code={code} setcode={setcode}></Routes>
      </AuthContext.Provider>
      </UserContext.Provider>
    </SocketContext.Provider>
  )
}

export default App;
