import {Button, TextField} from "@material-ui/core";
import {useState} from "react";
import {Redirect, useParams} from "react-router";
import {useAppDispatch} from "../app/hooks";
import {openSnackbar} from "../features/snackbarSlice";

export default function LoginPage() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loggedIn, setLoggedIn] = useState(false);
    const { redirect } = useParams<{redirect: string}>()
    const dispatch = useAppDispatch()

    const onSubmit = async () => {
        const result = await fetch('/api/login', {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (result.status === 200) {
            setLoggedIn(true);
            dispatch(openSnackbar("Successfully logged in!"))
        } else {
            dispatch(openSnackbar("Please try again"))
        }
    }

    return <div>
        <TextField
            label="username"
            variant="outlined"
            onChange={e => setUsername(e.target.value)} />
        <TextField
            label="password"
            variant="outlined"
            onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" onClick={onSubmit}>Log in</Button>
        {loggedIn && <Redirect to={"/" + (redirect ? redirect : "")}/>}
        {redirect}
    </div>
}
