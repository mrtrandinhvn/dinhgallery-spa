import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GalleryFolder from '../components/GalleryFolder';
import PageBody from '../components/PageBody';

const FolderDetailsPage = () => {
    const { id } = useParams();
    if (!id) {
        throw new Error('User supposed to be routed to 404 page instead. Please check routing again.');
    }

    const navigate = useNavigate();
    const deleteFolderHandle = useCallback((folderId: string) => {
        navigate('/');
    }, [navigate]);

    return (
        <PageBody>
            {id && <GalleryFolder folderId={id} deleteFolder={deleteFolderHandle} />}
        </PageBody>
    );
};

export default FolderDetailsPage;