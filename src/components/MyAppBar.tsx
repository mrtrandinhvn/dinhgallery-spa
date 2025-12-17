import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Collections from '@mui/icons-material/Collections';
import GitHub from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import Upload from '@mui/icons-material/Upload';
import type { SvgIconComponent } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { type MouseEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ListItemLink from './ListItemLink';
import SignInSignoutButton from './SignInSignoutButton';
import WelcomeName from './WelcomeName';
import packageJson from '../../package.json';

const VITE_REPOSITORY_URL = import.meta.env.VITE_REPOSITORY_URL || '#';

const drawerWidth = 240;
interface RouteConfig {
    label: string
    path: string
    icon: SvgIconComponent
}

const routes: RouteConfig[] = [
    {
        label: 'Gallery',
        path: '/',
        icon: Collections,
    },
    {
        label: 'Upload',
        path: 'upload',
        icon: Upload,
    },
];

interface IDrawerBody {
    handleDrawerToggle: () => void
}

const DrawerBody = ({ handleDrawerToggle }: IDrawerBody) => {
    return (
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
                <AuthenticatedTemplate>
                    {
                        routes.map((route) => (
                            <ListItemLink
                                key={route.path}
                                to={route.path}
                                primary={route.label}
                                icon={<route.icon />} />
                        ))
                    }
                </AuthenticatedTemplate>
                <li>
                    <ListItemButton
                        component={'a'}
                        href={VITE_REPOSITORY_URL}
                        target='_blank'
                        rel="noopener noreferrer">
                        <ListItemIcon><GitHub /></ListItemIcon>
                        <ListItemText primary={'Github'} />
                    </ListItemButton>
                </li>
            </List>
        </Box>
    );
};

const MyAppBar = () => {
    const container = window !== undefined ? () => window.document.body : undefined;
    const { instance } = useMsal();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const accountName = instance.getActiveAccount()?.name;

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleOpenAccountMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
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

                    <Button
                        component={RouterLink}
                        sx={{ color: '#fff' }}
                        to='/'>
                        Dinh Gallery
                    </Button>
                    <Typography
                        variant="overline"
                        component="div"
                        sx={{ flexGrow: 1, display: { sm: 'block' } }}
                    >v{packageJson.version}
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <AuthenticatedTemplate>
                            {
                                routes.map((route) => (
                                    <Button
                                        startIcon={<route.icon />}
                                        component={RouterLink}
                                        key={route.path}
                                        sx={{ color: '#fff' }}
                                        to={route.path}>
                                        {route.label}
                                    </Button>
                                ))
                            }
                        </AuthenticatedTemplate>
                        <Button
                            startIcon={<GitHub />}
                            component={'a'}
                            sx={{ color: '#fff' }}
                            href={VITE_REPOSITORY_URL}
                            target={'_blank'}
                            rel="noopener noreferrer"
                        >
                            Github
                        </Button>
                    </Box>
                    <AuthenticatedTemplate>
                        <Button
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenAccountMenu}
                            color="inherit"
                            startIcon={<AccountCircle />}
                            sx={{ marginLeft: 'auto' }}
                        >
                            <WelcomeName name={accountName} />
                        </Button>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <SignInSignoutButton sx={{ marginLeft: 'auto', color: 'inherit' }} />
                    </UnauthenticatedTemplate>
                    <Menu
                        id="menu-appbar"
                        sx={{ mt: '2rem' }}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleAccountMenuClose}
                    >
                        <MenuItem>
                            <SignInSignoutButton />
                        </MenuItem>
                    </Menu>
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
                    <DrawerBody handleDrawerToggle={handleDrawerToggle} />
                </Drawer>
            </Box>
        </>
    );
};

export default MyAppBar;