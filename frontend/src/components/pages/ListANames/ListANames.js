import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addARecordThunk,
  deleteARecordThunk,
  getARecordsThunk,
  pingUrlThunk,
} from "../../../services/dns-thunk";
import NavBar from "../../parts/NavBar/NavBar";

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

  const [aName, setAName] = useState("");
  const [ip, setIp] = useState("");
  const [pingResult, setPingResult] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getARecordsThunk({ zoneName }));
  }, [dispatch, zoneName]);

  useEffect(() => {
    if (aRecords !== null) {
      setPingResult(aRecords.map((_) => <span style={{
        color: "#8B8000",
        fontWeight: "bold"
      }}>Unknown</span>));
    }
  }, [aRecords]);

  const ipToString = (ipObject) => {
    return `${ipObject.part_0}.${ipObject.part_1}.${ipObject.part_2}.${ipObject.part_3}`;
  };

  const ipToObject = (ipString) => {
    const parts = ipString.split(".");
    return {
      part_0: parts[0],
      part_1: parts[1],
      part_2: parts[2],
      part_3: parts[3],
    };
  };

  const deleteAName = (aName) => {
    dispatch(deleteARecordThunk({ zoneName, aName }));
    window.location.reload();
  };

  const addANameHandler = () => {
    const ipRegex = new RegExp(
      "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    );
    if (!ipRegex.test(ip)) {
      alert("Invalid IP address");
      return;
    }

    dispatch(
      addARecordThunk({
        zoneName,
        aName,
        ip: ipToObject(ip),
      })
    );
  };

  const pingUrl = (aName, idx) => {
    dispatch(pingUrlThunk({
      url: `${aName}.${zoneName}`
    })).then((result) => {
      setPingResult((prev) => {
        const newPingResult = [...prev];
        newPingResult[idx] = result.payload.data.resolved ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Resolved</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Not Resolved</span>
        );

        return newPingResult;
      });
    });
  };

  return (
    <div>
      <NavBar />

      <div
        style={{
          margin: "10px",
        }}
      >
        <div>
          <TextField
            id="a-name"
            label="A Name"
            variant="outlined"
            value={aName}
            onChange={(e) => setAName(e.target.value)}
            style={{ marginRight: "10px" }}
            autoFocus
          />
          <TextField
            id="ip"
            label="IP"
            variant="outlined"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <Button variant="contained" color="primary" onClick={addANameHandler}>
            Add A Name
          </Button>
        </div>
        <br />
        {aRecords !== null && aRecords.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 100 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>A Name</StyledTableCell>
                    <StyledTableCell align="right">IP</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                    <StyledTableCell align="right">Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aRecords.map((aRecord, idx) => (
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
                        &nbsp;
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => pingUrl(aRecord.name, idx)}
                        >
                          Ping
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {pingResult[idx]}
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
    </div>
  );
};

export default ListANames;
