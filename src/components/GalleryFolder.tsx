import { ImageList, Typography, useMediaQuery } from '@mui/material';
import { default as GalleryItem } from './GalleryItem';
import json2mq from 'json2mq';
import { useCallback, useEffect, useState } from 'react';
import { getFolderFiles, IFileDetails } from '../apis/gallery-apis';
import LoadingDiv from './LoadingDiv';

interface IProps {
    folderId: string,
}

interface IFolderDetailsState {
    createdAtUtc?: Date | null,
    displayName: string,
}

function GalleryFolder({ folderId }: IProps) {
    const [folderDetails, setFolderDetails] = useState<IFolderDetailsState>({
        createdAtUtc: null,
        displayName: '',
    });

    const [files, setFiles] = useState(new Array<IFileDetails>());
    const [isLoading, setIsLoading] = useState(true);

    const deleteItemHandle = useCallback((fileId: string) => {
        console.log(fileId);
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const { data } = await getFolderFiles(folderId);
            if (data) {
                console.log(data);
                setFolderDetails({
                    displayName: data.displayName,
                    createdAtUtc: new Date(data.createdAtUtc),
                });
                setFiles(data.files);
            }

            setIsLoading(false);
        })();
    }, [folderId]);


    const isMobile = useMediaQuery(
        json2mq({
            maxWidth: 599,
        }),
    );

    if (isLoading) {
        return <LoadingDiv />;
    }

    return (
        <>
            <Typography variant='h5'>
                {folderDetails.displayName}
            </Typography>
            <Typography variant='subtitle1'>
                Created at: {folderDetails.createdAtUtc?.toLocaleString('en-GB')}
            </Typography>

            <ImageList
                sx={{ width: '100%', margin: 0, flex: '1 1', overflowY: 'initial' }}
                // variant={isMobile ? 'standard' : 'masonry'}
                cols={isMobile ? 1 : 3}
                gap={8}>
                {
                    files.map(fileDetails => (
                        <GalleryItem
                            key={fileDetails.id}
                            details={fileDetails}
                            deleteItem={deleteItemHandle} />),
                    )
                }
            </ImageList>
        </>
    );
}

export default GalleryFolder;