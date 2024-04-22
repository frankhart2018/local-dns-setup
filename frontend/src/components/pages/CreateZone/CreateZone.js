import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import { useDispatch } from "react-redux";
import { addZoneThunk } from "../../../services/dns-thunk";

const CreateZone = () => {
  const [zone, setZone] = useState({
    name: "",
    type: "master",
    soa: {
      admin_email: "",
      serial: "",
      refresh: "",
      update_retry: "",
      expire: "",
      min_TTL: "",
    },
    ip: {
      part_0: 0,
      part_1: 0,
      part_2: 0,
      part_3: 0,
    },
  });
  const [ip, setIp] = useState("");

  const dispatch = useDispatch();

  const addZoneHandler = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(zone.soa.admin_email)) {
      alert("Invalid email");
      return;
    }

    const ipRegex = new RegExp(
      "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    );
    if (!ipRegex.test(ip)) {
      alert("Invalid IP address");
      return;
    }

    const ipObject = ip.split(".");
    setZone({
      ...zone,
      ip: {
        part_0: ipObject[0],
        part_1: ipObject[1],
        part_2: ipObject[2],
        part_3: ipObject[3],
      },
    });
    const zoneCopy = { ...zone };
    zoneCopy.ip = {
      part_0: ipObject[0],
      part_1: ipObject[1],
      part_2: ipObject[2],
      part_3: ipObject[3],
    };

    dispatch(addZoneThunk(zoneCopy));
    window.location.href = "/";
  };

  return (
    <div>
      <NavBar />
      <div
        style={{
          margin: "10px",
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) => setZone({ ...zone, name: e.target.value })}
          autoFocus
        />
        <br />
        <br />
        <TextField
          label="Admin Email"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) =>
            setZone({
              ...zone,
              soa: { ...zone.soa, admin_email: e.target.value },
            })
          }
        />
        <br />
        <br />
        <TextField
          label="Serial"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) =>
            setZone({ ...zone, soa: { ...zone.soa, serial: e.target.value } })
          }
        />
        <br />
        <br />
        <TextField
          label="Refresh"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) =>
            setZone({ ...zone, soa: { ...zone.soa, refresh: e.target.value } })
          }
        />
        <br />
        <br />
        <TextField
          label="Update Retry"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) =>
            setZone({
              ...zone,
              soa: { ...zone.soa, update_retry: e.target.value },
            })
          }
        />
        <br />
        <br />
        <TextField
          label="Expire"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) =>
            setZone({ ...zone, soa: { ...zone.soa, expire: e.target.value } })
          }
        />
        <br />
        <br />
        <TextField
          label="Min TTL"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) =>
            setZone({ ...zone, soa: { ...zone.soa, min_TTL: e.target.value } })
          }
        />
        <br />
        <br />
        <TextField
          label="IP"
          variant="outlined"
          style={{ marginRight: "10px" }}
          onChange={(e) => setIp(e.target.value)}
        />
        <br />
        <br />
        <Button variant="contained" color="primary" onClick={addZoneHandler}>
          Add A Name
        </Button>
      </div>
    </div>
  );
};

export default CreateZone;
