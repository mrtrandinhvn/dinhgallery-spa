import { Share } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { memo } from 'react';
import { mobileShareAsync } from '../utils';

const ShareIconButton = memo(function ({ url }: { url: string }) {
    const onShareClick = () => {
        mobileShareAsync({ url });
    };
    return (
        <IconButton
            title={'Click to share'}
            aria-label={'Click to share'}
            onClick={onShareClick}
            sx={{ background: 'rgba(255 255 255 / 70%)', marginRight: '0.3rem' }}
        >
            <Share color='primary' />
        </IconButton>
    );
});

export default ShareIconButton;