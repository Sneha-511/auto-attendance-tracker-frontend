import { Button, Typography, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Add from '@mui/icons-material/Add';
import * as api from '../../../api';
import ClassroomCard from '../../../components/classrooms/ClassroomCard';
import AddClassroomDialog from '../../../components/classrooms/AddClassroomDialog';
import ErrorAlert from '../../../components/common/ErrorAlert';
import InfoAlert from '../../../components/common/InfoAlert';
import Loader from '../../../components/common/Loader';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Classroom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState('');
  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  useEffect(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.getAllClassrooms();
      setClassrooms(data);
    } catch (e) {
      const message = e?.response?.data?.message || 'Unable to load classrooms';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  } else if (error) {
    return <ErrorAlert message={error} />;
  } else
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center', margin: '0 auto' }}>
            <Typography variant="h4" component="h4">
              Classrooms
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginRight: 5,
            marginLeft: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              marginRight: '5 rem',
              marginLeft: 'auto',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => {
                // Open add classroom dialog
                setOpenDialogAdd(true);
              }}
            >
              Add classroom
            </Button>
          </div>
        </div>
        {classrooms.length === 0 && <InfoAlert message="No classroom found" />}
        <Grid container spacing={3} sx={{ mt: 2 }} justifyContent="center">
          {classrooms.length > 0 &&
            classrooms.map(({ id, name, startYear, endYear, imageUrl }, idx) => (
              <Grid item xs={12} md={6} lg={4} key={id}>
                <ClassroomCard
                  key={id}
                  id={id}
                  name={name}
                  imageUrl={imageUrl}
                  startYear={startYear}
                  endYear={endYear}
                  Transition={Transition}
                  classrooms={classrooms}
                  setClassrooms={setClassrooms}
                />
              </Grid>
            ))}
        </Grid>
        <br />
        <AddClassroomDialog
          openDialogAdd={openDialogAdd}
          setOpenDialogAdd={setOpenDialogAdd}
          Transition={Transition}
          classrooms={classrooms}
          setClassrooms={setClassrooms}
        />
      </>
    );
};

export default Classroom;
