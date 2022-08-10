import { ImageList, useMediaQuery } from '@mui/material';
import { default as GalleryItem } from './GalleryItem';
import json2mq from 'json2mq';

interface IProps {
    urls: Array<string>,
    deleteItemHandle: (filename: string) => {},
}

function GalleryList({ urls, deleteItemHandle }: IProps) {
    const isMobile = useMediaQuery(
        json2mq({
            maxWidth: 599,
        }),
    );

    return (
        <ImageList
            sx={{ width: '100%', margin: 0, flex: '1 1', overflowY: 'initial' }}
            variant={isMobile ? 'standard' : 'woven'}
            cols={isMobile ? 1 : 3}
            gap={8}>
            {
                urls.map(url => (
                    <GalleryItem
                        key={url}
                        url={url}
                        deleteItem={deleteItemHandle} />),
                )}
        </ImageList>
    );
}

export default GalleryList;