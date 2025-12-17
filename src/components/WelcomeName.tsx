import Typography from '@mui/material/Typography';

interface IWelcomeNameProps {
    name?: string
}

const WelcomeName = ({ name }: IWelcomeNameProps) => {
    if (name) {
        return <Typography>{name}</Typography>;
    } else {
        return null;
    }
};

export default WelcomeName;