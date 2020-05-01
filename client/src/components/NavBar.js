import React, {useContext} from "react"
import {NavLink} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext"

function NavBar() {
const {logout, isAuthenticated, setPage} = useContext(AuthContext)

    return (

        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <a className="navbar-brand">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    {isAuthenticated ?
                    <>
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/play">Play</NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/chat">Chat</NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/info">Info</NavLink>
                            </li>

                        </ul>

                        <NavLink className="btn btn-outline-success my-2 my-sm-0" onClick={logout} to="/login" >Выйти</NavLink>
                    </>
                    :
                        <div>
                            <button className="btn btn-outline-success my-2 my-sm-0 mr-2" onClick={()=>{setPage('login')}}>Войти</button>
                            <button className="btn btn-outline-success my-2 my-sm-0"  onClick={()=>{setPage('register')}}>Регистрация</button>
                        </div>
                        }
                </div>
        </nav>
    )
}

export default NavBar


