import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { Typography } from '@mui/material';

interface IWelcomeNameProps {
    sx?: any,
}

const WelcomeName = ({ sx }: IWelcomeNameProps) => {
    const { instance } = useMsal();
    const [name, setName] = useState<string | null>(null);

    const activeAccount = instance.getActiveAccount();
    useEffect(() => {
        setName(activeAccount?.name || null);
    }, [activeAccount]);

    if (name) {
        return <Typography variant="h6" sx={sx}>Welcome, {name}</Typography>;
    } else {
        return null;
    }
};

export default WelcomeName;