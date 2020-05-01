import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)
    const [name, setName] = useState('')

    const login = useCallback((jwtToken,id, log) => {
        setToken(jwtToken)
        setUserId(id)
        setName(log)
        localStorage.setItem(storageName, JSON.stringify({userId :id,token:jwtToken, name: log}))
    },[])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    },[] )

    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.userId, data.name)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, ready, name}
}