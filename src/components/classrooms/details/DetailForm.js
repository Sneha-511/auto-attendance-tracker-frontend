import { Button, FormControl, Paper, TextField } from '@mui/material';
import React, { useState } from 'react';
import { ERROR, INFO } from '../../../store/types';
import isValidUrl from '../../../utils/isValidUrl';
import showToast from '../../../utils/showToastNotification';
import * as api from '../../../api/index';
import MiniSpinner from '../../common/MiniSpinner';
import ImageUrlInput from '../../common/ImageUrlInput';

const textFieldColor = (currState, originalState) => {
  return (currState && currState.toString()) !== (originalState && originalState.toString()) ? 'warning' : 'primary';
};

const DetailForm = ({ id, name, imageUrl, startYear, endYear, onSuccess }) => {
  const [classroomName, setClassroomName] = useState(name);
  const [classroomStartYear, setClassroomStartYear] = useState(startYear);
  const [classroomEndYear, setClassroomEndYear] = useState(endYear);
  const [classroomImageUrl, setClassroomImageUrl] = useState(imageUrl);

  const [isSaving, setIsSaving] = useState(false);
  const handleSaveChanges = async () => {
    setIsSaving(true);

    if (classroomName === '') {
      showToast(ERROR, 'Classroom name is required!');
      setIsSaving(false);
    } else if ((imageUrl !== '' && isValidUrl(imageUrl)) || imageUrl === '') {
      const formData = {
        ...(classroomName !== name && { name: classroomName }),
        ...(classroomStartYear !== startYear && { startYear: classroomStartYear }),
        ...(classroomEndYear !== endYear && { endYear: classroomEndYear }),
        ...(classroomImageUrl !== imageUrl && { imageUrl: classroomImageUrl }),
      };

      if (Object.keys(formData) < 1) {
        showToast(INFO, 'No changes done.');
        setIsSaving(false);
        return;
      }
      try {
        const { data } = await api.editClassroomDetails(id, formData);
        onSuccess(data);
      } catch (e) {
        const message = e?.response?.data?.message || 'Error in saving your changes.';
        showToast(ERROR, message);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsSaving(false);
      showToast(ERROR, 'Please enter a valid url.');
    }
  };
  return (
    <Paper
      elevation={8}
      sx={{
        padding: '20px',
        margin: '10px',
        mt: 5,
      }}
    >
      <FormControl fullWidth>
        <TextField
          name="name"
          label="Name of Classroom"
          value={classroomName}
          color={textFieldColor(classroomName, name)}
          onChange={(e) => setClassroomName(e.target.value)}
          required
          focused
        />
        <br />
        <TextField
          id="startYear"
          label="Start Year"
          name="Start Year"
          value={classroomStartYear}
          color={textFieldColor(classroomStartYear, startYear)}
          required
          type={'number'}
          onChange={(e) => setClassroomStartYear(e.target.value)}
          InputProps={{ inputProps: { max: 2100, min: 1920 } }}
          focused
        />
        <br />
        <TextField
          id="endYear"
          label="End Year"
          required
          name="End Year"
          value={classroomEndYear}
          color={textFieldColor(classroomEndYear, endYear)}
          type={'number'}
          onChange={(e) => setClassroomEndYear(e.target.value)}
          InputProps={{ inputProps: { max: 2100, min: 1920 } }}
          focused
        />
        <br />
        <ImageUrlInput
          name="imageUrl"
          label="Logo Url"
          value={classroomImageUrl}
          onChange={(e) => setClassroomImageUrl(e.target.value)}
          focused={true}
          color={textFieldColor(classroomImageUrl, imageUrl)}
        />
        <br />
        <Button color="success" onClick={handleSaveChanges} variant="contained" disabled={isSaving}>
          {isSaving ? (
            <>
              Saving...
              <MiniSpinner />
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </FormControl>
    </Paper>
  );
};

export default DetailForm;
