import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

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

function AttendanceTable(props) {
  const { classroom, setOpenDialogView, setOpenDialogDelete, setViewAttendance, setDeleteId } = props;
  const { attendanceRecords } = classroom;
  return (
    <div style={{ justifyContent: 'center', width: '100%' }}>
      <br />
      <TableContainer component={Paper} style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Table aria-label="Attendance">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>
                <b>S. No.</b>
              </StyledTableCell>
              <StyledTableCell>
                <b>Date</b>
              </StyledTableCell>
              <StyledTableCell>
                <b>Presentees</b>
              </StyledTableCell>
              <StyledTableCell />
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.map((attendance, idx) => (
              <StyledTableRow key={attendance.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <StyledTableCell>{idx + 1}.</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {attendance.day.substring(0, 10)}
                </StyledTableCell>
                <StyledTableCell>{attendance.presentees.length}</StyledTableCell>
                <StyledTableCell>
                  <Stack direction="row" spacing={2} alignItems="center" alignContent="center">
                    <Tooltip title="View details" disableInteractive>
                      <IconButton
                        aria-label="view"
                        onClick={() => {
                          setViewAttendance(attendance);
                          setOpenDialogView(true);
                        }}
                      >
                        <VisibilityIcon color="info" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" disableInteractive>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          setDeleteId(attendance.id);
                          setOpenDialogDelete(true);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </div>
  );
}

export default AttendanceTable;
