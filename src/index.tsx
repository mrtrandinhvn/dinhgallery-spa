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
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import FolderDetailsPage from './pages/FolderDetailsPage';

const NeedSignInMessage = () => {
    return (
        <UnauthenticatedTemplate>
            <Box sx={{ marginTop: '1rem' }}>
                <Typography variant='h6'>You need to sign in to use this page.</Typography>
            </Box>
        </UnauthenticatedTemplate>
    );
};

const RoutedApp = <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />}>
            <Route index element={<>
                <NeedSignInMessage />
                <AuthenticatedTemplate><GalleryPage /></AuthenticatedTemplate>
            </>} />
            <Route path='upload' element={<>
                <NeedSignInMessage />
                <AuthenticatedTemplate><UploadPage /></AuthenticatedTemplate>
            </>} />
            <Route path='file/:id' element={<MediaDetailsPage />} />
            <Route path='folder/:id' element={<FolderDetailsPage />} />

            <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
</BrowserRouter>;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <>
        <React.StrictMode>
            <CssBaseline />
            {RoutedApp}
        </React.StrictMode>
    </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
