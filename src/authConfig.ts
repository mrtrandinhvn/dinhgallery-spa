import { EventType, PublicClientApplication, type AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';

// Storage keys for remember-me functionality
const REMEMBER_ME_KEY = 'msal_remember_me';
const SESSION_EXPIRY_KEY = 'msal_session_expiry';

// Session timeout: 8 hours (in milliseconds)
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

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

// Remember-me helper functions
export const setRememberMe = (remember: boolean) => {
    try {
        if (remember) {
            localStorage.setItem(REMEMBER_ME_KEY, 'true');
            // Set session expiry to null when "remember me" is checked (no timeout)
            localStorage.removeItem(SESSION_EXPIRY_KEY);
        } else {
            localStorage.setItem(REMEMBER_ME_KEY, 'false');
            // Set session expiry time
            const expiryTime = Date.now() + SESSION_TIMEOUT;
            localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
        }
    } catch (error) {
        console.error('Failed to set remember-me preference:', error);
    }
};

export const getRememberMe = (): boolean => {
    try {
        return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    } catch (error) {
        console.error('Failed to get remember-me preference:', error);
        return false;
    }
};

const isSessionExpired = (): boolean => {
    try {
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
        if (!expiryTime) {
            // No expiry set means "remember me" is enabled
            return false;
        }
        return Date.now() > parseInt(expiryTime, 10);
    } catch (error) {
        console.error('Failed to check session expiry:', error);
        return false;
    }
};

const clearExpiredSession = async () => {
    try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            // Clear all accounts
            for (const account of accounts) {
                await msalInstance.clearCache({ account });
            }
        }
        // Clear remember-me settings
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);
        console.log('Expired session cleared');
    } catch (error) {
        console.error('Failed to clear expired session:', error);
    }
};

export const getAccessTokenAsync = async () => {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error('No active account! Verify a user has been signed in and setActiveAccount has been called.');
    }

    try {
        const response = await msalInstance.acquireTokenSilent({
            ...tokenRequest,
            account: account,
        });
        return response.accessToken;
    } catch (error) {
        // Handle token refresh failures
        if (error instanceof InteractionRequiredAuthError) {
            console.warn('Silent token acquisition failed, user interaction required');
            // Redirect to login - this will preserve the current URL to return to after auth
            try {
                await msalInstance.acquireTokenRedirect({
                    ...tokenRequest,
                    account: account,
                });
            } catch (redirectError) {
                console.error('Token redirect failed:', redirectError);
                throw new Error('Authentication required. Please sign in again.');
            }
        }

        console.error('Token acquisition failed:', error);
        throw error;
    }
};

export const initializeAuth = async () => {
    try {
        // Initialize MSAL instance (required when using localStorage)
        await msalInstance.initialize();
    } catch (error) {
        console.error('Failed to initialize MSAL:', error);
        // Try to recover by clearing potentially corrupted cache
        try {
            localStorage.removeItem('msal.account.keys');
            localStorage.removeItem('msal.token.keys');
            console.log('Cleared potentially corrupted MSAL cache, please refresh the page');
        } catch (clearError) {
            console.error('Failed to clear cache:', clearError);
        }
        throw new Error('Authentication initialization failed. Please clear your browser cache and try again.');
    }

    // Check if session has expired (only if "remember me" is not enabled)
    if (isSessionExpired()) {
        console.log('Session expired, clearing cached credentials');
        await clearExpiredSession();
        return; // Don't set active account, user needs to sign in again
    }

    // Default to using the first account if no account is active on page load
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        // Account selection logic is app dependent. Adjust as needed for different use cases.
        console.log('Set active account on page load');
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    // Optional - This will update account state if a user signs in from another tab or window
    try {
        msalInstance.enableAccountStorageEvents();
    } catch (error) {
        console.warn('Failed to enable account storage events:', error);
        // Non-critical, continue initialization
    }

    msalInstance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event?.payload) {
            console.log('Set active account after signin');
            const account = event.payload as AccountInfo;
            msalInstance.setActiveAccount(account);

            // Update session expiry based on remember-me preference
            const rememberMe = getRememberMe();
            if (!rememberMe) {
                // Set new session expiry
                const expiryTime = Date.now() + SESSION_TIMEOUT;
                try {
                    localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
                } catch (error) {
                    console.error('Failed to set session expiry:', error);
                }
            }
        }
    });
};