import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {InfoPage} from './pages/InfoPage'
import {PlayPage} from './pages/PlayPage'
import {AuthPage} from './pages/AuthPage'
import {ChatPage} from "./pages/ChatPage"
import {CrossPage} from "./pages/CrossPage"

export const useRoutes = isAuthenicated => {

    if (isAuthenicated) {
        return (
            <Switch>
                <Route path="/play" exact>
                    <PlayPage />
                </Route>
                <Route path="/info" exact>
                    <InfoPage />
                </Route>
                <Route path="/chat" exact>
                    <ChatPage />
                </Route>
                <Route path = "/cross/:id">
                    <CrossPage />
                </Route>
                <Redirect to="/play" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/"/>
        </Switch>
    )
}