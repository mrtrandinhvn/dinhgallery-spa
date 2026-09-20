import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { getFoldersAsync, searchFoldersAsync } from '../apis/gallery-apis';
import GalleryFolder from '../components/GalleryFolder';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';

const GalleryPage = () => {
    const PAGE_SIZE = 10;

    const [folderIds, setFolderIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const isComposingRef = useRef(false);
    const [isComposing, setIsComposing] = useState(false);

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

    useEffect(() => {
        if (isComposing || isComposingRef.current) {
            return;
        }

        const trimmedSearchText = searchText.trim();
        if (!trimmedSearchText) {
            return;
        }

        let isCurrentSearch = true;
        const timeoutId = window.setTimeout(async () => {
            setIsSearching(true);
            const { data } = await searchFoldersAsync(trimmedSearchText);
            if (isCurrentSearch) {
                setFolderIds(data.map(folder => folder.id));
                setHasNextPage(false);
                setIsSearching(false);
            }
        }, 300);

        return () => {
            isCurrentSearch = false;
            window.clearTimeout(timeoutId);
        };
    }, [isComposing, searchText]);

    const handleSearchTextChange = useCallback(async (value: string) => {
        setSearchText(value);
        if (!value.trim() && !isComposingRef.current) {
            setIsSearching(false);
            setIsLoading(true);
            const { data } = await getFoldersAsync(1, PAGE_SIZE);
            setFolderIds(data.items.map(folder => folder.id));
            setHasNextPage(data.hasNextPage);
            setPageNumber(1);
            setIsLoading(false);
        }
    }, []);

    const handleCompositionStart = useCallback(() => {
        isComposingRef.current = true;
        setIsComposing(true);
    }, []);

    const handleCompositionEnd = useCallback(() => {
        isComposingRef.current = false;
        setIsComposing(false);
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
            <TextField
                fullWidth
                label="Search folders"
                margin="normal"
                onChange={event => void handleSearchTextChange(event.target.value)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="Type a folder name"
                value={searchText}
            />
            {isSearching && <CircularProgress size={20} />}
            {folderIds.map(folderId => <GalleryFolder key={folderId} folderId={folderId} deleteFolder={deleteFolderHandle} />)}
            {hasNextPage && !searchText.trim() && (
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
