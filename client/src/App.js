import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthContext} from './context/AuthContext'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import NavBar from "./components/NavBar"
import {Loader} from "./components/Loader";
import {IoContext} from "./context/IoContext";

const io = require('socket.io-client')
const crossSocket = io.connect('/playCross')
const chessSocket = io.connect('/playChess')
const chatSocket = io.connect('/chat')



function App() {



    const {token, login, logout, userId, name, ready} = useAuth()
    const [page, setPage] = useState('login')
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    // console.log(isAuthenticated)

    if (!ready) {
        return <Loader />
    }

  return (
        <IoContext.Provider value={{chatSocket, chessSocket, crossSocket}}>
          <AuthContext.Provider value = {{token, login, logout, userId, isAuthenticated, name, page, setPage}}>
              <Router>
                  <NavBar />
                  <div className = "container">
                      {routes}
                  </div>
              </Router>
          </AuthContext.Provider>
        </IoContext.Provider>

  )
}

export default App;
