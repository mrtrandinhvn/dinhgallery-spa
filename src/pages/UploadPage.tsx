import { Typography } from '@mui/material';
import React, { FormEvent, useRef, useState } from 'react';
import { deleteAsync, uploadAsync } from '../apis/gallery-apis';
import GalleryList from '../components/GalleryList';
import PageBody from '../components/PageBody';

function UploadPage() {
    const [messages, setMessages] = useState<string[]>([]);
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [savedFiles, setSavedFiles] = useState<string[]>([]);

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

        const result = await uploadAsync(files, {
            onUploadProgress: function ({ lengthComputable, loaded, total }) {
                // Do whatever you want with the native progress event
                setMessages([...messages, 'uploading...']);
                if (lengthComputable) {
                    console.log(`${loaded}/${total}`);
                    setMessages([`uploading... ${Number(loaded * 100 / total).toFixed(2)}%`]);
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
        console.log(`delete media name: '${mediaName}'`);
        await deleteAsync(mediaName);
        setSavedFiles(savedFiles.filter(url => url.split('/').pop() !== mediaName));
    };

    const hasFiles = !!files && files.length > 0;
    const hasSavedFiles = savedFiles.length > 0;

    return (
        <PageBody>
            <Typography component='h2' variant='h2'>Upload to gallery</Typography>

            <form id='videoUploadForm' ref={formRef} className="row g-3" onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Select a video</label>
                    <input className="form-control" type="file" id="fileInput" name="files"
                        accept="video/*, image/png, image/jpeg" onInput={onFieldChange}
                        multiple disabled={uploading} />
                </div>
                <div className="mb-3">
                    <button type="submit" className={`btn btn-primary mb-3 me-1 ${!hasFiles || uploading ? 'disabled' : ''}`}
                        disabled={!hasFiles || uploading}>Upload</button>
                    <button type="button" className={`btn btn-danger mb-3 ${!hasFiles || uploading ? 'disabled' : ''}`} onClick={onClearClick}
                        disabled={!hasFiles || uploading}>Clear</button>
                </div>
                {messages.length > 0 && <pre>{messages}</pre>}
                {hasFiles ? (
                    Array.from(files).map(file => (
                        <pre key={file.name}>
                            <div>Filename: {file.name}</div>
                            <div>Filetype: {file.type}</div>
                            <div>Size in bytes: {file.size.toLocaleString()}</div>
                        </pre>
                    ))
                ) : (
                    <p>Select a file to show details</p>
                )}
            </form >
            <div className='gallery'>
                {hasSavedFiles && <GalleryList urls={savedFiles} deleteItemHandle={deleteMediaHandle} />}
            </div>
        </PageBody>
    );
}

export default UploadPage;