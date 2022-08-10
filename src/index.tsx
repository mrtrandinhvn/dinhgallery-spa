import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';

import NotFoundPage from './pages/NotFoundPage';
import GalleryPage from './pages/GalleryPage';
import UploadPage from './pages/UploadPage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from '@azure/msal-react';
import { msalInstance } from './authConfig';
import { AccountInfo, EventType } from '@azure/msal-browser';

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

const NeedSignInMessage = () => {
    return (
        <UnauthenticatedTemplate>
            <Box sx={{ marginTop: '1rem' }}>
                <Typography variant='h6'>You need to sign in to use this page.</Typography>
            </Box>
        </UnauthenticatedTemplate>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <>
        <React.StrictMode>
            <CssBaseline />
            <MsalProvider instance={msalInstance}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />} >
                            <Route index element={
                                <>
                                    <NeedSignInMessage />
                                    <AuthenticatedTemplate><GalleryPage /></AuthenticatedTemplate>
                                </>
                            } />
                            <Route path='upload' element={
                                <>
                                    <NeedSignInMessage />
                                    <AuthenticatedTemplate><UploadPage /></AuthenticatedTemplate>
                                </>
                            } />
                            <Route path='details/:fileName' element={<MediaDetailsPage />} />

                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </MsalProvider>
        </React.StrictMode>
    </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
