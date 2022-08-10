import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getAccessTokenAsync } from '../authConfig';
const { REACT_APP_GALLERY_ENDPOINT } = process.env;

interface IApiResponse<T> {
    success: boolean,
    data: T,
    messages: Array<string>,
}

const buildRequestConfigWithAuthorization = async (additionalConfig?: AxiosRequestConfig) => ({
    ...additionalConfig,
    headers: {
        'Authorization': `Bearer ${await getAccessTokenAsync()}`,
    },
});

const uploadAsync = async (files: FileList, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<string[]>> => {
    let response = null, messages = ['Upload completed.'];
    try {
        response = await axios.postForm(`${REACT_APP_GALLERY_ENDPOINT}/gallery`, {
            'files[]': files,
        }, await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: response && response.data,
        data: (response && response.data) || new Array<string>(),
        messages,
    };
};

const deleteAsync = async (fileName: string, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<any>> => {
    let response = null, messages = ['Upload completed.'];
    try {
        response = await axios.delete(`${REACT_APP_GALLERY_ENDPOINT}/gallery/${fileName}`, await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: response && response.data,
        data: null,
        messages,
    };
};

const listAllAsync = async (axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<string[]>> => {
    let response = null, messages = new Array<string>();
    try {
        response = await axios.get(REACT_APP_GALLERY_ENDPOINT + '/gallery', await buildRequestConfigWithAuthorization(axiosRequestConfig));
    } catch (error: any) {
        messages = handleError(error);
    }

    return {
        success: !!response,
        data: (response && response.data) || new Array<string>(),
        messages,
    };
};

const getDetailsAsync = async (fileName: string, axiosRequestConfig?: AxiosRequestConfig): Promise<IApiResponse<string>> => {
    let response = null, messages = new Array<string>();
    try {
        response = await axios.get(REACT_APP_GALLERY_ENDPOINT + '/gallery/' + fileName, {
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

export {
    uploadAsync,
    deleteAsync,
    listAllAsync,
    getDetailsAsync,
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
