import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {InfoPage} from './pages/InfoPage'
import {PlayPage} from './pages/PlayPage'
import {AuthPage} from './pages/AuthPage'
import {ChatPage} from "./pages/ChatPage"
import {ChessPage} from "./pages/ChessPage"
import {SpectatePage} from "./pages/SpectatePage";


export const useRoutes = isAuthenticated => {

    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/playChess" exact>
                    <PlayPage/>
                </Route>
                <Route path="/info" exact>
                    <InfoPage />
                </Route>
                <Route path="/chat" exact>
                    <ChatPage />
                </Route>
                <Route path = "/chess/:id">
                    <ChessPage />
                </Route>
                <Route path = "/spectateChess/:id">
                    <SpectatePage />
                </Route>
                <Redirect to="/playChess" />
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