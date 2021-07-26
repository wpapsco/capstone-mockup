import {Button, TextField, Grid, Typography, Paper} from "@material-ui/core";
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

    return <form onSubmit={e => e.preventDefault()}>
        <Paper variant="outlined" style={{width: "50%", margin:"auto", padding: "15px"}}>
            <Typography gutterBottom variant="h3" style={{textAlign: "center"}}>Please Log In</Typography>
            <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="username"
                        variant="outlined"
                        onChange={e => setUsername(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="password"
                        variant="outlined"
                        type="password"
                        onChange={e => setPassword(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" fullWidth color="primary" type="submit" onClick={onSubmit}>Log in</Button>
                </Grid>
            {loggedIn && <Redirect to={"/" + (redirect ? redirect : "")}/>}
            </Grid>
        </Paper>
    </form>
}
