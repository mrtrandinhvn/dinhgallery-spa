import { DeleteForeverOutlined, Download, ExitToApp } from '@mui/icons-material';
import { Box, IconButton, ImageListItem, ImageListItemBar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IFileDetails } from '../apis/gallery-apis';
import { imageExtensions } from '../constants/file-extensions';
import { getAbsoluteUrl } from '../utils';
import CopyIconButton from './CopyIconButton';
import ShareIconButton from './ShareIconButton';

interface IProps {
    details: IFileDetails,
    deleteItem: (fileName: string) => void,
}

function GalleryItem({ details, deleteItem }: IProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fileName: string | undefined = details.downloadUri;
    if (!fileName) {
        throw new Error(`Invalid url. Could not detect file name in this url: '${details.downloadUri}'`);
    }

    const fileExtension: string | undefined = fileName.split('.')?.pop()?.toUpperCase();
    if (!fileExtension) {
        throw new Error(`Could not detect file extension in file name: '${fileName}'`);
    }

    const isImage = imageExtensions.indexOf(fileExtension) >= 0;
    const detailsPage = isImage ? details.downloadUri : `/file/${details.id}`;
    const detailsPageAbsoluteUrl = getAbsoluteUrl(detailsPage);

    const localOnDeleteClick = useCallback(() => {
        if (window.confirm('Deleted media is lost forever. Are you sure you want to do this?')) {
            deleteItem(details.id);
        }
    }, [deleteItem, details.id]);

    const previewEl = imageExtensions.indexOf(fileExtension) >= 0 ?
        <img
            src={details.downloadUri}
            alt="Default alt"
            loading='lazy'
        />
        :
        <video
            src={details.downloadUri}
            controls
            preload="metadata"
        />;
    return (
        <ImageListItem
            sx={{
                borderRadius: '0.4rem',
                overflow: 'hidden',
            }}>
            {previewEl}
            <ImageListItemBar
                sx={{
                    // background: 'rgba(255, 255, 255, 0.5)',
                }}
                title={
                    <Box>
                        <Typography variant='h6'>{details.displayName}</Typography>
                    </Box>
                }
                subtitle={
                    <Box style={{ minWidth: '80px', textAlign: 'right' }}>
                        {
                            isImage ?
                                null
                                : <Link to={detailsPage} title='Go to details page'>
                                    <IconButton color='primary'>
                                        <ExitToApp />
                                    </IconButton>
                                </Link>
                        }
                        <a
                            href={details.downloadUri}
                            target="_blank"
                            rel="noreferrer"
                            title='Download'>
                            <IconButton color='primary'                            >
                                <Download />
                            </IconButton>
                        </a>
                        <ShareIconButton url={detailsPageAbsoluteUrl} />
                        <CopyIconButton url={detailsPageAbsoluteUrl} />
                        <IconButton
                            title={'Click to delete'}
                            aria-label={'Click to delete'}
                            onClick={localOnDeleteClick}
                        >
                            <DeleteForeverOutlined color='error' />
                        </IconButton>
                    </Box>
                }
                position={isMobile ? 'below' : 'top'}
            />
        </ImageListItem>
    );
}

export default GalleryItem;