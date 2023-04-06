import { Article, DeleteForeverOutlined, Download, ExitToApp } from '@mui/icons-material';
import { Box, IconButton, ImageListItem, ImageListItemBar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IFileDetails } from '../apis/gallery-apis';
import { FileType, getFileType } from '../constants/file-extensions';
import { getAbsoluteUrl } from '../utils';
import CopyIconButton from './CopyIconButton';
import ShareIconButton from './ShareIconButton';

interface IProps {
    details: IFileDetails,
    deleteItem: (fileName: string) => void,
}

const ItemPreview = ({ fileType, downloadUri, alt = '' }: { fileType: FileType, downloadUri: string, alt?: string }) => {
    switch (fileType) {
        case 'IMAGE':
            return <img
                src={downloadUri}
                alt={alt}
                loading='lazy'
            />;

        case 'VIDEO':
            return <video
                src={downloadUri}
                controls
                preload="metadata"
            />;

        default:
            return (
                <Box sx={{
                    width: '100%',
                    height: '230px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                }}>
                    <Article sx={{ fontSize: '100pt' }} />
                </Box>
            );
    }
};

function getDetailsPage(fileType: FileType, details: IFileDetails) {
    return fileType === 'VIDEO' ? `/file/${details.id}` : details.downloadUri;
}

export default function GalleryItem({ details, deleteItem }: IProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fileName: string | undefined = details.downloadUri;
    if (!fileName) {
        throw new Error(`Invalid url. Could not detect file name in this url: '${details.downloadUri}'`);
    }

    const fileType = getFileType(fileName);
    const detailsPage = getDetailsPage(fileType, details);
    const detailsPageAbsoluteUrl = getAbsoluteUrl(detailsPage);

    const localOnDeleteClick = useCallback(() => {
        if (window.confirm('Deleted media is lost forever. Are you sure you want to do this?')) {
            deleteItem(details.id);
        }
    }, [deleteItem, details.id]);

    return (
        <ImageListItem
            sx={{
                borderRadius: '0.4rem',
                overflow: 'hidden',
                minHeight: '100px',
            }}>
            <ItemPreview
                fileType={fileType}
                downloadUri={details.downloadUri}
                alt={details.displayName} />
            <ImageListItemBar
                title={
                    <Box>
                        <Typography variant='h6'>{details.displayName}</Typography>
                    </Box>
                }
                subtitle={
                    <Box style={{ minWidth: '80px', textAlign: 'right' }}>
                        {
                            fileType === 'VIDEO' ?
                                <Link to={detailsPage} title='Go to details page'>
                                    <IconButton color='primary'>
                                        <ExitToApp />
                                    </IconButton>
                                </Link>
                                : null
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
