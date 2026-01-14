import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { getFoldersAsync } from '../apis/gallery-apis';
import GalleryFolder from '../components/GalleryFolder';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';

const GalleryPage = () => {
    const PAGE_SIZE = 1;

    const [folderIds, setFolderIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setIsLoading(true);
            const { data } = await getFoldersAsync(1, PAGE_SIZE);
            setFolderIds(data.items.map(x => x.id));
            setHasNextPage(data.hasNextPage);
            setPageNumber(1);
            setIsLoading(false);
        };

        fetchDataAsync();
    }, []);

    const deleteFolderHandle = useCallback((folderId: string) => {
        setFolderIds(prevFolderIds => prevFolderIds.filter(x => x !== folderId));
    }, []);

    const handleLoadMoreAsync = async () => {
        setIsLoadingMore(true);
        const nextPage = pageNumber + 1;
        const { data } = await getFoldersAsync(nextPage, PAGE_SIZE);
        setFolderIds(prev => [...prev, ...data.items.map(x => x.id)]);
        setHasNextPage(data.hasNextPage);
        setPageNumber(nextPage);
        setIsLoadingMore(false);
    };

    if (isLoading) {
        return <LoadingDiv />;
    }

    return (
        <PageBody>
            <PageHeading heading='Gallery' />
            {folderIds.map(folderId => <GalleryFolder key={folderId} folderId={folderId} deleteFolder={deleteFolderHandle} />)}
            {hasNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={handleLoadMoreAsync}
                        disabled={isLoadingMore}
                        startIcon={isLoadingMore ? <CircularProgress size={20} /> : null}
                    >
                        {isLoadingMore ? 'Loading...' : 'Load More'}
                    </Button>
                </Box>
            )}
        </PageBody>
    );
};

export default GalleryPage;