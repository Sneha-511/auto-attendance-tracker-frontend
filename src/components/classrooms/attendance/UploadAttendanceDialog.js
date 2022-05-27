import React, { useEffect, useState, useRef } from 'react';
import Close from '@mui/icons-material/Close';
import { IconButton, Box, Button, TextField, AppBar, Toolbar, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import * as faceapi from 'face-api.js';
import * as api from '../../../api';
import Loader from '../../common/Loader';
import ErrorAlert from '../../common/ErrorAlert';
import showToast from '../../../utils/showToastNotification';
import { ERROR, SUCCESS } from '../../../store/types';
import MiniSpinner from '../../../components/common/MiniSpinner';

const Input = styled('input')({
  display: 'none',
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function UploadAttendanceDialog(props) {
  const { openDialogUpload, setOpenDialogUpload, Transition, classroom, setClassroom } = props;
  const { students } = classroom;
  const [date, setDate] = useState(new Date().toISOString());
  const [isUploading, setIsUploading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [descriptorsGenerated, setDescriptorsGenerated] = useState(false);
  const [facesRecognized, setFacesRecognized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
  const [results, setResults] = useState(new Set());
  const [error, setError] = useState('');
  const resultsContainer = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(async () => {
    if (!students.length || !modelsLoaded) {
      return;
    }
    const descriptors = await Promise.all(
      students.map(async (student, idx) => {
        const descriptions = [];
        const url = student.imageUrl;
        const img = await faceapi.fetchImage(url);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);
        return new faceapi.LabeledFaceDescriptors(idx.toString(), descriptions);
      })
    );
    setLabeledFaceDescriptors(descriptors);
    setDescriptorsGenerated(true);
  }, [students, modelsLoaded]);

  useEffect(async () => {
    if (!selectedImage || !descriptorsGenerated) {
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    try {
      const container = resultsContainer.current;
      container.innerHTML = '';
      container.style.position = 'relative';
      const image = document.createElement('img');
      image.style.maxWidth = `${window.innerWidth - 150}px`;
      image.src = objectUrl;
      container.append(image);
      image.onload = async () => {
        const canvas = faceapi.createCanvasFromMedia(image);
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        const x = image.getBoundingClientRect().left - container.getBoundingClientRect().left;
        canvas.style.left = `${x}px`;
        container.append(canvas);
        const displaySize = { width: image.width, height: image.height };
        faceapi.matchDimensions(canvas, displaySize);
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.7);
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
        results.forEach((result, i) => {
          let label = result.toString();
          if (result._label === 'unknown') label = 'unknown';
          else label = students[Number(result._label)].name;
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label });
          drawBox.draw(canvas);
        });
        setError('');
        setResults(
          new Set(
            results.map((result) => {
              return students[Number(result._label)].id;
            })
          )
        );
      };
    } catch (err) {
      setError(err.message);
    } finally {
      setFacesRecognized(true);
    }
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage, descriptorsGenerated]);

  const handleCloseDialogUpload = () => {
    setOpenDialogUpload(false);
    setDate(new Date().toISOString());
  };

  const handleFileInputChange = (e) => {
    setError('');
    setResults(new Set());
    setFacesRecognized(false);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(null);
      return;
    }
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    if (date === '') {
      setIsUploading(false);
      showToast(ERROR, 'Date is required!');
    } else {
      const formData = {
        day: date,
        presentees: Array.from(results),
      };
      try {
        const { data } = await api.addClassroomAttendanceRecord(classroom.id, formData);
        setClassroom({ ...classroom, attendanceRecords: [...classroom.attendanceRecords, data] });
        handleCloseDialogUpload();
        showToast(SUCCESS, 'Attendance uploaded successfully!');
      } catch (e) {
        console.log(e);
        const message = e?.response?.data?.message || 'Error in uploading attendance!';
        showToast(ERROR, message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog
      fullScreen
      fullWidth
      open={openDialogUpload}
      onClose={handleCloseDialogUpload}
      TransitionComponent={Transition}
      scroll="body"
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCloseDialogUpload} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Upload Attendance
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
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newVal) => setDate(newVal)}
              renderInput={(params) => <TextField required fullWidth {...params} />}
            />
          </LocalizationProvider>
          <br />
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" onChange={handleFileInputChange} />
            <Button variant="contained" component="span" startIcon={<ImageIcon />}>
              Upload image
            </Button>
          </label>
          <br />
          {selectedImage && (!descriptorsGenerated || !facesRecognized) && <Loader />}
          {selectedImage && descriptorsGenerated && !error && <div ref={resultsContainer}></div>}
          {selectedImage && descriptorsGenerated && !!error && <ErrorAlert message={error} />}
          {selectedImage && !error && facesRecognized && (
            <div style={{ justifyContent: 'center', width: '100%' }}>
              <br />
              <TableContainer component={Paper} style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Table aria-label="Attendance sheet">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>
                        <b>Admission No.</b>
                      </StyledTableCell>
                      <StyledTableCell>
                        <b>Name</b>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <b>Attendance</b>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <StyledTableRow key={student.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <StyledTableCell component="th" scope="row">
                          {student.admNo}
                        </StyledTableCell>
                        <StyledTableCell>{student.name}</StyledTableCell>
                        <StyledTableCell align="right">
                          {results.has(student.id) ? 'Present' : 'Absent'}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
            </div>
          )}
          <Box sx={{ p: 1, my: 0, mx: 'auto' }}>
            <Button disabled={!!error || isUploading} variant="contained" color="success" onClick={handleUpload}>
              {isUploading ? (
                <>
                  Uploading
                  <MiniSpinner />
                </>
              ) : (
                <>Submit</>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default UploadAttendanceDialog;
