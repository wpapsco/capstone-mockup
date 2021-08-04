import {Button} from "@material-ui/core";
import {Form} from "react-final-form";
import {TextField} from "mui-rff";
import {useHistory} from "react-router";
import {useAppDispatch} from "../app/hooks";
import {openSnackbar} from "../features/snackbarSlice";

export default function ChangePassword() {

    const history = useHistory()
    const dispatch = useAppDispatch()

    const onLogout = async () => {
        await fetch('/logout', {credentials: "include"})
        dispatch(openSnackbar("Password changed"))
        history.push("/")
    }

    const onSubmit = async (formInfo: any) => {
        console.log(formInfo)
        const res = await fetch('/api/passwordChange', {
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify(formInfo)
        });
        if (res.ok) {
            await onLogout()
        }
    }

    return <>
        <Form
            onSubmit={onSubmit}
            render={({handleSubmit}) => <>
                <TextField name="username" label="username" variant="outlined"/>
                <TextField name="password" label="password" variant="outlined"/>
                <TextField name="newPassword" label="new password" variant="outlined"/>
                <TextField name="passwordConfirm" label="confirm new password" variant="outlined"/>
                <Button type="submit" onClick={handleSubmit} color="primary" variant="contained">Go</Button>
            </>} />
    </>
}
