import React from "react";

import { Button, CardActions, CardContent, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteZoneThunk } from "../../../services/dns-thunk";
import { DeleteZonePayload } from "../../../services/request-payload";

const CardContents = ({ zoneObj }) => {
  const ipToString = (ipObject) => {
    return `${ipObject.part_0}.${ipObject.part_1}.${ipObject.part_2}.${ipObject.part_3}`;
  };

  const redirectToANamesPage = () => {
    window.location.href = `/a-names/${zoneObj.name}`;
  };

  const dispatch = useDispatch();

  const deleteZone = () => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      const payload: DeleteZonePayload = {
        zoneName: zoneObj.name,
      };
      dispatch(
        deleteZoneThunk(payload),
      );
      window.location.reload();
    } else {
      alert("Zone deletion cancelled");
    }
  };

  return (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Zone
        </Typography>
        <Typography variant="h5" component="div">
          {zoneObj.name}
        </Typography>
        <Typography variant="body2">
          <ul>
            <li>
              <strong>IP: </strong>
              {ipToString(zoneObj.ip)}
            </li>
            <li>
              <strong>Admin Email: </strong>
              {zoneObj.soa.admin_email}
            </li>
            <li>
              <strong>Serial: </strong>
              {zoneObj.soa.serial}
            </li>
            <li>
              <strong>Refresh: </strong>
              {zoneObj.soa.refresh}
            </li>
            <li>
              <strong>Update Retry: </strong>
              {zoneObj.soa.update_retry}
            </li>
            <li>
              <strong>Expire: </strong>
              {zoneObj.soa.expire}
            </li>
            <li>
              <strong>Min TTL: </strong>
              {zoneObj.soa.min_TTL}
            </li>
          </ul>
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" size="small" onClick={redirectToANamesPage}>
          Check A Names
        </Button>

        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={deleteZone}
        >
          Delete
        </Button>
      </CardActions>
    </React.Fragment>
  );
};

export default CardContents;
