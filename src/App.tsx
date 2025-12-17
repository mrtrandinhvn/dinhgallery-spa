import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NoSsr from '@mui/material/NoSsr';
import MyAppBar from './components/MyAppBar';
import { Outlet } from 'react-router-dom';
import { green, purple } from '@mui/material/colors';
import { msalInstance } from './authConfig';
import { MsalProvider } from '@azure/msal-react';

const theme = createTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: purple[500],
        },
        secondary: {
            // This is green.A700 as hex.
            main: green.A700,
        },
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    background: 'rgba(255 255 255 / 70%)',
                    marginRight: '0.3rem',
                },
            },
        },
    },
});


export default function App() {
    return (
        <NoSsr>
            <ThemeProvider theme={theme}>
                <MsalProvider instance={msalInstance}>
                    <Box sx={{ display: 'flex', height: '100vh' }}>
                        <MyAppBar />
                        <Box component="main" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Toolbar /> {/* this line is needed to offset the fixed appbar */}
                            <Outlet />
                        </Box>
                    </Box>
                </MsalProvider>
            </ThemeProvider>
        </NoSsr>
    );
}
