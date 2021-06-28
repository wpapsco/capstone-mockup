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
   const submit = async () =>
   {
      // Check if email is valid
      var email = 'aosihdfbgoasiduhjgfiuhasdvfg@tutanota.com';
      var news_opt = false;
      var volunteer_opt = true;

      // Check if email is already with us
      var email_exists = false;
      try
      {
         const data = {email: email};
         const response = await fetch("http://localhost:5000/api/newsletter/count",
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
            });
         const jsonData = await response.json();
         email_exists = +jsonData[0].count > 0;
      }
      catch(error)
      {
         console.error(error.message);
      }

      if(email_exists)
      {
         // Need to get checkbox things
         try
         {
            const data = {news_opt: news_opt, volunteer_opt: volunteer_opt, email: email};
            const response = await fetch("http://localhost:5000/api/newsletter/update",
               {
                  method: 'POST',
                  headers:
                  {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
               });
            const jsonData = await response.json();
            console.log(jsonData);
         }
         catch(error)
         {
            console.error(error.message);
         }
      }
      else
      {
         const data =
         {
            custname: "Bill Data",
            email: "junk data@nice.com",
            phone: "521-536-9278",
            custaddress: "120 NorthPole Cd.",
            news_opt: news_opt,
            donorbadge: false,
            seatingaccom: false,
            vip: false,
            volunteer_opt: volunteer_opt
         };

         try
         {
            const response = await fetch("http://localhost:5000/api/newsletter/insert",
               {
                  method: 'POST',
                  headers:
                  {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
               });
            const jsonData = await response.json();
            console.log(jsonData);
         }
         catch(error)
         {
            console.error(error.message);
         }
      }
   };

   return (
      <div style={{display: "flex", height: "100vh", width: "100%"}}>
         <Paper style={{flexGrow: 8, height: "100%", margin: "10px", paddingLeft: "5%", paddingTop: "50px", paddingRight: "10%"}} variant="outlined">
            <Typography variant="h3">Newsletter Sign-up!</Typography>
            <form>
               <Grid container spacing={1}>
               <Grid item xs={6}><TextField id="first-name" label="First Name" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField id="last-name" label="Last Name" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={12}><TextField id="email" label="Email" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><Checkbox id="newsletter-opt" /> Playhouse Newsletter </Grid>
               <Grid item xs={6}><Checkbox id="volunteer-opt" /> Volunteer List </Grid>
               <Grid item xs={12}><TextField id="address" label="Street Address" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField id="city" label="City" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField id="state" label="State" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField id="zip" label="Zip Code" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField id="phone" label="Phone" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><Button variant="contained" color="primary" onClick={() => {submit()}} style={{width: "50%"}}>Sign-up</Button> </Grid>
               </Grid>
            </form>
         </Paper>
      </div>
   )
}
