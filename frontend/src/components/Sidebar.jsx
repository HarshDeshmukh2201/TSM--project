import { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider, 
  IconButton, 
  Avatar, 
  Tooltip, 
  useTheme,
  alpha,
  useMediaQuery,
  AppBar,
  Toolbar
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

export default function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const navItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard' 
    },
    { 
      text: 'Tasks', 
      icon: <TaskIcon />, 
      path: '/tasks',
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const mobileDrawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 2 }}>
      {/* Navigation Links */}
      <List sx={{ px: 1, flex: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                minHeight: 48,
                px: 2.5,
                borderRadius: 2,
                justifyContent: 'flex-start',
                backgroundColor: isActive(item.path) 
                  ? alpha(theme.palette.primary.main, 0.1) 
                  : 'transparent',
                color: isActive(item.path) 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                  color: isActive(item.path) 
                    ? theme.palette.primary.main 
                    : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 600 : 400 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Logout Button - Kept in mobile view as requested */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Tooltip title="Logout">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              justifyContent: 'flex-start',
              minHeight: 48,
              px: 2.5,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
                color: theme.palette.error.main,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                color: theme.palette.error.main,
                fontWeight: 500
              }} 
            />
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const desktopDrawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* App Logo and Title */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          minHeight: 64
        }}
      >
        {open ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 1, 
                  background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  mr: 1.5
                }}
              >
                TM
              </Box>
              <Typography variant="h6" fontWeight="bold" noWrap>
                Task Manager buy 
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} size="small">
              <MenuOpenIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={handleDrawerToggle} size="small">
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* User Profile Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: open ? 'flex-start' : 'center',
          p: 2,
          pb: 3
        }}
      >
        <Avatar 
          src="/assets/user-avatar.jpg" 
          alt={user?.username || "User"}
          sx={{ 
            width: 40, 
            height: 40,
            mb: open ? 1 : 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
        </Avatar>
        {open && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {user?.username || "User"}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                mt: 0.5
              }}
            >
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'success.main' 
                }} 
              />
              Online
            </Typography>
          </>
        )}
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Navigation Links */}
      <List sx={{ px: 1, flex: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                borderRadius: 2,
                justifyContent: open ? 'initial' : 'center',
                backgroundColor: isActive(item.path) 
                  ? alpha(theme.palette.primary.main, 0.1) 
                  : 'transparent',
                color: isActive(item.path) 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: isActive(item.path) 
                    ? theme.palette.primary.main 
                    : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive(item.path) ? 600 : 400 
                  }} 
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Tooltip title="Logout">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              justifyContent: open ? 'flex-start' : 'center',
              minHeight: 48,
              px: 2.5,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: theme.palette.error.main,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  color: theme.palette.error.main,
                  fontWeight: 500
                }} 
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const mobileAppBar = isMobile && (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={0}
      sx={{ 
        zIndex: 1201,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 1 }}
          >
            {mobileOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Box 
            sx={{ 
              width: 28, 
              height: 28, 
              borderRadius: 1, 
              background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              mr: 1
            }}
          >
            TM
          </Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Task Manager
          </Typography>
        </Box>
        <Avatar 
          src="/assets/user-avatar.jpg" 
          alt={user?.username || "User"}
          sx={{ 
            width: 32, 
            height: 32,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
        </Avatar>
      </Toolbar>
    </AppBar>
  );

  return (
    <>
      {mobileAppBar}
      
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: '0 0 20px rgba(0,0,0,0.05)',
              backgroundColor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.8)
                : '#ffffff',
              marginTop: '56px', 
              height: 'calc(100% - 56px)',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          {mobileDrawer}
        </Drawer>
      ) : (

        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : 72,
            flexShrink: 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : 72,
              boxSizing: 'border-box',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: '0 0 20px rgba(0,0,0,0.05)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              backgroundColor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.8)
                : '#ffffff',
              overflowX: 'hidden',
            },
          }}
        >
          {desktopDrawer}
        </Drawer>
      )}
      
      {isMobile && <Toolbar />}
    </>
  );
}