import { createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#429EC3',
        },
        secondary: {
            main: '#31383D',
        }
    },
    typography: {
        fontFamily: 'Montserrat',
        body1: {
            fontSize: '0.9rem',
        },
        subtitle1: {
            fontFamily: 'Roboto'
        }
    },
    shape: {
        borderRadius: 5,
    },
    // spacing: 20,
})

export default theme

// --e-global-color-primary: #D8993F;
// --e-global-color-secondary: #31383D;
// --e-global-color-text: #7A7A7A;
// --e-global-color-accent: #61CE70;
// --e-global-color-4984e4ac: #429EC3;
// --e-global-color-3d8a892e: #E5BF42;
// --e-global-color-1615ba28: #455B64;
// --e-global-color-148ee843: #E57042;
// --e-global-color-304c766: #000;
// --e-global-color-940356b: #FFF;
// --e-global-color-4c5c8f37: #BD2F07;
// --e-global-typography-primary-font-family: "Montserrat";
// --e-global-typography-primary-font-weight: 600;
// --e-global-typography-secondary-font-family: "Montserrat";
// --e-global-typography-secondary-font-weight: 400;
// --e-global-typography-text-font-family: "Playfair Display";
// --e-global-typography-text-font-weight: 400;
// --e-global-typography-accent-font-family: "Roboto";
// --e-global-typography-accent-font-weight: 500;
