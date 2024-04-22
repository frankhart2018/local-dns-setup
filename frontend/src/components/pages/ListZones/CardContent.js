import React from "react";

import { Button, CardActions, CardContent, Typography } from "@mui/material";

const CardContents = ({ zoneObj }) => {
  const ipToString = (ipObject) => {
    return `${ipObject.part_0}.${ipObject.part_1}.${ipObject.part_2}.${ipObject.part_3}`;
  };

  const redirectToANamesPage = () => {
    window.location.href = `/a-names/${zoneObj.name}`;
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
      </CardActions>
    </React.Fragment>
  );
};

export default CardContents;
