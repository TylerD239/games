import React, {useContext} from "react"
import {NavLink} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext"

function NavBar() {
const {logout, isAuthenticated, setPage} = useContext(AuthContext)

    return (

        <nav className="navbar navbar-light navbar-expand-sm bg-light">
            <span className="navbar-brand">CHESS</span>
            <button className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">

                    {isAuthenticated ?
                    <>
                        <ul className="navbar-nav mr-auto">

                            {/*<li className="nav-item dropdown">*/}
                            {/*    <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button"*/}
                            {/*       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">*/}
                            {/*        Play*/}
                            {/*    </span>*/}
                            {/*    <div className="dropdown-menu" aria-labelledby="navbarDropdown">*/}
                            {/*        <NavLink className="dropdown-item" to="/playChess">chess</NavLink>*/}
                            {/*        <NavLink className="dropdown-item" to="/playCross">cross</NavLink>*/}
                            {/*    </div>*/}
                            {/*</li>*/}
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/playChess">Play</NavLink>
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


