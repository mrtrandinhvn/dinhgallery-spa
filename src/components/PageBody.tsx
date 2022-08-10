import { Box } from '@mui/material';
import React, { CSSProperties, ReactNode } from 'react';

interface IPageBody {
    children: ReactNode,
    style?: CSSProperties,
}

const PageBody = ({ children, style }: IPageBody) => {
    return (
        <Box sx={{
            display: 'flex',
            flex: '1 1',
            flexDirection: 'column',
            height: '100%',
            overflow: 'auto',
            padding: '0.8rem',
        }} style={style}>
            {children}
        </Box>
    );
};

export default PageBody;