import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {InfoPage} from './pages/InfoPage'
import {PlayPage} from './pages/PlayPage'
import {AuthPage} from './pages/AuthPage'
import {ChatPage} from "./pages/ChatPage"
// import {CrossPage} from "./pages/CrossPage"
import {ChessPage} from "./pages/ChessPage"
// import {PlayChess} from "./pages/PlayChess"

export const useRoutes = isAuthenicated => {

    if (isAuthenicated) {
        return (
            <Switch>
                <Route path="/playCross" exact>
                    <PlayPage type={'cross'}/>
                </Route>
                <Route path="/playChess" exact>
                    <PlayPage type={'chess'}/>
                </Route>
                <Route path="/info" exact>
                    <InfoPage />
                </Route>
                <Route path="/chat" exact>
                    <ChatPage />
                </Route>
                {/*<Route path = "/cross/:id">*/}
                {/*    <CrossPage />*/}
                {/*</Route>*/}
                <Route path = "/chess/:id">
                    <ChessPage />
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