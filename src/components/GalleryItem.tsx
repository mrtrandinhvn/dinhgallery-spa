import { ContentCopy, DeleteForeverOutlined, Done, ExitToApp, OpenInNew } from '@mui/icons-material';
import { Box, IconButton, ImageListItem, ImageListItemBar, Zoom } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface IProps {
    url: string,
    deleteItem: (fileName: string) => {},
}

function GalleryItem({ url, deleteItem }: IProps) {
    const [copied, setCopied] = useState(false);

    const fileName: string | undefined = url.split('/').pop();
    if (!fileName) {
        throw new Error(`Invalid url. Could not detect file name in this url: '${url}'`);
    }

    const fileExtension: string | undefined = fileName.split('.')?.pop()?.toUpperCase();
    if (!fileExtension) {
        throw new Error(`Could not detect file extension in file name: '${fileName}'`);
    }

    const imageExtensions = ['JPG', 'JPEG', 'PNG'];
    const isImage = imageExtensions.indexOf(fileExtension) >= 0;
    const detailsPage = isImage ? url : `/details/${fileName}`;

    const onCopyToClipboardClick = () => {
        if (copied) {
            return;
        }

        const a = document.createElement('a');
        a.href = detailsPage;
        navigator.clipboard.writeText(a.href).then(() => {
            setCopied(true);

            // reset copied status
            setTimeout(() => { setCopied(false); }, 5000);
        });
    };

    const localOnDeleteClick = () => {
        if (window.confirm('Deleted media is lost forever. Are you sure you want to do this?')) {
            deleteItem(fileName);
        }
    };

    const previewEl = imageExtensions.indexOf(fileExtension) >= 0 ?
        <img
            src={url}
            alt="Default alt"
            loading='lazy'
            style={{
                borderRadius: '0.8rem',
            }}
        />
        :
        <video
            src={url}
            controls
            preload="metadata"
            style={{
                width: '100%',
                borderRadius: '0.8rem',
            }}
        />;
    return (
        <ImageListItem
            sx={{
                borderRadius: '0.8rem',
                overflow: 'hidden',
            }}>
            {previewEl}
            <ImageListItemBar
                sx={{
                    // background: 'rgba(255, 255, 255, 0.5)',
                }}
                title={
                    <Box
                        sx={{
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Box style={{ minWidth: '80px', textAlign: 'right' }}>
                            {
                                isImage ?
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        title='Open in new tab'>
                                        <IconButton color='primary'
                                            sx={{ background: 'rgba(255 255 255 / 70%)', marginRight: '0.3rem' }}
                                        >
                                            <OpenInNew />
                                        </IconButton>
                                    </a>
                                    : <Link to={detailsPage} title='Go to details page'>
                                        <IconButton color='primary'
                                            sx={{ background: 'rgba(255 255 255 / 70%)', marginRight: '0.3rem' }}
                                        >
                                            <ExitToApp />
                                        </IconButton>
                                    </Link>
                            }
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
                            <IconButton
                                title={'Click to delete'}
                                aria-label={'Click to delete'}
                                onClick={localOnDeleteClick}
                                sx={{ background: 'rgba(255 255 255 / 70%)' }}
                            >
                                <DeleteForeverOutlined color='error' />
                            </IconButton>
                        </Box>
                    </Box>
                }
                position='top'
            />
        </ImageListItem>
    );
}

export default GalleryItem;