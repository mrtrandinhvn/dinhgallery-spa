import { ImageList, useMediaQuery } from '@mui/material';
import { default as GalleryItem } from './GalleryItem';
import json2mq from 'json2mq';
import GalleryList from './GalleryList';
import { useEffect, useState } from 'react';

interface IProps {
    urls: Array<string>,
    deleteItemHandle: (filename: string) => {},
}

function GalleryFolder({ folderId }: IProps) {
    const [urls, setUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data } = await listAllAsync();
            setUrls(data);
            setLoading(false);
        })();
    }, []);

    const isMobile = useMediaQuery(
        json2mq({
            maxWidth: 599,
        }),
    );

    return (
        <GalleryList urls={urls} deleteItemHandle={(fileName: string) => { }} />
    );
}

export default GalleryFolder;