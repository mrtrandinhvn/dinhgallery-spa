import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

interface IPageBody {
    children: ReactNode,
}

const PageBody = ({ children }: IPageBody) => {
    return (
        <Box sx={{ display: 'flex', flex: '1 1', flexDirection: 'column', overflow: 'auto', paddingBottom: '1.5rem' }}>
            {children}
        </Box>
    );
};

export default PageBody;