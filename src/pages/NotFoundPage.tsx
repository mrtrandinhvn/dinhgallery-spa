import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Box>
            <Typography>The page you're looking for does not exists.</Typography>
            <Link to="/">Go to the home page</Link>
        </Box>
    );
};

export default NotFoundPage;