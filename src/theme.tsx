/**
 * Copyright © 2021 Aditya Sharoff, Gregory Hairfeld, Jesse Coyle, Francis Phan, William Papsco, Jack Sherman, Geoffrey Corvera
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
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
            lineHeight: 1.8,
        },
        subtitle1: {
            fontFamily: 'Roboto'
        },
        h5: {
            marginBottom: 16
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
