import { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import SignInDialog from './SignInDialog';
import type { SxProps, Theme } from '@mui/material/styles';

interface ISignInButtonProp {
    sx?: SxProps<Theme> | undefined,
}

const SignInSignoutButton = (props: ISignInButtonProp) => {
    const { instance } = useMsal();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleLoginClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleLogout = () => {
        instance.logoutRedirect();
    };

    return (
        <>
            <UnauthenticatedTemplate>
                <Button component='a' onClick={handleLoginClick} {...props} startIcon={<Login />}>Sign in</Button>
                <SignInDialog open={dialogOpen} onClose={handleDialogClose} />
            </UnauthenticatedTemplate>

            <AuthenticatedTemplate>
                <Button component='a' onClick={handleLogout} {...props} startIcon={<Logout />}>Sign out</Button>
            </AuthenticatedTemplate>
        </>
    );
};

export default SignInSignoutButton;