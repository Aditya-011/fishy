import './App.css';
import {useState} from 'react'
import {database} from './firebase.js'
import { ref, set } from "firebase/database";

function App() {
  const [name , setName] = useState();
  const [age , setAge] = useState();
      
  // Push Function
  function Push() {
    set(ref(database, 'users'), {
      name,
      age
    });
  }
  
  return (
    <div className="App" style={{marginTop : 250}}>
    <center>
    <input placeholder="Enter your name" value={name} 
    onChange={(e) => setName(e.target.value)}/>
    <br/><br/>
    <input placeholder="Enter your age" value={age} 
    onChange={(e) => setAge(e.target.value)}/>
    <br/><br/> 
    <button onClick={Push}>PUSH</button>
    </center>
  </div>
  );
}

export default App;
