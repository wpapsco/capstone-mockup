/* Creator:  Jesse Coyle [jecoyle@pdx.edu]
 * Date:     6/5/2021
 * Revision: 6/29/2021
 */

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import {useState} from 'react';

export default function NewsletterPage()
{
   const [email_error, set_email_error] = useState(false);
   const [form_data, set_form_data] = useState(
   {
      first_name: "",
      last_name: "",
      email: "",
      news_opt: false,
      volunteer_opt: false,
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
   });

   const perform_fetch = async (url_append: string, data: any) =>
   {
      const response = await fetch("http://localhost:5000/api/" + url_append,
      {
         method: 'POST',
         headers:
         {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      });
      return response.json();
   }

   const submit = async (event: React.FormEvent) =>
   {
      event.preventDefault();

      const email_regular_expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!email_regular_expression.test(form_data.email))
      {
         set_email_error(true);
         return;
      }
      else
      {
         set_email_error(false);
      }

      // Todo(jesse): Consolodate below into a more general usable `does_account_exist` procedure?
      var email_exists = false;
      try
      {
         const data = {email: form_data.email};
         const json_data = await perform_fetch("newsletter/count", data);
         email_exists = +json_data[0].count > 0;
      }
      catch(error)
      {
         console.error(error.message);
         // Todo(jesse): Do something
         return;
      }

      if(email_exists)
      {
         try
         {
            const data = {news_opt: form_data.news_opt, volunteer_opt: form_data.volunteer_opt, email: form_data.email};
            perform_fetch("newsletter/update", data);
         }
         catch(error)
         {
            console.error(error.message);
            // Todo(jesse): Do something
            return;
         }
      }
      else
      {
         // custname, email, phone, custaddress, news_opt, donorbadge, seatingaccom, vip, \"volunteer list\")
         const data =
         {
            custname: form_data.first_name + " " + form_data.last_name,
            email: form_data.email,
            phone: form_data.phone,
            custaddress: form_data.address,
            news_opt: form_data.news_opt,
            volunteer_opt: form_data.volunteer_opt,
         };

         try
         {
            perform_fetch("newsletter/insert", data);
         }
         catch(error)
         {
            console.error(error.message);
            // Todo(jesse): Do something
            return;
         }
      }
   };

   const form_data_change = (event: React.ChangeEvent<HTMLInputElement>) =>
   {
      set_form_data({...form_data, [event.target.name]: event.target.value});
   };
   const form_data_checkbox_change = (event: React.ChangeEvent<HTMLInputElement>) =>
   {
      set_form_data({...form_data, [event.target.name]: event.target.checked});
   };

   return (
      <div style={{display: "flex", height: "100vh", width: "100%"}}>
         <Paper style={{flexGrow: 8, height: "100%", margin: "10px", paddingLeft: "5%", paddingTop: "50px", paddingRight: "10%"}} variant="outlined">
            <Typography variant="h3">Newsletter Sign-up!</Typography>
            <form onSubmit={submit}>
               <Grid container spacing={1}>
               <Grid item xs={6}><TextField name="first_name" label="First Name" value={form_data.first_name} onChange={form_data_change} variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField name="last_name" label="Last Name" value={form_data.last_name} onChange={form_data_change} variant="outlined" fullWidth/> </Grid>
               <Grid item xs={12}><TextField type="email" required error={email_error} name="email" label="Email" value={form_data.email} onChange={form_data_change} variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><Checkbox name="news_opt" value={form_data.news_opt} onChange={form_data_checkbox_change} />Playhouse Newsletter</Grid>
               <Grid item xs={6}><Checkbox name="volunteer_opt" value={form_data.volunteer_opt} onChange={form_data_checkbox_change} />Volunteer List</Grid>
               <Grid item xs={12}><TextField name="address" value={form_data.address} onChange={form_data_change} label="Street Address" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField name="city" value={form_data.city} onChange={form_data_change} label="City" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField name="state" value={form_data.state} onChange={form_data_change} label="State" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField name="zip" value={form_data.zip} onChange={form_data_change} label="Zip Code" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><TextField name="phone" value={form_data.phone} onChange={form_data_change} label="Phone" variant="outlined" fullWidth/> </Grid>
               <Grid item xs={6}><Button type="submit" variant="contained" color="primary" style={{width: "50%"}}>Sign-up</Button> </Grid>
               </Grid>
            </form>
         </Paper>
      </div>
   )
}
