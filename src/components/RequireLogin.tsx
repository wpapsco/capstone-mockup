import {ReactNode, useEffect, useState} from "react";
import {Redirect} from "react-router";

type RequireLoginProps = {
    children: ReactNode
    redirectTo?: string
}

const RequireLogin = ({children, redirectTo}: RequireLoginProps) => {
    const [queried, setQueried] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        if (queried) return;
        fetch('/api/user', {
            credentials: "include",
            method: "GET"
        }).then(result => {
            setAuthenticated(result.status === 200);
            setQueried(true)
        }).catch(console.error)

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
