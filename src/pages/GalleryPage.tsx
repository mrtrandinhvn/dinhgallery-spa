import React, { useEffect, useState } from 'react';
import { deleteAsync, listAllAsync } from '../apis/gallery-apis';
import GalleryList from '../components/GalleryList';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';

const GalleryPage = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDataAsync = async () => {
        setLoading(true);
        const { data } = await listAllAsync();
        setUrls(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDataAsync();
    }, []);

    const deleteMediaHandle = async (mediaName: string) => {
        await deleteAsync(mediaName);
        await fetchDataAsync();
    };

    if (loading) {
        return <LoadingDiv />;
    }

    return (
        <PageBody>
            <PageHeading heading='Gallery' />
            <GalleryList urls={urls} deleteItemHandle={deleteMediaHandle} />
        </PageBody>
    );
};

export default GalleryPage;