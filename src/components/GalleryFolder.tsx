import './GalleryFolder.css';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { default as GalleryItem } from './GalleryItem';
import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteFileAsync, deleteFolderAsync, getFolderDetailsAsync, uploadFilesToFolderAsync, type IFileDetails } from '../apis/gallery-apis';
import LoadingDiv from './LoadingDiv';
import NotFoundPage from '../pages/NotFoundPage';
import Grid from '@mui/material/Grid';
import ExitToApp from '@mui/icons-material/ExitToApp';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import CloudUpload from '@mui/icons-material/CloudUpload';
import CopyIconButton from './CopyIconButton';
import ShareIconButton from './ShareIconButton';
import { getAbsoluteUrl } from '../utils';
import { Link } from 'react-router-dom';
import { AuthenticatedTemplate } from '@azure/msal-react';

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
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFilesInputRef = useRef<HTMLInputElement>(null);

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

    const handleUploadClick = useCallback(() => {
        uploadFilesInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            setIsUploading(true);
            setUploadProgress(0);

            const { success } = await uploadFilesToFolderAsync(folderId, selectedFiles, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(percentCompleted);
                },
            });

            if (success) {
                // Refresh folder details to show newly uploaded files
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
            }

            setIsUploading(false);
            setUploadProgress(0);

            // Reset input so the same file can be uploaded again if needed
            if (uploadFilesInputRef.current) {
                uploadFilesInputRef.current.value = '';
            }
        }
    }, [folderId]);

    if (!isLoading && !folderDetails) {
        return <NotFoundPage />;
    }

    const detailsPage = `/folder/${folderId}`;
    const detailsPageAbsoluteUrl = getAbsoluteUrl(detailsPage);

    return (
        <Box className='gallery-folder' marginBottom={'1rem'}>
            {folderDetails &&
                <Grid container spacing={0} marginBottom={2}>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant='h5'>
                            {folderDetails.displayName}
                        </Typography>
                        <Typography variant='subtitle1'>
                            Uploaded at: {folderDetails.createdAtUtc?.toLocaleString('en-GB')}
                        </Typography>
                        {isUploading && (
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                                    Uploading files... {uploadProgress}%
                                </Typography>
                                <LinearProgress variant='determinate' value={uploadProgress} />
                            </Box>
                        )}
                    </Grid>
                    <Grid size={{ xs: 8, sm: 4 }} sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Link to={detailsPage} title='Go to details page'>
                            <IconButton color='primary'>
                                <ExitToApp />
                            </IconButton>
                        </Link>

                        <ShareIconButton url={detailsPageAbsoluteUrl} />
                        <CopyIconButton url={detailsPageAbsoluteUrl} />
                        <AuthenticatedTemplate>
                            <IconButton
                                title={'Upload more files'}
                                aria-label={'Upload more files'}
                                onClick={handleUploadClick}
                                color='primary'
                                disabled={isUploading}
                            >
                                <CloudUpload />
                            </IconButton>
                            <input
                                ref={uploadFilesInputRef}
                                type='file'
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            <IconButton
                                title={'Click to delete'}
                                aria-label={'Click to delete'}
                                onClick={localOnDeleteClick}
                            >
                                <DeleteForeverOutlined color='error' />
                            </IconButton>
                        </AuthenticatedTemplate>
                    </Grid>
                </Grid >
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

