import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActions, Stack, CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { NO_IMAGE_URL } from '../../../store/constants';

function StudentCard({ person, setOpenDialogDelete, isDeleting, isOpeningDialogEdit, setEditId, setDeleteId }) {
  const { id, name, admNo, imageUrl } = person;

  return (
    <>
      <Card>
        <CardMedia component="img" height="250" image={imageUrl || NO_IMAGE_URL} alt={name} />
        <CardContent style={{ textAlign: 'center', justifyContent: 'center' }} sx={{ pb: 0, pt: 1 }}>
          <Typography variant="h5" color="primary">
            {name}
          </Typography>
          <Typography variant="body1" color="secondary">
            {admNo}
          </Typography>
        </CardContent>
        <CardActions sx={{ pb: 1, pt: 0 }}>
          <Stack spacing={2} direction="row" style={{ textAlign: 'center', justifyContent: 'center', flex: 1 }}>
            {isOpeningDialogEdit ? (
              <CircularProgress size={25} color="error" />
            ) : (
              <IconButton aria-label="edit">
                <EditIcon
                  color="primary"
                  onClick={() => {
                    setEditId(id);
                  }}
                />
              </IconButton>
            )}
            {isDeleting ? (
              <CircularProgress size={24} />
            ) : (
              <IconButton aria-label="delete">
                <DeleteIcon
                  color="error"
                  onClick={() => {
                    setDeleteId(id);
                    setOpenDialogDelete(true);
                  }}
                />
              </IconButton>
            )}
          </Stack>
        </CardActions>
      </Card>
    </>
  );
}

export default StudentCard;
