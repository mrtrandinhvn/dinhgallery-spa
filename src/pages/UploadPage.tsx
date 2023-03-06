import { Clear, Upload } from '@mui/icons-material';
import { Button, Grid, Typography, useMediaQuery } from '@mui/material';
import json2mq from 'json2mq';
import React, { FormEvent, useRef, useState } from 'react';
import { deleteAsync, uploadAsync } from '../apis/gallery-apis';
import GalleryFolder from '../components/GalleryFolder';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';

function UploadPage() {
    const [messages, setMessages] = useState<string[]>([]);
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [savedFiles, setSavedFiles] = useState<string[]>([]);

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

        if (!files) {
            setMessages(['Please select at least one file.']);
            return;
        }

        const result = await uploadAsync(files, null, {
            onUploadProgress: function ({ lengthComputable, loaded, total }) {
                // Do whatever you want with the native progress event
                setMessages([...messages, 'uploading...']);
                if (lengthComputable) {
                    const mess = [`uploading... ${Number(loaded * 100 / total).toFixed(2)}%`];
                    if (loaded === total) {
                        mess.push('Server is saving your media.');
                    }

                    setMessages(mess);
                }
            },
        });

        setMessages(result.messages);
        if (result.success) {
            setSavedFiles(result.data);
        } else {
            setSavedFiles([]);
        }

        setUploading(false);
        clearFiles();
    };

    const clearFiles = () => {
        setFiles(null);
        formRef?.current?.reset();
    };

    const onClearClick = () => {
        setMessages([]);
        clearFiles();
    };

    const deleteMediaHandle = async (mediaName: string) => {
        const { success, messages } = await deleteAsync(mediaName);
        if (success) {
            setSavedFiles(savedFiles.filter(url => url.split('/').pop() !== mediaName));
        } else {
            alert(messages);
        }
    };

    const hasFiles = !!files && files.length > 0;
    const hasSavedFiles = savedFiles.length > 0;

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
                    xs={12}
                    item
                >
                    <Button
                        variant="outlined"
                        component="label"
                        disabled={uploading}
                    >
                        Select files
                        <input hidden type="file" name="files"
                            accept="video/*, image/*, audio/*" onInput={onFieldChange}
                            multiple disabled={uploading} />
                    </Button>
                </Grid>
                <Grid
                    xs={12}
                    item
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

                <Grid item xs={12}>
                    {messages.length > 0 && <pre>{messages.map(x => x + '\r\n')}</pre>}
                </Grid>

                <Grid item xs={12} container columns={isMobile ? 4 : files?.length === 1 ? 4 : files?.length === 2 ? 8 : files?.length || 0 >= 3 ? 12 : 12}>
                    {hasFiles && (
                        <>
                            <Grid item xs={12}>
                                <Typography>Selected files details</Typography>
                            </Grid>
                            {Array.from(files).map(file => (
                                <Grid key={file.name} item xs={4}>
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
                {/* {hasSavedFiles && <GalleryFolder urls={savedFiles} deleteItemHandle={deleteMediaHandle} />} */}
            </div>
        </PageBody>
    );
}

export default UploadPage;