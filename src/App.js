import './App.css'
import {
  BrowserRouter ,
  Routes as Router,
  Route,
} from 'react-router-dom'
import { SocketContext, socket } from './context/SocketContext';
import Home from './screens/Home/Home';
import Carousel from './screens/Rules/Rules';
import GenerateLink from './screens/Host/Link/GenerateLink';
import Lobby from './screens/Lobby/Lobby';
import Intro from './screens/Intro/Intro';
import Game from './screens/Game/Game';
import RevealScores from './screens/Host/RevealScores/RevealScores';
import SeeResults from './screens/Player/SeeResults/SeeResults';
import Scoreboard from './screens/Host/Scoreboard/Scoreboard';
import PlayerScoreboard from './screens/Player/Scoreboard/Scoreboard';
import Endgame from './screens/Endgame/Endgame';
import Waiting from './screens/Waiting/Waiting';


function App() {
  return (
    <SocketContext.Provider value = {socket}>
      <BrowserRouter>
      <Router>
      
          <Route path = '/' exact element = {<Home></Home>} />
          <Route path= '/game' exact element = {<Intro></Intro>} />
          <Route path= '/admin/link' exact element = {<GenerateLink></GenerateLink>} />
          <Route path= '/Rules' exact element = {<Carousel></Carousel>} />
          <Route path= '/lobby/:id' element = {<Lobby></Lobby>} />
          <Route path = '/waiting' element = {<Waiting></Waiting>} />
          <Route path = '/round/:id' element = {<Game></Game>} />
          <Route path = '/host/results/:id' element = {<RevealScores></RevealScores>} />
          <Route path = '/player/results/:id' element = {<SeeResults></SeeResults>} />
          <Route path = '/host/scores' element = {<Scoreboard></Scoreboard>} />
          <Route path = '/player/scores' element = {<PlayerScoreboard></PlayerScoreboard>} />
          <Route path = '/gameover' element = {<Endgame></Endgame>} />
      
      </Router>
      </BrowserRouter>
    </SocketContext.Provider>
  )
}

export default App;
