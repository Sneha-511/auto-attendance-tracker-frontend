import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import Close from '@mui/icons-material/Close';
import { IconButton, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';

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

function ViewAttendanceDetailsDialog(props) {
  const { openDialogView, handleCloseDialogView, Transition, students, attendance } = props;
  if (!attendance) return null;
  const presentees = new Set(attendance.presentees);
  const attendanceTable = useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fullWidth = useMediaQuery(theme.breakpoints.up('md'));

  const handleDownload = () => {
    const table = attendanceTable.current;
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, `${attendance.day.substring(0, 10)} attendance.xlsx`);
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      scroll="body"
      open={openDialogView}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDialogView}
      aria-describedby="alert-dialog-slide-description"
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCloseDialogView} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Attendance on {attendance.day.substring(0, 10)}
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
          <div style={{ justifyContent: 'center', width: '100%' }}>
            <Button
              variant="contained"
              component="span"
              color="success"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownload}
            >
              Download As Excel
            </Button>
            <br />
            <br />
            <TableContainer component={Paper} style={{ width: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
              <Table aria-label="Attendance sheet" ref={attendanceTable}>
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
                        {presentees.has(student.id) ? 'Present' : 'Absent'}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
          </div>
        </Box>
      </Box>
    </Dialog>
  );
}

export default ViewAttendanceDetailsDialog;
