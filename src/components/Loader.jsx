import React from "react";
import { Backdrop, Skeleton } from "@mui/material";
import "./Loader.css";

const Loader = (props) => {
  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={props.open}>
        {/* <HashLoader color="white" /> */}
        <div className="loader">
          <div className="outer"></div>
          <div className="middle"></div>
          <div className="inner"></div>
        </div>
      </Backdrop>
    </>
  );
};

export default Loader;

const SkeletonLoader = (props) => {
  return (
    <>
      <Skeleton
        variant="rounded"
        sx={{ my: 2, height: 50 }}
        animation="pulse"
      />
    </>
  );
};

export { SkeletonLoader };
