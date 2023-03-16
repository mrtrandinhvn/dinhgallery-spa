export const mobileShareAsync = async ({ title, text, url }: { title?: string, text?: string, url: string }) => {
    if (navigator.share) {
        return navigator.share({
            title,
            url,
            text,
        });
    } else {
        return Promise.reject(new Error('Your browser does not support web share api.'));
    }
};

export const getAbsoluteUrl = (url: string) => url.startsWith('http') ? url : `${window.location.origin}${url}`;
