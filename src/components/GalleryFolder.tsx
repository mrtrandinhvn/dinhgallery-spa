import './GalleryFolder.css';

import { Box, IconButton, ImageList, Typography, useMediaQuery, useTheme } from '@mui/material';
import { default as GalleryItem } from './GalleryItem';
import { useCallback, useEffect, useState } from 'react';
import { deleteFileAsync, deleteFolderAsync, getFolderDetailsAsync, IFileDetails } from '../apis/gallery-apis';
import LoadingDiv from './LoadingDiv';
import NotFoundPage from '../pages/NotFoundPage';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { ExitToApp, DeleteForeverOutlined } from '@mui/icons-material';
import CopyIconButton from './CopyIconButton';
import ShareIconButton from './ShareIconButton';
import { getAbsoluteUrl } from '../utils';
import { Link } from 'react-router-dom';

interface IProps {
    folderId: string,
    variant?: 'masonry' | 'standard',
    deleteFolder: (folderId: string) => void,
}

interface IFolderDetailsState {
    createdAtUtc?: Date | null,
    displayName: string,
}

function GalleryFolder({ folderId, variant = 'standard', deleteFolder }: IProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [isLoading, setIsLoading] = useState(true);
    const [folderDetails, setFolderDetails] = useState<IFolderDetailsState | null>(null);
    const [files, setFiles] = useState(new Array<IFileDetails>());

    const deleteItemHandle = useCallback(async (fileId: string) => {
        setIsLoading(true);
        const { data: isSuccess } = await deleteFileAsync(fileId);
        setIsLoading(false);
        if (isSuccess) {
            const remainingFiles = files.filter(x => x.id !== fileId);
            if (!remainingFiles.length) {
                // when there's no file left, remove the whole folder
                deleteFolder(folderId);
            } else {
                setFiles(remainingFiles);
            }
        }
    }, [deleteFolder, files, folderId]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const { data } = await getFolderDetailsAsync(folderId);
            if (data) {
                setFolderDetails({
                    ...data,
                    createdAtUtc: new Date(data.createdAtUtc),
                });
                setFiles(data.files);
            }

            setIsLoading(false);
        })();
    }, [folderId]);

    const localOnDeleteClick = useCallback(async () => {
        if (window.confirm('Deleted media is lost forever. Are you sure you want to do this?')) {
            setIsLoading(true);
            const { data: isSuccess } = await deleteFolderAsync(folderId);
            setIsLoading(false);
            if (isSuccess) {
                deleteFolder(folderId);
            }
        }
    }, [deleteFolder, folderId]);

    if (!isLoading && !folderDetails) {
        return <NotFoundPage />;
    }

    const detailsPage = `/folder/${folderId}`;
    const detailsPageAbsoluteUrl = getAbsoluteUrl(detailsPage);

    return (
        <Box className='gallery-folder' marginBottom={'1rem'}>
            {folderDetails &&
                <Grid2 container spacing={0} marginBottom={2}>
                    <Grid2 xs={12} sm={8}>
                        <Typography variant='h5'>
                            {folderDetails.displayName}
                        </Typography>
                        <Typography variant='subtitle1'>
                            Uploaded at: {folderDetails.createdAtUtc?.toLocaleString('en-GB')}
                        </Typography>
                    </Grid2>
                    <Grid2 xs={8} sm={4} sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Link to={detailsPage} title='Go to details page'>
                            <IconButton color='primary'>
                                <ExitToApp />
                            </IconButton>
                        </Link>

                        <ShareIconButton url={detailsPageAbsoluteUrl} />
                        <CopyIconButton url={detailsPageAbsoluteUrl} />
                        <IconButton
                            title={'Click to delete'}
                            aria-label={'Click to delete'}
                            onClick={localOnDeleteClick}
                        >
                            <DeleteForeverOutlined color='error' />
                        </IconButton>
                    </Grid2>
                </Grid2 >
            }
            {
                isLoading ?
                    <LoadingDiv /> :
                    <ImageList
                        sx={{ width: '100%', margin: 0, flex: '1 1', overflowY: 'initial' }}
                        variant={variant}
                        cols={isMobile ? 1 : 3}
                        gap={8}>
                        {
                            files.map(fileDetails => (
                                <GalleryItem
                                    key={fileDetails.id}
                                    details={fileDetails}
                                    deleteItem={deleteItemHandle}
                                />),
                            )
                        }
                    </ImageList>
            }
        </Box >
    );
}

export default GalleryFolder;

