import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Login, Logout } from '@mui/icons-material';
import { Button, SxProps, Theme } from '@mui/material';
import React from 'react';
import { loginRequest } from '../authConfig';

interface ISignInButtonProp {
    sx?: SxProps<Theme> | undefined,
}

const SignInSignoutButton = (props: ISignInButtonProp) => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest);
    };

    const handleLogout = () => {
        instance.logoutRedirect();
    };

    return (
        <>
            <UnauthenticatedTemplate>
                <Button component='a' onClick={handleLogin} {...props} startIcon={<Login />}>Sign in</Button>
            </UnauthenticatedTemplate>

            <AuthenticatedTemplate>
                <Button component='a' onClick={handleLogout} {...props} startIcon={<Logout />}>Sign out</Button>
            </AuthenticatedTemplate>
        </>
    );
};

export default SignInSignoutButton;