import Typography from '@material-ui/core/Typography'

const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Showtime({align, date}: {align: 'center' | 'left' | undefined, date: Date}) {
    const showtime = `${days[date.getDay()]} ${months[date.getMonth()]}, ${date.getDate()+1}`
    return <Typography align={align} variant="subtitle1">{showtime}</Typography>
}