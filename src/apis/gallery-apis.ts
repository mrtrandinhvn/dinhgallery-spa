import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getAccessTokenAsync } from '../authConfig';
const { REACT_APP_GALLERY_ENDPOINT } = process.env;

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

const buildRequestConfigWithAuthorization = async (additionalConfig?: AxiosRequestConfig) => ({
    ...additionalConfig,
    headers: {
        'Authorization': `Bearer ${await getAccessTokenAsync()}`,
    },
});

const uploadAsync = async (files: FileList, folderDisplayName: string | null, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<string>> => {
    let response = null, messages = ['Upload completed.'];
    try {
        response = await axios.postForm(`${REACT_APP_GALLERY_ENDPOINT}/gallery`, {
            'files[]': files,
            folderDisplayName,
        }, await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: response && response.data,
        data: (response && response.data) || null,
        messages,
    };
};

const deleteFileAsync = async (fileId: string, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<boolean>> => {
    let response = null, messages = ['Upload completed.'];
    try {
        response = await axios.delete(`${REACT_APP_GALLERY_ENDPOINT}/gallery/file/${fileId}`, await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: response && response.data,
        data: response?.data,
        messages,
    };
};

const deleteFolderAsync = async (folderId: string, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<boolean>> => {
    let response = null, messages = ['Upload completed.'];
    try {
        response = await axios.delete(`${REACT_APP_GALLERY_ENDPOINT}/gallery/folder/${folderId}`, await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: response && response.data,
        data: response?.data,
        messages,
    };
};

const getFoldersAsync = async (axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<IFolderDetails[]>> => {
    let response = null, messages = new Array<string>();
    try {
        response = await axios.get(REACT_APP_GALLERY_ENDPOINT + '/gallery', await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: !!response,
        data: (response && response.data) || new Array<IFolderDetails>(),
        messages,
    };
};

const getFileDetailsAsync = async (fileId: string, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<IFileDetails>> => {
    let response = null, messages = new Array<string>();
    try {
        response = await axios.get(REACT_APP_GALLERY_ENDPOINT + '/gallery/file/' + fileId, {
            ...axiosRequestConfig,
        });
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: !!response,
        data: (response && response.data) || null,
        messages,
    };
};

const getFolderDetailsAsync = async (folderId: string, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<IFolderDetails>> => {
    let response = null, messages = new Array<string>();
    try {
        response = await axios.get(REACT_APP_GALLERY_ENDPOINT + '/gallery/folder/' + folderId, await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: !!response,
        data: (response && response.data) || null,
        messages,
    };
};

function handleError(error: any): string[] {
    const axiosError = error as AxiosError;
    switch (axiosError?.response?.status) {
        case 401:
            return ['Unauthorized. You need to sign in first.', JSON.stringify(axiosError.response.data)];
        case 403:
            return ['Forbidden. You do not have access to this app, please ask site\'s admin for his approval.', JSON.stringify(axiosError.response.data)];

    }

    return ['Some errors occurred with the api.', error.toString()];
}

export {
    uploadAsync,
    deleteFileAsync,
    getFileDetailsAsync,
    getFoldersAsync,
    getFolderDetailsAsync,
    deleteFolderAsync,
};