import { Typography } from '@mui/material';

interface IWelcomeNameProps {
    sx?: any,
    name?: string
}

const WelcomeName = ({ sx, name }: IWelcomeNameProps) => {
    if (name) {
        return <Typography sx={sx}>{name}</Typography>;
    } else {
        return null;
    }
};

export default WelcomeName;