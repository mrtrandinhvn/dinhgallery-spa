import { ContentCopy, Done } from '@mui/icons-material';
import { IconButton, Zoom } from '@mui/material';
import { memo, useCallback, useState } from 'react';

const CopyIconButton = memo(function ({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);
    const onCopyToClipboardClick = useCallback(() => {
        if (copied) {
            return;
        }

        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);

            // reset copied status
            setTimeout(() => { setCopied(false); }, 5000);
        });
    }, [copied, url]);

    return (
        <IconButton
            title={copied ? 'Copied' : 'Copy to clipboard'}
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
            onClick={onCopyToClipboardClick}
            sx={{ background: 'rgba(255 255 255 / 70%)', marginRight: '0.3rem' }}
        >
            <Zoom in={copied} style={{ position: 'absolute' }}>
                <Done color='success' />
            </Zoom>
            <Zoom in={!copied}>
                <ContentCopy color='success' />
            </Zoom>
        </IconButton>
    );
});


export default CopyIconButton;