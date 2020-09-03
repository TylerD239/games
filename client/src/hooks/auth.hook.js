import {useState, useCallback, useEffect} from 'react'
import {useHttp} from "./http.hook";

const storageName = 'userData'
export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)
    const [name, setName] = useState('')
    const {request} = useHttp()

    const login = useCallback((jwtToken, id, log) => {
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
        const checkToken = async () => {
            const data = JSON.parse(localStorage.getItem(storageName))
            if (data && data.token) {
                const res = await request('/api/checkToken', 'POST', {token: data.token})
                if (res.verify) login(data.token, data.userId, data.name)
                else logout()
            }
            setReady(true)
        }
        checkToken()

    }, [login, logout, request])

    return {login, logout, token, userId, ready, name}
}