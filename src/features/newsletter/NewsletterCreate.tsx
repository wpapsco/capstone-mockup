/* Creator:  Jesse Coyle [jecoyle@pdx.edu]
 * Date:     7/5/2021
 * Revision: 7/15/2021
 */

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import {useState} from 'react';

export default function NewsletterCreate()
{

   return (
      <div style={{display: "flex", height: "100vh", width: "100%"}}>
         <Paper style={{flexGrow: 8, height: "100%", margin: "10px", paddingLeft: "5%", paddingTop: "50px", paddingRight: "10%"}} variant="outlined">
            <Typography variant="h3">Newsletter Creation!</Typography>
            <hr/>
            <form>
               <Grid container spacing={1}>
               <Grid item xs={3}><Button variant="contained" color="primary" style={{width: "100%"}}>ADD</Button> </Grid>
               <Grid item xs={3}><Button variant="contained" color="primary" style={{width: "100%"}}>PREVIEW</Button> </Grid>
               <Grid item xs={3}><Button variant="contained" color="primary" style={{width: "100%"}}>FINISH</Button> </Grid>
               <Grid item xs={3}><Button variant="contained" color="secondary" style={{width: "100%"}}>DISCARD</Button> </Grid>
               </Grid>
            </form>
         </Paper>
      </div>
   )
}
