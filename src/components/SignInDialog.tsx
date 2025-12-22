import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { useMsal } from '@azure/msal-react';
import { loginRequest, setRememberMe, getRememberMe } from '../authConfig';

interface SignInDialogProps {
    open: boolean;
    onClose: () => void;
}

const SignInDialog = ({ open, onClose }: SignInDialogProps) => {
    const { instance } = useMsal();
    const [rememberMe, setRememberMeState] = useState(getRememberMe());

    const handleSignIn = () => {
        // Save remember-me preference before redirecting
        setRememberMe(rememberMe);

        // Redirect to Microsoft sign-in
        instance.loginRedirect(loginRequest);

        // Note: onClose won't execute because we're redirecting
        onClose();
    };

    const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMeState(event.target.checked);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Sign In</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                    You'll be redirected to Microsoft to sign in securely.
                </Typography>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                            color="primary"
                        />
                    }
                    label={
                        <Typography variant="body2">
                            Remember me
                        </Typography>
                    }
                />

                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, ml: 4 }}>
                    {rememberMe
                        ? "You'll stay signed in for an extended period."
                        : "You'll be signed out after 8 hours of inactivity."}
                </Typography>

                <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 2 }}>
                    Don't check "Remember me" on shared or public computers.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleSignIn} variant="contained" autoFocus>
                    Continue to Sign In
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SignInDialog;
