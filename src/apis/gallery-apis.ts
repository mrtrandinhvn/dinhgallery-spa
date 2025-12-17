import {
    deleteGalleryFileById,
    deleteGalleryFolderById,
    getGallery,
    getGalleryFileById,
    getGalleryFolderById,
    postGallery,
    postGalleryFolderByFolderIdFiles,
} from '../client/sdk.gen';
import type { FileDetailsReadModel, FolderDetailsReadModel } from '../client/types.gen';
import type { AxiosProgressEvent } from 'axios';

interface IApiResponse<T> {
    success: boolean,
    data: T,
    messages: Array<string>,
}

export interface IFileDetails {
    id: string,
    downloadUri: string,
    displayName: string,
    createdAtUtc: Date,
}

export interface IFolderDetails {
    createdAtUtc: string,
    displayName: string,
    files: Array<IFileDetails>,
    id: string,
}

function mapFileDetails(file: FileDetailsReadModel): IFileDetails {
    return {
        id: file.id?.toString() || '', 
        downloadUri: file.downloadUri || '',
        displayName: file.displayName || '',
        createdAtUtc: new Date(file.createdAtUtc || ''),
    };
}

function mapFolderDetails(folder: FolderDetailsReadModel): IFolderDetails {
    return {
        id: folder.id?.toString() || '',
        displayName: folder.displayName || '',
        createdAtUtc: folder.createdAtUtc || '',
        files: (folder.files || []).map(mapFileDetails),
    };
}

const uploadAsync = async (
    files: FileList,
    folderDisplayName: string | null,
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }): Promise<IApiResponse<string>> => {
    let messages = ['Upload completed.'];
    try {
        const response = await postGallery({
            body: {
                folderDisplayName: folderDisplayName || undefined,
                files: Array.from(files),
            },
            ...options,
        });

        return {
            success: true,
            data: response.data?.toString() || '',
            messages,
        };
    } catch (error: unknown) {
        messages = handleError(error);
        return {
            success: false,
            data: '',
            messages,
        };
    }
};

const uploadFilesToFolderAsync = async (
    folderId: string,
    files: FileList,
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }): Promise<IApiResponse<string>> => {
    let messages = ['Upload completed.'];
    try {
        const response = await postGalleryFolderByFolderIdFiles({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            path: { folderId: folderId as any },
            body: {
                files: Array.from(files),
            },
            ...options,
        });

        return {
            success: true,
            data: response.data?.toString() || '',
            messages,
        };
    } catch (error: unknown) {
        messages = handleError(error);
        return {
            success: false,
            data: '',
            messages,
        };
    }
};

const deleteFileAsync = async (fileId: string): Promise<IApiResponse<boolean>> => {
    let messages = ['Delete completed.'];
    try {
        await deleteGalleryFileById({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            path: { id: fileId as any },
        });

        return {
            success: true,
            data: true,
            messages,
        };
    } catch (error: unknown) {
        messages = handleError(error);
        return {
            success: false,
            data: false,
            messages,
        };
    }
};

const deleteFolderAsync = async (folderId: string): Promise<IApiResponse<boolean>> => {
    let messages = ['Delete completed.'];
    try {
        await deleteGalleryFolderById({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            path: { id: folderId as any },
        });

        return {
            success: true,
            data: true,
            messages,
        };
    } catch (error: unknown) {
        messages = handleError(error);
        return {
            success: false,
            data: false,
            messages,
        };
    }
};

const getFoldersAsync = async (): Promise<IApiResponse<IFolderDetails[]>> => {
    let messages = new Array<string>();
    try {
        const response = await getGallery();
        const folders = (response.data as FolderDetailsReadModel[] || []).map(mapFolderDetails);

        return {
            success: true,
            data: folders,
            messages,
        };
    } catch (error: unknown) {
        messages = handleError(error);
        return {
            success: false,
            data: [],
            messages,
        };
    }
};

const getFileDetailsAsync = async (fileId: string): Promise<IApiResponse<IFileDetails>> => {
    let messages = new Array<string>();
    try {
        const response = await getGalleryFileById({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            path: { id: fileId as any },
        });
        const file = mapFileDetails(response.data as FileDetailsReadModel);

        return {
            success: true,
            data: file,
            messages,
        };
    } catch (error: unknown) {
        messages = handleError(error);
        return {
            success: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: null as any,
            messages,
        };
    }
};

const getFolderDetailsAsync = async (folderId: string): Promise<IApiResponse<IFolderDetails>> => {
    let messages = new Array<string>();
    try {
        const response = await getGalleryFolderById({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            path: { id: folderId as any },
        });
        const folder = mapFolderDetails(response.data as FolderDetailsReadModel);

        return {
            success: true,
            data: folder,
            messages,
        };
    } catch (error: unknown) {
        messages = handleError(error);
        return {
            success: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: null as any,
            messages,
        };
    }
};

function handleError(error: unknown): string[] {
    if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status?: number }).status;
        switch (status) {
            case 401:
                return ['Unauthorized. You need to sign in first.', JSON.stringify(error)];
            case 403:
                return ['Forbidden. You do not have access to this app, please ask site\'s admin for his approval.', JSON.stringify(error)];
        }
    }

    console.error(error);
    return ['Some errors occurred with the api.', JSON.stringify(error)];
}

export {
    uploadAsync,
    uploadFilesToFolderAsync,
    deleteFileAsync,
    getFileDetailsAsync,
    getFoldersAsync,
    getFolderDetailsAsync,
    deleteFolderAsync,
};