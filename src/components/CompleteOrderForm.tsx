import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { TextField, Checkboxes } from 'mui-rff';
import Grid  from '@material-ui/core/Grid';
import { Form } from 'react-final-form'

export interface CheckoutFormInfo {
    'opt-in':                boolean,
    'first-name':            string,
    'last-name':             string,
    'street-address':        string,
    'postal-code':           string,
    country:                 string,
    phone:                   string,
    email:                   string,
    'visit-source':          string,
    'seating-accommodation': string,
    comments:                string
}

type CompleteOrderFormProps = {
    onSubmit: (formData: CheckoutFormInfo) => any,
    onBack: () => any
}

export default function CompleteOrderForm({onSubmit, onBack}: CompleteOrderFormProps) {
    return (<>
        <Typography variant="h3">Complete Order</Typography>
        <Typography variant="h4">Contact</Typography>
        <Form 
            onSubmit={onSubmit}
            initialValues={{"opt-in": false}}
            render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField name="first-name" label="First Name" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="last-name" label="Last Name" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="street-address" label="Street Address" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="postal-code" label="Postal Code" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="country" label="Country" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="phone" label="Phone" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="email" label="Email" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="visit-source" label="How did you hear about us?" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <Checkboxes name="opt-in" data={{ label: 'Email opt-in', value: true }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Checkboxes name="seating-accommodation" data={{ label: 'I Need Seating Accommodations', value: true }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="comments" label="Comments" variant="outlined" fullWidth multiline/>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" onClick={onBack} style={{width: "100%"}}>Back</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button type="submit" variant="contained" color="primary" style={{width: "100%"}}>Next</Button>
                        </Grid>
                    </Grid>
                    {false && JSON.stringify(values)}
                </form>
            )}
        />
    </>)}
