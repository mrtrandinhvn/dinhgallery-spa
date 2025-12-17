import Clear from '@mui/icons-material/Clear';
import Upload from '@mui/icons-material/Upload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import json2mq from 'json2mq';
import { type ChangeEvent, type FormEvent, useCallback, useRef, useState } from 'react';
import { uploadAsync } from '../apis/gallery-apis';
import GalleryFolder from '../components/GalleryFolder';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';
import CloudUpload from '@mui/icons-material/CloudUpload';

export default function UploadPage() {
    const [messages, setMessages] = useState<string[]>([]);
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [savedFolderId, setSavedFolderId] = useState<string | null>(null);
    const [folderName, setFolderName] = useState<string>('');

    const isMobile = useMediaQuery(
        json2mq({
            maxWidth: 599,
        }),
    );

    const formRef = useRef<HTMLFormElement>(null);

    const onFieldChange = (e: FormEvent<HTMLInputElement>) => {
        const target = (e.target as HTMLInputElement);
        if (!target) {
            throw new Error('I have no idea why target is null. Check the event binding?');
        }

        setFiles(target.files);
        setMessages([]);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        setUploadProgress(0);
        setMessages([]);

        if (!files) {
            setMessages(['Please select at least one file.']);
            setUploading(false);
            return;
        }

        const result = await uploadAsync(files, folderName, {
            onUploadProgress: function (progressEvent) {
                const { loaded, total } = progressEvent;
                if (total) {
                    const percentCompleted = Math.round((loaded * 100) / total);
                    setUploadProgress(percentCompleted);
                }
            },
        });

        setMessages(result.messages);
        if (result.success) {
            setSavedFolderId(result.data);
        } else {
            setSavedFolderId(null);
        }

        setUploading(false);
        setUploadProgress(0);
        resetForm();
    };

    const deleteFolderHandle = useCallback(() => {
        setSavedFolderId(null);
    }, []);

    const onFolderNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const resetForm = () => {
        setFiles(null);
        setFolderName('');
        formRef?.current?.reset();
    };

    const onClearClick = () => {
        setMessages([]);
        resetForm();
    };

    const hasFiles = !!files && files.length > 0;
    const hasSavedFiles = !!savedFolderId;

    return (
        <PageBody
            style={{ textAlign: 'center' }}
        >
            <PageHeading heading='Upload to gallery' />
            <Grid
                component={'form'}
                autoComplete='off'
                ref={formRef}
                onSubmit={onSubmit}
                rowSpacing={2}
                container
                sx={{ marginTop: 0 }}
            >
                <Grid
                    size={{ xs: 12 }}
                >
                    <TextField
                        label="Folder name (Optional)"
                        value={folderName}
                        onChange={onFolderNameChange}
                        name="folderName"
                        inputProps={{ maxLength: 250 }}
                    />
                </Grid>
                <Grid
                    size={{ xs: 12 }}
                >
                    <input
                        id='fileInput'
                        hidden
                        type="file"
                        name="files"
                        onInput={onFieldChange}
                        multiple disabled={uploading} />
                    <label htmlFor='fileInput'>
                        <Button
                            startIcon={<CloudUpload />}
                            variant="outlined"
                            disabled={uploading}
                            component="span"
                        >
                            Select files
                        </Button>
                    </label>
                </Grid>
                <Grid
                    size={{ xs: 12 }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        startIcon={<Upload />}
                        type='submit'
                        disabled={!hasFiles || uploading}
                        style={{ marginRight: '0.5rem' }}
                    >
                        Upload
                    </Button>

                    <Button
                        variant='contained'
                        color='inherit'
                        startIcon={<Clear />}
                        disabled={!hasFiles || uploading}
                        onClick={onClearClick}
                    >
                        Clear
                    </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    {uploading && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                                Uploading files... {uploadProgress}%
                            </Typography>
                            <LinearProgress variant='determinate' value={uploadProgress} />
                        </Box>
                    )}
                    {!uploading && messages.length > 0 && <pre>{messages.map(x => x + '\r\n')}</pre>}
                </Grid>

                <Grid size={{ xs: 12 }} container columns={isMobile ? 4 : files?.length === 1 ? 4 : files?.length === 2 ? 8 : files?.length || 0 >= 3 ? 12 : 12}>
                    {hasFiles && (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Typography>Selected files details</Typography>
                            </Grid>
                            {Array.from(files).map(file => (
                                <Grid key={file.name} size={{ xs: 4 }}>
                                    <pre>
                                        <div>Filename: {file.name}</div>
                                        <div>Filetype: {file.type}</div>
                                        <div>Size in bytes: {file.size.toLocaleString()}</div>
                                    </pre>
                                </Grid>
                            ))}
                        </>
                    )}
                </Grid>
            </Grid>
            <div className='gallery'>
                {hasSavedFiles && <GalleryFolder folderId={savedFolderId} deleteFolder={deleteFolderHandle} />}
            </div>
        </PageBody>
    );
}

