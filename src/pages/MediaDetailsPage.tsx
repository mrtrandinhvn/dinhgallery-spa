import React, { CSSProperties, useEffect, useState } from 'react';
import { ContentCopy, DeleteForever, Done } from '@mui/icons-material';
import { Box, Button, Zoom } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteAsync, getDetailsAsync } from '../apis/gallery-apis';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';
import { AuthenticatedTemplate } from '@azure/msal-react';

const mediaStyle: CSSProperties = {
    maxHeight: '100%',
    maxWidth: '100%',
};

function MediaDetailsPage() {
    const [publicUrl, setPublicUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const { fileName } = useParams();

    if (!fileName) {
        throw new Error(`Invalid url. Could not detect file name in this url: '${window.location.href}'`);
    }

    const fileExtension: string | undefined = fileName.split('.')?.pop()?.toUpperCase();
    if (!fileExtension) {
        throw new Error(`Could not detect file extension in file name: '${fileName}'`);
    }

    useEffect(() => {
        const fetchDataAsync = async () => {
            setLoading(true);
            const { data } = await getDetailsAsync(fileName);
            setPublicUrl(data);
            setLoading(false);
        };

        fetchDataAsync();
    }, [fileName]);

    const onCopyToClipboardClick = () => {
        if (copied) {
            return;
        }

        const a = document.createElement('a');
        a.href = window.location.href;
        navigator.clipboard.writeText(a.href).then(() => {
            setCopied(true);

            // reset copied status
            setTimeout(() => { setCopied(false); }, 5000);
        });
    };

    const onDeleteClick = async () => {
        if (window.confirm('Deleted media is lost forever. Are you sure you want to do this?')) {
            await deleteAsync(fileName);
            navigate('/');
        }
    };

    if (loading) {
        return <LoadingDiv />;
    }

    const imageExtensions = ['JPG', 'JPEG', 'PNG'];
    const isImage = imageExtensions.indexOf(fileExtension) >= 0;

    const previewEl = isImage ?
        (<img
            src={publicUrl}
            alt={fileName}
            loading='lazy'
            style={mediaStyle}
        />)
        :
        (<video
            controls
            preload='metadata'
            style={mediaStyle}
        >
            <source src={publicUrl} />
        </video>);
    return (
        <PageBody style={{ textAlign: 'center' }}>
            <PageHeading heading={fileName} />
            <Box sx={{ flex: '1 1', overflow: 'hidden', marginBottom: '0.5rem' }}>
                {previewEl}
                <Box>
                    <Button
                        size="medium"
                        color={copied ? 'success' : 'primary'}
                        variant='outlined'
                        startIcon={
                            <>
                                <Zoom in={copied} style={{ position: 'absolute' }}>
                                    <Done color='success' />
                                </Zoom>
                                <Zoom in={!copied}>
                                    <ContentCopy color='primary' />
                                </Zoom>
                            </>}
                        onClick={onCopyToClipboardClick}
                        sx={{ marginRight: '.5rem' }}
                    >
                        {copied ? 'Copied' : 'Click to copy'}
                    </Button>
                    <AuthenticatedTemplate>
                        <Button
                            size="medium"
                            color="error"
                            variant='outlined'
                            startIcon={<DeleteForever />}
                            onClick={onDeleteClick}>
                            Delete
                        </Button>
                    </AuthenticatedTemplate>
                </Box>
            </Box>
        </PageBody>
    );
}

export default MediaDetailsPage;