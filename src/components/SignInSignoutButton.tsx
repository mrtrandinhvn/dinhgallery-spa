import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material';
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