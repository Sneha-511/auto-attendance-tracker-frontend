import React, { useState } from 'react';
import Close from '@mui/icons-material/Close';
import { IconButton, Box, Button, TextField, AppBar, Toolbar, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import showToast from '../../utils/showToastNotification';
import * as api from '../../api/index';
import { ERROR, SUCCESS } from '../../store/types';
import isValidUrl from '../../utils/isValidUrl';
import MiniSpinner from '../../components/common/MiniSpinner';
import ImageUrlInput from '../../components/common/ImageUrlInput';

function AddClassroomDialog(props) {
  const { openDialogAdd, setOpenDialogAdd, Transition, classrooms, setClassrooms } = props;

  const [classroomName, setClassroomName] = useState('');
  const [classroomStartYear, setClassroomStartYear] = useState('');
  const [classroomEndYear, setClassroomEndYear] = useState('');
  const [classroomLogoImageUrl, setClassroomLogoImageUrl] = useState('');

  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
    setClassroomName('');
    setClassroomStartYear('');
    setClassroomEndYear('');
    setClassroomLogoImageUrl('');
  };

  const [isAdding, setIsAdding] = useState(false);
  const handleAdd = async () => {
    setIsAdding(true);
    if (classroomName === '') {
      setIsAdding(false);
      showToast(ERROR, 'Classroom name is required!');
    } else if (classroomStartYear === '') {
      setIsAdding(false);
      showToast(ERROR, 'Start year is required!');
    } else if (classroomEndYear === '') {
      setIsAdding(false);
      showToast(ERROR, 'End year is required!');
    } else if ((classroomLogoImageUrl !== '' && isValidUrl(classroomLogoImageUrl)) || classroomLogoImageUrl === '') {
      const formData = {
        name: classroomName,
        startYear: classroomStartYear,
        endYear: classroomEndYear,
        ...(classroomLogoImageUrl !== '' && { imageUrl: classroomLogoImageUrl }),
      };
      try {
        const { data } = await api.addClassroom(formData);
        setClassrooms([...classrooms, data]);
        handleCloseDialogAdd();
        showToast(SUCCESS, 'Classroom added successfully!');
      } catch (e) {
        const message = e?.response?.data?.message || 'Error in adding classroom!';
        showToast(ERROR, message);
      } finally {
        setIsAdding(false);
      }
    } else {
      setIsAdding(false);
      showToast(ERROR, 'Please enter valid image URL!');
    }
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fullWidth = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth="md"
      open={openDialogAdd}
      onClose={handleCloseDialogAdd}
      TransitionComponent={Transition}
      scroll="body"
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCloseDialogAdd} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add Classroom
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ margin: 3, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 1,
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="classroomName"
            label="Classroom Name"
            name="Classroom Name"
            type={'text'}
            onChange={(e) => setClassroomName(e.target.value)}
            value={classroomName}
            required
          />
          <br />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="startYear"
            label="Start Year"
            name="Start Year"
            required
            type={'number'}
            onChange={(e) => setClassroomStartYear(e.target.value)}
            value={classroomStartYear}
            InputProps={{ inputProps: { max: 2100, min: 1920 } }}
          />
          <br />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="endYear"
            label="End Year"
            required
            name="End Year"
            type={'number'}
            onChange={(e) => setClassroomEndYear(e.target.value)}
            value={classroomEndYear}
            InputProps={{ inputProps: { max: 2100, min: 1920 } }}
          />
          <br />
          <ImageUrlInput
            margin="normal"
            label="Logo Url"
            name="Logo Url"
            onChange={(e) => setClassroomLogoImageUrl(e.target.value)}
            value={classroomLogoImageUrl}
          />
          <br />
          <Box sx={{ p: 1, my: 0, mx: 'auto' }}>
            <Button variant="contained" color="success" onClick={handleAdd} disabled={isAdding}>
              {isAdding ? (
                <>
                  Adding
                  <MiniSpinner />
                </>
              ) : (
                <>Add Classroom</>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default AddClassroomDialog;
