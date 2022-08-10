import { Typography } from '@mui/material';
import React, { ReactNode } from 'react';

const PageHeading = ({ heading }: { heading: string | ReactNode }) => {
    return (
        <Typography component={'h2'} variant={'h4'}>{heading}</Typography>
    );
};

export default PageHeading;