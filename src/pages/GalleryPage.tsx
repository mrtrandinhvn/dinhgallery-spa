import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { deleteAsync, listAllAsync } from '../apis/gallery-apis';
import GalleryList from '../components/GalleryList';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';

const GalleryPage = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDataAsync = async () => {
        setLoading(true);
        const { data } = await listAllAsync();
        console.log(data);
        setUrls(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDataAsync();
    }, []);

    const deleteMediaHandle = async (mediaName: string) => {
        console.log(`delete media name: '${mediaName}'`);
        await deleteAsync(mediaName);
        await fetchDataAsync();
    };

    if (loading) {
        return <LoadingDiv />;
    }

    return (
        <PageBody>
            <Typography component='h2' variant='h2'>Gallery</Typography>
            <GalleryList urls={urls} deleteItemHandle={deleteMediaHandle} />
        </PageBody>
    );
};

export default GalleryPage;