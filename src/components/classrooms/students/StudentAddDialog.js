import React, { useState } from 'react';
import Close from '@mui/icons-material/Close';
import { IconButton, Box, Button, AppBar, Toolbar, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import * as api from '../../../api/index';
import { ERROR, SUCCESS } from '../../../store/types';
import showToast from '../../../utils/showToastNotification';
import AddEditContactForm from './AddEditStudentForm';
import MiniSpinner from '../../common/MiniSpinner';

function StudentAddDialog(props) {
  const { classroomId, openDialogAdd, setOpenDialogAdd, Transition, classroom, setClassroom } = props;

  const [studentData, setStudentData] = useState({
    name: '',
    admNo: '',
    imageUrl: '',
  });

  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
    setStudentData({
      name: '',
      admNo: '',
      imageUrl: '',
    });
  };

  const [isAdding, setIsAdding] = useState(false);
  const handleAdd = async () => {
    setIsAdding(true);
    try {
      const { data } = await api.addClassroomStudent(classroomId, studentData);
      const newClassroom = { ...classroom, students: [...classroom.students, data] };
      setClassroom(newClassroom);
      handleCloseDialogAdd();
      showToast(SUCCESS, 'Student added successfully.');
    } catch (e) {
      const message = e?.response?.data?.message || 'Error in adding student';
      showToast(ERROR, message);
    } finally {
      setIsAdding(false);
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
            Add Student
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
          <AddEditContactForm data={studentData} setData={setStudentData} />
          <Box sx={{ p: 1, my: 0, mx: 'auto' }}>
            <Button variant="contained" color="success" onClick={handleAdd} disabled={isAdding}>
              {isAdding ? (
                <>
                  Adding
                  <MiniSpinner />
                </>
              ) : (
                <>Add Student</>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default StudentAddDialog;
