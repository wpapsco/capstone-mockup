/* Creator:  Jesse Coyle [jecoyle@pdx.edu]
 * Date:     6/5/2021
 * Revision: 6/5/2021
 */

// Note(jesse): I know someone from front-end will probably want to come in here and make it pretty.
// I just wanted something to work on to get familiar with the project, express and maybe something
// to use for a test case for the backend... haven't gotten to the last part yet.

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function NewsletterPage()
{
   return (
      <div style={{display: "flex", height: "100vh", width: "100%"}}>
         <Paper style={{flexGrow: 8, height: "100%", margin: "10px", paddingLeft: "5%", paddingTop: "50px", paddingRight: "10%"}} variant="outlined">
            <Typography variant="h3">Newsletter!</Typography>
            <form>
               <TextField id="email" label="Email" variant="outlined" fullWidth/>
               <Button variant="contained" color="primary" style={{width: "100%"}}>Sign-up</Button>
            </form>
         </Paper>
      </div>
   )
}
