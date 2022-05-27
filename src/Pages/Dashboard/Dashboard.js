import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Link, ListItemAvatar, Menu, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Images from './Images';
import Classrooms from './Classrooms';
import ClassroomDetails from './Classrooms/ClassroomDetails';
import { signOut } from '../../store/actions/AuthAction';
import getInitialsFromName from '../../utils/getInitialsFromName';
import ChangePassword from './Profile/ChangePassword';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Dashboard() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { authData } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(signOut(authData));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
            <Typography variant="h6" noWrap component="div">
              Automatic Attendance Tracker
            </Typography>
          </Link>
          <IconButton
            size="large"
            aria-label={authData?.user?.email}
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ ml: 'auto' }}
          >
            <Avatar sx={{ color: 'white', bgcolor: 'secondary.main' }}>
              {getInitialsFromName(authData?.user?.name)}
            </Avatar>
          </IconButton>
          <Menu
            id="profile-menu"
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
            onClose={handleClose}
          >
            <ListItem sx={{ pt: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ color: 'white', bgcolor: 'secondary.main' }}>
                  {getInitialsFromName(authData?.user?.name)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={authData?.user?.name} secondary={authData?.user?.email} />
            </ListItem>
            <Divider />
            <MenuItem
              onClick={() => {
                history.push('/dashboard/profile/change-password');
                handleClose();
              }}
            >
              Change Password
            </MenuItem>
            <MenuItem
              onClick={() => {
                history.push('/dashboard/images');
                handleClose();
              }}
            >
              Manage Images
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 7 }}>
        <Switch>
          <Route path="/dashboard/images" exact component={Images} />
          <Route path="/dashboard/classrooms" exact component={Classrooms} />
          <Route path="/dashboard/classrooms/:classroomId" component={ClassroomDetails} />
          <Route path="/dashboard/profile/change-password" exact component={ChangePassword} />
          <Redirect from="/dashboard" to="/dashboard/classrooms" />
        </Switch>
      </Box>
    </Box>
  );
}
