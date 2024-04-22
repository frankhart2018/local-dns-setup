import React, { useEffect } from "react";
import Card from "@mui/material/Card";

import "./ListZones.css";
import CardContents from "./CardContent";
import { useDispatch, useSelector } from "react-redux";
import { getZonesThunk } from "../../../services/dns-thunk";
import NavBar from "../../parts/NavBar/NavBar";

const ListZones = () => {
  const { zones } = useSelector((state) => state.dns);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getZonesThunk());
  }, [dispatch]);

  return (
    <div>
      <NavBar />
      <div className="row">
        {zones !== null && zones.length > 0 ? (
          zones.map((zone) => {
            return (
              <>
                <Card variant="outlined" className="card">
                  <CardContents zoneObj={zone} />
                </Card>
              </>
            );
          })
        ) : (
          <h2>No zones found</h2>
        )}
      </div>
    </div>
  );
};

export default ListZones;
