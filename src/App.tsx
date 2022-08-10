import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import { Box, NoSsr } from '@mui/material';
import MyAppbar from './components/MyAppbar';
import { Outlet } from 'react-router-dom';

export default function App() {

    return (
        <NoSsr>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <MyAppbar />
                <Box component="main" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </NoSsr>
    );
}