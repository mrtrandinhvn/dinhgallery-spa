import { ContentCopy, DeleteForeverOutlined, Done } from '@mui/icons-material';
import { IconButton, ImageListItem, ImageListItemBar, Zoom } from '@mui/material';
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
    const detailsPage = `/details/${fileName}`;
    const displayedFileName = decodeURI(fileName);

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
        <img src={url} alt="Default alt" loading='lazy' />
        :
        <video src={url} controls preload="metadata" style={{ width: '100%' }} />;
    return (
        <ImageListItem>
            {previewEl}
            <ImageListItemBar
                title={
                    <div style={{ display: 'inherit', alignItems: 'center', width: '100%' }}>
                        {
                            isImage ?
                                <a href={url} target="_blank" rel="noreferrer" title={displayedFileName}>{displayedFileName}</a>
                                : <Link to={detailsPage} title={displayedFileName}>{decodeURI(displayedFileName)}</Link>
                        }
                        <div style={{ minWidth: '80px', textAlign: 'right' }}>
                            <IconButton
                                title={copied ? 'Copied' : 'Click to copy to clipboard'}
                                aria-label={copied ? 'Copied' : 'Click to copy to clipboard'}
                                onClick={onCopyToClipboardClick}
                            >
                                <Zoom in={copied} style={{ position: 'absolute' }}>
                                    <Done color='success' />
                                </Zoom>
                                <Zoom in={!copied}>
                                    <ContentCopy color='action' />
                                </Zoom>
                            </IconButton>
                            <IconButton
                                title={'Click to delete'}
                                aria-label={'Click to delete'}
                                onClick={localOnDeleteClick}
                            >
                                <DeleteForeverOutlined color='error' />
                            </IconButton>
                        </div>
                    </div>
                }
                position='below'
            />
        </ImageListItem >
    );
}

export default GalleryItem;