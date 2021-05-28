import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function CompleteOrder() {
    return <div style={{display: "flex", height: "100vh", width: "100%"}}>
        <Paper style={{minWidth: "20%", flexGrow: 2, height: "100%", margin: "10px", paddingLeft: "2%", paddingRight: "2%", paddingTop: "50px"}} variant="outlined">
            <Typography variant="h4">Your order</Typography>
            <CartItem/>
            <CartItem/>
            <Button color="primary" variant="contained" style={{width: "100%"}}>Add more items</Button>
            <Divider style={{marginBottom: "30px", marginTop: "30px"}}/>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body2" color="textSecondary">$X.XX</Typography>
            </div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body2">Discount</Typography>
                <Typography variant="body2" color="textSecondary">-$X.XX</Typography>
            </div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body2">Donation</Typography>
                <Typography variant="body2" color="textSecondary">$X.XX</Typography>
            </div>
            <Divider style={{marginBottom: "30px", marginTop: "30px"}}/>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1" color="textSecondary">$X.XX</Typography>
            </div>
        </Paper>
        <Paper style={{flexGrow: 8, height: "100%", margin: "10px", paddingLeft: "5%", paddingTop: "50px", paddingRight: "10%"}} variant="outlined">
            <Typography variant="h3">Complete Order</Typography>
            <Typography variant="h4">Contact</Typography>
            <form>
                {true && <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField id="first-name" label="First Name" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="last-name" label="Last Name" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="street-address" label="Street Address" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="postal-code" label="Postal Code" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="country" label="Country" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="phone" label="Phone" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="email" label="Email" variant="outlined" fullWidth/>
                        <FormControlLabel control={<Checkbox />} label="Email opt-in"/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="visit-source" label="How did you hear about us?" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="comments" label="Comments" variant="outlined" fullWidth multiline/>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" style={{width: "100%"}}>Back</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" style={{width: "100%"}}>Next</Button>
                    </Grid>
                </Grid>}
            </form>
        </Paper>
    </div>
}

function CartItem() {
    return <div style={{paddingBottom: "10px"}}>
        <Typography variant="body1" color="textPrimary">Event Name</Typography>
        <Typography variant="body2" color="textSecondary">Short description</Typography>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant="body2" color="textSecondary">Quantity: N</Typography>
            <Typography variant="body2" color="textSecondary">$X.XX</Typography>
        </div>
    </div>
}
