import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        authority: 'https://login.microsoftonline.com/5586e39d-7f28-4e20-a8a3-aeff5c78d4e1', // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        clientId: 'df067dae-9637-4e07-8f84-5f022d984628',
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin + '/signout-microsoft',
    },
    cache: {
        cacheLocation: 'localStorage', // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: ['User.Read'],
};

export const tokenRequest = {
    scopes: [`${msalConfig.auth.clientId}/.default`],
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const getAccessTokenAsync = async () => {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error('No active account! Verify a user has been signed in and setActiveAccount has been called.');
    }

    const response = await msalInstance.acquireTokenSilent({
        ...tokenRequest,
        account: account,
    });
    return response.accessToken;
};