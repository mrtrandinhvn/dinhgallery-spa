import { useCallback, useEffect, useState } from 'react';
import { getFoldersAsync } from '../apis/gallery-apis';
import GalleryFolder from '../components/GalleryFolder';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';

const GalleryPage = () => {
    const [folderIds, setFolderIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setIsLoading(true);
            const { data } = await getFoldersAsync();
            setFolderIds(data.map(x => x.id));
            setIsLoading(false);
        };

        fetchDataAsync();
    }, []);

    const deleteFolderHandle = useCallback((folderId: string) => {
        setFolderIds(prevFolderIds => prevFolderIds.filter(x => x !== folderId));
    }, []);

    if (isLoading) {
        return <LoadingDiv />;
    }

    return (
        <PageBody>
            <PageHeading heading='Gallery' />
            {folderIds.map(folderId => <GalleryFolder key={folderId} folderId={folderId} deleteFolder={deleteFolderHandle} />)}
        </PageBody>
    );
};

export default GalleryPage;