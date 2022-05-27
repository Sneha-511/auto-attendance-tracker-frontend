import React from 'react';
import Close from '@mui/icons-material/Close';
import { IconButton, Box, Button, AppBar, Toolbar, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import AddEditContactForm from './AddEditStudentForm';
import MiniSpinner from '../../common/MiniSpinner';

function StudentEditDialog(props) {
  const {
    editStudentData,
    setEditStudentData,
    openDialogEdit,
    handleCloseDialogEdit,
    handleEdit,
    isEditing,
    Transition,
  } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fullWidth = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth="md"
      open={openDialogEdit}
      onClose={handleCloseDialogEdit}
      TransitionComponent={Transition}
      scroll="body"
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCloseDialogEdit} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Student
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
          <AddEditContactForm data={editStudentData} setData={setEditStudentData} />
          <Box sx={{ p: 1, my: 0, mx: 'auto' }}>
            <Button variant="contained" color="success" onClick={() => handleEdit()} disabled={isEditing}>
              {isEditing ? (
                <>
                  Saving your changes
                  <MiniSpinner />
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default StudentEditDialog;
