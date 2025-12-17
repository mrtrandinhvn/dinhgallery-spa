import CircularProgress from '@mui/material/CircularProgress';

const LoadingDiv = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        }}>
            <CircularProgress />
        </div>
    );
};

export default LoadingDiv;