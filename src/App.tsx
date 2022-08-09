import { default as React, useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import ListItemLink from './components/ListItemLink';
import { Container } from '@mui/material';
import { Collections, GitHub, SvgIconComponent, Upload } from '@mui/icons-material';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import SignInSignoutButton from './components/SignInSignoutButton';
import { useAccount, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { tokenRequest } from './authConfig';
import WelcomeName from './components/WelcomeName';
const { REACT_APP_REPOSITORY_URL = '#' } = process.env;

const drawerWidth = 240;
interface RouteConfig {
    label: string,
    path: string,
    component: () => JSX.Element,
    icon: SvgIconComponent,
}

const routes: RouteConfig[] = [
    {
        label: 'Gallery',
        path: '/',
        component: GalleryPage,
        icon: Collections,
    },
    {
        label: 'Upload',
        path: 'upload',
        component: UploadPage,
        icon: Upload,
    },
];


export default function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    useEffect(() => {
        if (account) {
            instance.acquireTokenSilent({
                scopes: tokenRequest.scopes,
                account,
            }).then((response) => {
                if (response) {
                    console.log(account);
                }
            });
        }
    }, [account, instance]);


    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerContent = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                <Button
                    component={RouterLink}
                    to='/'>
                    Dinh Gallery
                </Button>
            </Typography>
            <Divider />
            <List>
                {isAuthenticated && routes.map((route) => (
                    <ListItemLink
                        key={route.path}
                        to={route.path}
                        primary={route.label}
                        icon={<route.icon />} />
                ))}
                <ListItemLink
                    to={REACT_APP_REPOSITORY_URL}
                    primary={'Github'}
                    icon={<GitHub />} />
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Container>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <AppBar component="nav">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            <Button
                                component={RouterLink}
                                sx={{ color: '#fff' }}
                                to='/'>
                                Dinh Gallery
                            </Button>
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {isAuthenticated && routes.map((route) => (
                                <Button
                                    startIcon={<route.icon />}
                                    component={RouterLink}
                                    key={route.path}
                                    sx={{ color: '#fff' }}
                                    to={route.path}>
                                    {route.label}
                                </Button>
                            ))}
                            <Button
                                startIcon={<GitHub />}
                                component={'a'}
                                sx={{ color: '#fff' }}
                                href={REACT_APP_REPOSITORY_URL}>
                                Github
                            </Button>
                        </Box>
                        <WelcomeName />
                        <SignInSignoutButton sx={{ color: '#fff' }} />
                    </Toolbar>
                </AppBar>
                <Box component="nav">
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={drawerOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </Box>
                <Box component="main" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </Container>
    );
}