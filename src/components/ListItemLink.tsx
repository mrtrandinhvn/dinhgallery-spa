import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
    Link as RouterLink,
    type LinkProps as RouterLinkProps,
} from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(function Link(
                itemProps,
                ref,
            ) {
                return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
            }),
        [to],
    );

    return (
        <li>
            <ListItemButton component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItemButton>
        </li>
    );
}

export default ListItemLink;