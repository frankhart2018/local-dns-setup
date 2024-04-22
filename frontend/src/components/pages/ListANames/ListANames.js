import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteARecordThunk,
  getARecordsThunk,
} from "../../../services/dns-thunk";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ListANames = () => {
  const { aRecords } = useSelector((state) => state.dns);

  const pathName = window.location.pathname;
  const zoneName = pathName.split("/")[2];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getARecordsThunk({ zoneName }));
  }, [dispatch, zoneName]);

  useEffect(() => {
    console.log(aRecords);
  }, [aRecords]);

  const ipToString = (ipObject) => {
    return `${ipObject.part_0}.${ipObject.part_1}.${ipObject.part_2}.${ipObject.part_3}`;
  };

  const deleteAName = (aName) => {
    dispatch(deleteARecordThunk({ zoneName, aName }));
    window.location.reload();
  };

  return (
    <div
      className="container"
      style={{
        margin: "10px",
      }}
    >
      {aRecords !== null && aRecords.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>A Name</StyledTableCell>
                  <StyledTableCell align="right">IP</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aRecords.map((aRecord) => (
                  <StyledTableRow key={aRecord.name}>
                    <StyledTableCell component="th" scope="row">
                      {aRecord.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {ipToString(aRecord.ip)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteAName(aRecord.name)}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <div>No A Records found for this zone.</div>
      )}
    </div>
  );
};

export default ListANames;
