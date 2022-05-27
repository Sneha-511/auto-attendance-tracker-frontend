import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Switch, Route, Redirect } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@mui/icons-material/People';
import { ArrowBackIosNew } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import ErrorAlert from '../../../../components/common/ErrorAlert';
import Loader from '../../../../components/common/Loader';
import ClassroomAttendance from './ClassroomAttendance';
import ClassroomDetailsTab from './ClassroomDetailsTab';
import ClassroomStudents from './ClassroomStudents';
import { NO_IMAGE_URL } from '../../../../store/constants';
import * as api from '../../../../api';

const ClassroomDetails = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const [error, setError] = useState('');

  const { classroomId } = useParams();

  useEffect(async () => {
    try {
      const { data } = await api.getClassroomDetailsById(classroomId);
      setClassroom(data);
    } catch (e) {
      const message = e?.response?.data?.message || 'Unable to fetch classroom details';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const currentUrl = props?.location?.pathname;
  const urlParts = currentUrl.split('/');
  const lastPart = urlParts[urlParts.length - 1];

  const [value, setValue] = useState(lastPart === classroomId ? 'details' : lastPart);

  if (isLoading) {
    return <Loader />;
  } else if (error) {
    return <ErrorAlert message={error} />;
  } else {
    return (
      <>
        <Box sx={{ mt: -3, ml: -3, mr: -3 }}>
          <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
            <Tabs
              indicatorColor="secondary"
              textColor="inherit"
              variant="scrollable"
              scrollButtons="auto"
              value={value}
              onChange={handleChange}
            >
              <Tab
                component="a"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/dashboard/classrooms');
                }}
                icon={<ArrowBackIosNew />}
                iconPosition="start"
                value="back"
              />
              <Tab
                label="Details"
                icon={<InfoIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/dashboard/classrooms/${classroomId}/details`);
                }}
                value="details"
              />
              <Tab
                label="Students"
                icon={<PeopleIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/dashboard/classrooms/${classroomId}/students`);
                }}
                value="students"
              />
              <Tab
                label="Attendance"
                icon={<EventNoteIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/dashboard/classrooms/${classroomId}/attendance`);
                }}
                value="attendance"
              />
              <Box sx={{ ml: 'auto', mt: 3, mr: 2, '& > img': { mr: 2 } }}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <img loading="lazy" width="40" src={classroom.imageUrl || NO_IMAGE_URL} />
                  <Typography variant="body1" sx={{ mt: 3 }}>
                    {classroom.name}
                  </Typography>
                </Stack>
              </Box>
            </Tabs>
          </AppBar>
        </Box>
        <Switch>
          <Route
            path="/dashboard/classrooms/:classroomId/attendance"
            exact
            component={() => <ClassroomAttendance classroom={classroom} setClassroom={setClassroom} />}
          />
          <Route
            path="/dashboard/classrooms/:classroomId/students"
            exact
            component={() => <ClassroomStudents classroom={classroom} setClassroom={setClassroom} />}
          />
          <Route
            path="/dashboard/classrooms/:classroomId/details"
            exact
            component={() => <ClassroomDetailsTab classroom={classroom} setClassroom={setClassroom} />}
          />
          <Redirect from="/dashboard/classrooms/:classroomId" to="/dashboard/classrooms/:classroomId/details" />
        </Switch>
      </>
    );
  }
};

export default ClassroomDetails;
