import {ReactNode, useEffect, useState} from "react";
import {Redirect} from "react-router";
import {useAppDispatch} from "../app/hooks";
import {setUser} from "../features/admin/userSlice";

type RequireLoginProps = {
    children: ReactNode
    redirectTo?: string
}

const RequireLogin = ({children, redirectTo}: RequireLoginProps) => {
    const [queried, setQueried] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    const dispatch = useAppDispatch()

    const getUser = async () => {
        if (queried) return;
        const result = await fetch('/api/user', {
            credentials: "include",
            method: "GET"
        })
        if (result.ok) {
            const user = await result.json()
            dispatch(setUser(user))
            console.log('getting user required')
        }
        setAuthenticated(result.status === 200);
        setQueried(true)
   }

    useEffect(() => {
        getUser()
        return () => {
            setQueried(false)
            setAuthenticated(false)
        }
   }, [])

    return <>
        {queried && authenticated && children}
        {queried && !authenticated && <Redirect to={`/login${redirectTo ? redirectTo : ""}`}/>}
    </>
}

export default RequireLogin;
