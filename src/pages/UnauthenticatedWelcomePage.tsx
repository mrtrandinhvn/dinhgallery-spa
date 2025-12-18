import { useState } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { MouseEvent } from 'react';
import PageBody from '../components/PageBody';
import PageHeading from '../components/PageHeading';
import SignInDialog from '../components/SignInDialog';

const NeedSignInMessage = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleLoginClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Typography variant='overline' gutterBottom>
                This is a personal file sharing system. You need to be invited to use it.
                <br />
                If you already have an account, <Link href='#' onClick={handleLoginClick}>sign in</Link>.
            </Typography>
            <SignInDialog open={dialogOpen} onClose={handleDialogClose} />
        </>
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