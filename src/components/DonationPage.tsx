import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid  from '@material-ui/core/Grid';
import { selectDonation, setDonation } from '../features/cart/cartSlice'
import { appSelector } from '../app/hooks'
import { useAppDispatch } from "../app/hooks"
import { useState } from "react";
import InputAdornment  from "@material-ui/core/InputAdornment"


export default function DonationPage({onNext}: {onNext: () => any}) {
    const dispatch = useAppDispatch()
    const donation = appSelector(selectDonation)
    const [amount, setAmount] = useState(donation)
    return(
        <Grid container spacing={3} alignItems="flex-end">
            <Typography variant="h4">Please consider making a donation</Typography>
            <Grid item xs={9}>
                <TextField label="donation amount" 
                    onChange={e => setAmount(+e.target.value)} 
                    type="number" 
                    value={amount || undefined}
                    fullWidth
                    variant="outlined"
                    InputProps={{startAdornment: (<InputAdornment position="start">$</InputAdornment>)}}
                />
            </Grid>
            <Grid item xs={3}>
                <Button fullWidth color="primary" variant="contained" onClick={() => {dispatch(setDonation(amount)); onNext()}}>Confirm</Button>
            </Grid>
        </Grid>
    )
}
