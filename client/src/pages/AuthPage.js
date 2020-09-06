import React, {useContext, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext"

export const AuthPage = () => {
    const {request} = useHttp()
    const {login, page, setPage} = useContext(AuthContext)
    const [form, setForm] = useState({
        login: '', password:''
    })


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const loginHandler = async (event) => {
        event.preventDefault()
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            // console.log(data)
            login(data.token, data.userId, data.name)
        } catch (e) {}
    }

    const registerHandler = async (event) => {
        event.preventDefault()
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            console.log(data.message)
            if (data.message === 'user created') setPage('login')
        } catch (e) {
            console.log(e.message)
        }
    }

    if (page === 'register') {
        return (
            <div className="text-center">
                <form className="form-signin">
                    <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                    <label htmlFor="inputLogin" className="sr-only">Логин</label>
                    <input
                        type="text"
                        id="inputLogin"
                        className="form-control"
                        placeholder="Логин"
                        onChange={changeHandler}
                        name="login"
                        autoFocus=""/>
                    <label htmlFor="inputPassword" className="sr-only">Пароль</label>
                    <input
                        type="password"
                        id="inputPassword"
                        className="form-control"
                        placeholder="Пароль"
                        name="password"
                        onChange={changeHandler}
                    />
                    <button
                        type="button"
                        className="btn btn-lg btn-outline-success btn-block"
                        onClick={registerHandler}
                    >Отправить
                    </button>
                </form>
            </div>
        )
    }

    if (page === 'login') {
        return (
            <div className="text-center">
                <form className="form-signin">
                    <h1 className="h3 mb-3 font-weight-normal">Вход</h1>
                    <label htmlFor="inputLogin" className="sr-only">Логин</label>
                    <input
                        type="text"
                        id="inputLogin"
                        className="form-control"
                        placeholder="Логин"
                        autoFocus=""
                        name="login"
                        onChange = {changeHandler}
                    />
                    <label htmlFor="inputPassword" className="sr-only">Пароль</label>
                    <input
                        type="password"
                        id="inputPassword"
                        className="form-control"
                        placeholder="Пароль"
                        name="password"
                        onChange = {changeHandler}
                    />
                    <button
                        type="button"
                        className="btn btn-lg btn-outline-success btn-block"
                        onClick={loginHandler}
                    >Войти</button>
                </form>
            </div>
        )
    }
}