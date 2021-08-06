import {Button, Grid, Typography, Paper, makeStyles} from "@material-ui/core";
import {FormApi} from "final-form";
import {TextField} from "mui-rff"
import {useState} from "react";
import {Form} from "react-final-form";
import {Redirect, useParams} from "react-router";
import {useAppDispatch} from "../app/hooks";
import {openSnackbar} from "../features/snackbarSlice";

const useStyles = makeStyles(({
    loginPaper: {
        margin:"auto",
        padding: "15px",
        maxWidth: "25em",
    },
    loginText: {textAlign: "center"}
}))

export default function LoginPage() {

    const [loggedIn, setLoggedIn] = useState(false);
    const { redirect } = useParams<{redirect: string}>()
    const dispatch = useAppDispatch()
    const classes = useStyles()
    
    type LoginData = {username: string, password: string}
    const onSubmit = async (data: LoginData, form: FormApi<LoginData>) => {
        const result = await fetch('/api/login', {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        form.change("password", "")

        if (result.status === 200) {
            setLoggedIn(true);
            dispatch(openSnackbar("Successfully logged in!"))
        } else {
            dispatch(openSnackbar("Please try again"))
        }
    }

    return <form onSubmit={e => e.preventDefault()}>
        <Paper variant="outlined" className={classes.loginPaper}>
            <Typography gutterBottom variant="h3" className={classes.loginText}>Please Log In</Typography>
            <Form 
                onSubmit={onSubmit}
                render={({handleSubmit, valid}) => {
                    return (<Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                autoFocus
                                fieldProps={{validate: (s: string) => s ? undefined : "Username required"}}
                                label="username"
                                variant="outlined"
                                name="username" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                fieldProps={{validate: (s: string) => s ? undefined : "Password required"}}
                                label="password"
                                variant="outlined"
                                type="password"
                                name="password" />
                        </Grid>
                        <Grid item xs={12}>
                            <Button disabled={!valid} variant="contained" fullWidth color="primary" type="submit" onClick={handleSubmit}>Log in</Button>
                        </Grid>
                    </Grid>
                )}}
            />
            {loggedIn && <Redirect to={"/" + (redirect ? redirect : "")}/>}
        </Paper>
    </form>
}
