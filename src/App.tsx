import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import { Box, createTheme, NoSsr, ThemeProvider } from '@mui/material';
import MyAppbar from './components/MyAppbar';
import { Outlet } from 'react-router-dom';
import { green, purple } from '@mui/material/colors';
import { msalInstance } from './authConfig';
import { EventType, AccountInfo } from '@azure/msal-browser';
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

// Default to using the first account if no account is active on page load

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    console.log('Set active account on page load');
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event?.payload) {
        console.log('Set active account after signin');
        const account = event.payload as AccountInfo;
        msalInstance.setActiveAccount(account);
    }
});

export default function App() {
    return (
        <NoSsr>
            <ThemeProvider theme={theme}>
                <MsalProvider instance={msalInstance}>
                    <Box sx={{ display: 'flex', height: '100vh' }}>
                        <MyAppbar />
                        <Box component="main" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Toolbar />
                            <Outlet />
                        </Box>
                    </Box>
                </MsalProvider>
            </ThemeProvider>
        </NoSsr>
    );
}
