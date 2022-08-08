import React, { useEffect, useState } from 'react';
import { DeleteForever } from '@mui/icons-material';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteAsync, getDetailsAsync } from '../apis/gallery-apis';
import LoadingDiv from '../components/LoadingDiv';
import PageBody from '../components/PageBody';

function MediaDetailsPage() {
    const [publicUrl, setPublicUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { fileName } = useParams();

    if (!fileName) {
        throw new Error(`Invalid url. Could not detect file name in this url: '${window.location.href}'`);
    }

    const fileExtension: string | undefined = fileName.split('.')?.pop()?.toUpperCase();
    if (!fileExtension) {
        throw new Error(`Could not detect file extension in file name: '${fileName}'`);
    }

    useEffect(() => {
        const fetchDataAsync = async () => {
            setLoading(true);
            const { data } = await getDetailsAsync(fileName);
            setPublicUrl(data);
            console.log(data);
            setLoading(false);
        };

        fetchDataAsync();
    }, [fileName]);


    const onCardClick = () => {
        console.log('click');
    };

    const onDeleteClick = async () => {
        if (window.confirm('Deleted media is lost forever. Are you sure you want to do this?')) {
            await deleteAsync(fileName);
            navigate('/');
        }
    };

    if (loading) {
        return <LoadingDiv />;
    }

    const imageExtensions = ['JPG', 'JPEG', 'PNG'];
    const isImage = imageExtensions.indexOf(fileExtension) >= 0;
    const previewEl = isImage ?
        (<CardMedia
            component='img'
            height="140"
            src={publicUrl}
            alt={fileName}
            loading='lazy'
        />)
        :
        (<CardMedia
            component='video'
            height="140"
            src={publicUrl}
            controls
            preload='auto'
        />);
    return (
        <PageBody>
            <Typography component='h2' variant='h2'>{fileName}</Typography>
            <div className='pageBody'>
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea onClick={onCardClick}>
                        {previewEl}
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="error" startIcon={<DeleteForever />} onClick={onDeleteClick}>
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            </div>
        </PageBody>
    );
}

export default MediaDetailsPage;