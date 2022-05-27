import React, { useState } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Stack from '@mui/material/Stack';
import * as XLSX from 'xlsx';
import * as api from '../../../../api';
import Transition from '../../../../components/common/Transition';
import UploadAttendanceDialog from '../../../../components/classrooms/attendance/UploadAttendanceDialog';
import showToast from '../../../../utils/showToastNotification';
import { ERROR, SUCCESS } from '../../../../store/types';
import AttendanceTable from '../../../../components/classrooms/attendance/AttendanceTable';
import ViewAttendanceDetailsDialog from '../../../../components/classrooms/attendance/ViewAttendanceDetailsDialog';
import DeleteAttendanceDialog from '../../../../components/classrooms/attendance/DeleteAttendanceDialog';

function ClassroomAttendance({ classroom, setClassroom }) {
  if (!classroom) return null;

  const [openDialogUpload, setOpenDialogUpload] = useState(false);
  const [openDialogView, setOpenDialogView] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [viewAttendance, setViewAttendance] = useState(null);

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
    setDeleteId('');
  };

  const handleCloseDialogView = () => {
    setOpenDialogView(false);
    setViewAttendance(null);
  };

  const handleDelete = async () => {
    try {
      await api.deleteClassroomAttendanceRecord(classroom.id, deleteId);
      const newAttendanceRecords = classroom.attendanceRecords.filter((attendance) => attendance.id !== deleteId);
      setClassroom({ ...classroom, attendanceRecords: newAttendanceRecords });
      handleCloseDialogDelete();
      showToast(SUCCESS, `Attendance record deleted successfully.`);
    } catch (e) {
      const message = e?.target?.data?.message || 'Error in removing the attendance record.';
      showToast(ERROR, message);
    }
  };

  const attendanceRecordsSet = classroom.attendanceRecords.map((attendance) => ({
    ...attendance,
    presentees: new Set(attendance.presentees),
  }));

  const handleDownload = () => {
    const { attendanceRecords, students } = classroom;
    const attendanceHeaders = ['Admission Number', 'Name'];
    const attendanceData = students.map((student, studentIdx) => {
      const row = { Name: student.name, 'Admission Number': student.admNo };
      let idx = 0;
      attendanceRecordsSet.forEach(({ presentees }) => {
        if (studentIdx === 0) attendanceHeaders.push((idx + 1).toString());
        row[(idx + 1).toString()] = presentees.has(student.id) ? 'Present' : 'Absent';
        idx = idx + 1;
      });
      return row;
    });

    const daysData = attendanceRecords.map((attendance, idx) => {
      return { 'S. No.': idx + 1, Day: attendance.day.substring(0, 10) };
    });
    const daysHeaders = ['S. No.', 'Day'];
    const worksheet1 = XLSX.utils.json_to_sheet(attendanceData, { header: attendanceHeaders });
    const worksheet2 = XLSX.utils.json_to_sheet(daysData, { header: daysHeaders });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'Attendance');
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'Days');
    XLSX.writeFile(workbook, `${classroom.name}_Attendance.xlsx`);
  };

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
          <Stack direction="column" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => {
                if (!classroom.students.length)
                  showToast(ERROR, 'Please add students in classroom before uploading attendance.');
                else setOpenDialogUpload(true);
              }}
            >
              Upload Attendance
            </Button>
            <Button variant="contained" color="success" startIcon={<FileDownloadIcon />} onClick={handleDownload}>
              Download Detailed Attendance (.xlsx)
            </Button>
          </Stack>
        </div>
      </div>
      <AttendanceTable
        classroom={classroom}
        setViewAttendance={setViewAttendance}
        setOpenDialogDelete={setOpenDialogDelete}
        setOpenDialogView={setOpenDialogView}
        setDeleteId={setDeleteId}
      />
      <UploadAttendanceDialog
        openDialogUpload={openDialogUpload}
        setOpenDialogUpload={setOpenDialogUpload}
        Transition={Transition}
        classroom={classroom}
        setClassroom={setClassroom}
      />
      <DeleteAttendanceDialog
        openDialogDelete={openDialogDelete}
        Transition={Transition}
        handleDelete={handleDelete}
        handleCloseDialogDelete={handleCloseDialogDelete}
      />
      <ViewAttendanceDetailsDialog
        openDialogView={openDialogView}
        handleCloseDialogView={handleCloseDialogView}
        Transition={Transition}
        students={classroom.students}
        attendance={viewAttendance}
      />
    </>
  );
}

export default ClassroomAttendance;
