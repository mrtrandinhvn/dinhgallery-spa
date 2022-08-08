import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Button, SxProps, Theme } from '@mui/material';
import React from 'react';
import { loginRequest } from '../authConfig';

interface ISignInButtonProp {
    sx?: SxProps<Theme> | undefined,
}

const SignInSignoutButton = (props: ISignInButtonProp) => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest);
    };

    const handleLogout = () => {
        instance.logoutRedirect();
    };

    return (
        <>
            {
                !isAuthenticated ?
                    <Button component='a' onClick={handleLogin} {...props}>Sign in</Button >
                    :
                    <Button component='a' onClick={handleLogout} {...props}>Sign out</Button>
            }
        </>
    );
};

export default SignInSignoutButton;