import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

const PageHeading = ({ heading }: { heading: string | ReactNode }) => {
    return (
        <Typography component={'h2'} variant={'h4'} sx={{ marginBottom: '0.5rem' }}>{heading}</Typography>
    );
};

export default PageHeading;