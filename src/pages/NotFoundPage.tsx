import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';

const NotFoundPage = () => {
    return (
        <PageBody>
            <PageHeading heading='404 Not Found' />
            <Typography>The page you're looking for does not exist.</Typography>
            <Link to="/">Go to the home page</Link>
        </PageBody>
    );
};

export default NotFoundPage;