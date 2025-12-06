import { Link, Typography } from '@mui/material';
import React from 'react';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

const NeedSignInMessage = () => {
    const { instance } = useMsal();

    const handleLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        instance.loginRedirect(loginRequest);
    };

    return (
        <Typography variant='overline' gutterBottom>
            This is a personal file sharing system. You need to be invited to use it.
            <br />
            If you already have an account, <Link href='#' onClick={handleLoginClick}>sign in</Link>.
        </Typography>
    );
};

const UnauthenticatedWelcomePage = () => {
    return (
        <PageBody>
            <PageHeading heading="Hello there!"></PageHeading>
            <NeedSignInMessage />
        </PageBody>
    );
};


export default UnauthenticatedWelcomePage;