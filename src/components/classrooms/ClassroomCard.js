import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router-dom';
import { CardActionArea, CardActions, CircularProgress, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { NO_IMAGE_URL } from '../../store/constants';
import * as api from '../../api/index';
import showToast from '../../utils/showToastNotification';
import { ERROR } from '../../store/types';
import DeleteClassroomDialog from './DeleteClassroomDialog';

function ClassroomCard({ id, name, imageUrl, startYear, endYear, Transition, classrooms, setClassrooms }) {
  const history = useHistory();

  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    setOpenDialogDelete(false);
    try {
      await api.deleteClassroom(id);
      const newClassrooms = classrooms.filter((classroom) => classroom.id !== id);
      setClassrooms(newClassrooms);
    } catch (e) {
      console.log(e);
      const message = e?.response?.data?.message || 'Error in deleting the classroom.';
      showToast(ERROR, message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardActionArea
          onClick={() => {
            history.push(`/dashboard/classrooms/${id}`);
          }}
        >
          <CardMedia component="img" height="200" image={imageUrl || NO_IMAGE_URL} alt={id} />
          <CardContent style={{ textAlign: 'center', justifyContent: 'center' }} sx={{ pt: 1, pb: 0, px: 1 }}>
            <Typography variant="h5" color="primary">
              {name}
            </Typography>
            <Typography variant="body1" color="secondary">
              {startYear} - {endYear}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ pb: 1, pt: 0, mt: 0, mb: 0 }}>
          <div style={{ textAlign: 'center', justifyContent: 'center', flex: 1 }}>
            {isDeleting ? (
              <CircularProgress size={25} color={'error'} />
            ) : (
              <Tooltip title="Delete" disableInteractive>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setOpenDialogDelete(true);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </CardActions>
      </Card>
      <DeleteClassroomDialog
        openDialogDelete={openDialogDelete}
        setOpenDialogDelete={setOpenDialogDelete}
        handleDelete={handleDelete}
        Transition={Transition}
      />
    </>
  );
}

export default ClassroomCard;
