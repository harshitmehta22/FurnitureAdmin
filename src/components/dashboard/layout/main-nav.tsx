'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { io } from 'socket.io-client';
import { Menu, MenuItem } from '@mui/material';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  const userPopover = usePopover<HTMLDivElement>();
  const socket = io('http://localhost:5000', {
    transports: ['websocket'], // optional, forces WebSocket
  });
  React.useEffect(() => {
    socket.on('admin-notification', (notification: any) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off('admin-notification');
    };
  }, []);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={unreadCount} color="error">
                {/* <IconButton onClick={handleOpenNotifications}> */}
                <BellIcon />
                {/* </IconButton> */}
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      // onClose={handleCloseNotifications}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map((notif: any) => (
            <MenuItem key={notif._id}>
              {notif.message}
            </MenuItem>
          ))
        )}
      </Menu>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
