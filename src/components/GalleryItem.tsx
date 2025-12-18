import Article from '@mui/icons-material/Article';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import Download from '@mui/icons-material/Download';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import type { IFileDetails } from '../apis/gallery-apis';
import { type FileType, getFileType } from '../constants/file-extensions';
import { getAbsoluteUrl } from '../utils';
import CopyIconButton from './CopyIconButton';
import ShareIconButton from './ShareIconButton';
import ConfirmDialog from './ConfirmDialog';

interface IProps {
    details: IFileDetails,
    deleteItem: (fileName: string) => void,
}

const ItemPreview = ({ fileType, downloadUri, alt = '' }: { fileType: FileType, downloadUri: string, alt?: string }) => {
    switch (fileType) {
        case 'IMAGE':
            return <img
                style={{ minHeight: '200px' }}
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
    const [confirmDeleteDiaglogOpen, setConfirmDeleteDiaglogOpen] = useState(false);

    const fileName: string | undefined = details.downloadUri;
    if (!fileName) {
        throw new Error(`Invalid url. Could not detect file name in this url: '${details.downloadUri}'`);
    }

    const fileType = getFileType(fileName);
    const detailsPage = getDetailsPage(fileType, details);
    const detailsPageAbsoluteUrl = getAbsoluteUrl(detailsPage);

    const localOnDeleteClick = useCallback(() => {
        setConfirmDeleteDiaglogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        setConfirmDeleteDiaglogOpen(false);
        deleteItem(details.id);
    }, [deleteItem, details.id]);

    const handleCancelDelete = useCallback(() => {
        setConfirmDeleteDiaglogOpen(false);
    }, []);

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
            <ConfirmDialog
                open={confirmDeleteDiaglogOpen}
                title="Delete Media"
                message="Deleted media is lost forever. Are you sure you want to do this?"
                confirmText="Delete"
                cancelText="Cancel"
                confirmColor="error"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </ImageListItem>
    );
}
