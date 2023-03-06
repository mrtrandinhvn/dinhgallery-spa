import React, { useEffect, useState } from 'react';
import { listAllAsync } from '../apis/gallery-apis';
import GalleryFolder from '../components/GalleryFolder';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';

const GalleryPage = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataAsync = async () => {
        setIsLoading(true);
        const { data } = await listAllAsync();
        setUrls(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDataAsync();
    }, []);

    if (isLoading) {
        return <LoadingDiv />;
    }

    return (
        <PageBody>
            <PageHeading heading='Gallery' />
            <GalleryFolder folderId='af073b5a-1f84-4904-9b63-6735be301e3a' />
        </PageBody>
    );
};

export default GalleryPage;