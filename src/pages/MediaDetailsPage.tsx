import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { ContentCopy, DeleteForever, Done, Download, Share } from '@mui/icons-material';
import { Box, Button, Typography, Zoom } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteFileAsync, getFileDetailsAsync, IFileDetails } from '../apis/gallery-apis';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';
import { AuthenticatedTemplate } from '@azure/msal-react';
import { mobileShareAsync } from '../utils';
import { imageExtensions } from '../constants/file-extensions';

const mediaStyle: CSSProperties = {
    maxHeight: 'calc(100% - 48px)',
    maxWidth: '100%',
};

function MediaDetailsPage() {
    const { id } = useParams();
    if (!id) {
        throw new Error('User supposed to be routed to 404 page instead. Please check routing again.');
    }

    const navigate = useNavigate();
    const [fileDetails, setFileDetails] = useState<IFileDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setIsLoading(true);
            const { data } = await getFileDetailsAsync(id);
            if (!data) {
                navigate('/404');
                return;
            }
            setFileDetails({
                ...data,
                createdAtUtc: new Date(data.createdAtUtc),
            });
            setIsLoading(false);
        };

        fetchDataAsync();
    }, [id, navigate]);

    const onCopyToClipboardClick = useCallback(() => {
        if (copied) {
            return;
        }

        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);

            // reset copied status
            setTimeout(() => { setCopied(false); }, 5000);
        });
    }, [copied]);

    const onDeleteClick = async () => {
        if (window.confirm('Deleted media is lost forever. Are you sure you want to do this?')) {
            await deleteFileAsync(id);
            navigate('/');
        }
    };

    const onShareClick = useCallback(() => {
        mobileShareAsync({ url: window.location.href });
    }, []);

    if (isLoading || !fileDetails) {
        return <LoadingDiv />;
    }

    const fileExtension: string | undefined = fileDetails?.displayName.split('.')?.pop()?.toUpperCase();
    if (!fileExtension) {
        throw new Error(`Could not detect file extension of file with id: '${id}'`);
    }

    const isImage = imageExtensions.indexOf(fileExtension) >= 0;

    const previewEl = isImage ?
        (<img
            src={fileDetails.downloadUri}
            alt={id}
            loading='lazy'
            style={mediaStyle}
        />)
        :
        (<video
            controls
            preload='metadata'
            style={mediaStyle}
        >
            <source src={fileDetails.downloadUri} />
        </video>);
    return (
        <PageBody style={{ textAlign: 'center' }}>
            <PageHeading heading={fileDetails.displayName} />
            <Typography variant='subtitle1'>Uploaded at: {fileDetails.createdAtUtc?.toLocaleString('en-GB')}</Typography>
            <Box sx={{ flex: '1 1', overflow: 'hidden', marginBottom: '0.5rem' }}>
                {previewEl}
                <Box>
                    <Button
                        href={fileDetails.downloadUri}
                        target="_blank"
                        rel="noreferrer"
                        title='Download'
                        startIcon={<Download />}
                        size='medium'
                        variant='outlined'
                        sx={{ marginRight: '.5rem' }}
                    >
                        Download
                    </Button>
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
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                        size="medium"
                        variant='outlined'
                        startIcon={
                            <Share color='primary' />
                        }
                        onClick={onShareClick}
                        sx={{ marginRight: '.5rem' }}
                    >
                        Share
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