import React, { useEffect, useState } from 'react';
import * as api from '../../../../api/index';
import { Button, Grid } from '@mui/material';
import InfoAlert from '../../../../components/common/InfoAlert';
import StudentCard from '../../../../components/classrooms/students/StudentCard';
import { Add } from '@mui/icons-material';
import StudentAddDialog from '../../../../components/classrooms/students/StudentAddDialog';
import Transition from '../../../../components/common/Transition';
import { ERROR, SUCCESS } from '../../../../store/types';
import showToast from '../../../../utils/showToastNotification';
import StudentDeleteDialog from '../../../../components/classrooms/students/StudentDeleteDialog';
import StudentEditDialog from '../../../../components/classrooms/students/StudentEditDialog';

function ClassroomStudents({ classroom, setClassroom }) {
  if (!classroom) return null;

  const { students, id: classroomId } = classroom;

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editId, setEditId] = useState('');
  const [isOpeningDialogEdit, setIsOpeningDialogEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [editStudentData, setEditStudentData] = useState({ name: '', admNo: '', imageUrl: '' });

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
    setDeleteId('');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteClassroomStudent(classroomId, deleteId);
      const newStudents = students.filter((student) => student.id !== deleteId);
      setClassroom({ ...classroom, students: newStudents });
      handleCloseDialogDelete();
      showToast(SUCCESS, `Student removed successfully.`);
    } catch (e) {
      const message = e?.target?.data?.message || 'Error in removing the student.';
      showToast(ERROR, message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = { ...editStudentData };
      delete formData.id;
      await api.editClassroomStudent(classroomId, editId, formData);
      const newStudents = students.map((student) => {
        if (student.id !== editId) return student;
        else return { ...editStudentData, id: student.id };
      });
      setClassroom({ ...classroom, students: newStudents });
      handleCloseDialogEdit();
      showToast(SUCCESS, `Student details updated successfully.`);
    } catch (e) {
      const message = e?.target?.data?.message || 'Error in updating the student details.';
      showToast(ERROR, message);
    }
  };

  const handleCloseDialogEdit = () => {
    setOpenDialogEdit(false);
    setEditId('');
    setEditStudentData({ name: '', admNo: '', imageUrl: '' });
  };

  useEffect(() => {
    if (editId) {
      const editingStudents = classroom?.students?.filter((student) => student.id === editId);
      setEditStudentData(editingStudents[0]);
      setIsOpeningDialogEdit(false);
      setOpenDialogEdit(true);
    }
  }, [editId]);

  return (
    <>
      <div
        style={{
          marginTop: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setOpenDialogAdd(true);
            }}
          >
            Add Student
          </Button>
        </div>
      </div>
      {students?.length === 0 && <InfoAlert message="No student found" />}
      <Grid container spacing={2} sx={{ mt: 2, pl: 3 }} justifyContent="center">
        {students?.length > 0 &&
          students.map((student) => (
            <Grid item xs={12} md={4} lg={3} key={student.id}>
              <StudentCard
                person={student}
                setDeleteId={setDeleteId}
                isDeleting={isDeleting && deleteId === student.id}
                setOpenDialogDelete={setOpenDialogDelete}
                setEditId={setEditId}
                isOpeningDialogEdit={isOpeningDialogEdit && editId === student.id}
              />
            </Grid>
          ))}
      </Grid>
      <StudentAddDialog
        classroomId={classroomId}
        openDialogAdd={openDialogAdd}
        setOpenDialogAdd={setOpenDialogAdd}
        Transition={Transition}
        classroom={classroom}
        setClassroom={setClassroom}
      />
      <StudentDeleteDialog
        openDialogDelete={openDialogDelete}
        handleCloseDialogDelete={handleCloseDialogDelete}
        handleDelete={handleDelete}
        Transition={Transition}
      />
      <StudentEditDialog
        openDialogEdit={openDialogEdit}
        handleCloseDialogEdit={handleCloseDialogEdit}
        Transition={Transition}
        handleEdit={handleEdit}
        editStudentData={editStudentData}
        setEditStudentData={setEditStudentData}
      />
    </>
  );
}

export default ClassroomStudents;
