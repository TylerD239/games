import React, {useContext} from "react"
import {NavLink} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext"

function NavBar() {
const {logout, isAuthenticated, setPage} = useContext(AuthContext)

    return (

        <nav className="navbar navbar-dark navbar-expand-sm bg-dark">
            <NavLink to="playChess">
                <span className="navbar-brand">CHESS v1.10</span>
            </NavLink>
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
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/playChess">Играть</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/chat">Чат</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/info">Мои игры</NavLink>
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


