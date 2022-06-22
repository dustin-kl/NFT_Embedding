import React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import Checkbox from "@mui/material/Checkbox";

export const NFTCard = ({ pic, checked, setChecked }) => {
  const handleChange = (event) => {
    if (event.target.checked) {
      setChecked(pic);
    }
  };
  return (
    <div style={{ width: "25%", display: "flex", flexDirection: "column" }}>
      <div style={{ borderRadius: "6px" }}>
        <Image
          height={2000}
          width={1600}
          style={{
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
          }}
          src={pic}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderBottomLeftRadius: "6px",
            borderBottomRightRadius: "6px",
            height: "110px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            paddingTop: "10px",
            backgroundColor: "#fe025a",
          }}
        >
          <Checkbox
            checked={checked == pic}
            onChange={handleChange}
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: "60px",
              },
            }}
            icon={<SportsBasketballIcon />}
            checkedIcon={
              <SportsBasketballIcon
                sx={{
                  color: "white",
                }}
              />
            }
          />

          {checked == pic ? (
            <h3
              style={{
                fontSize: "17px",
                fontFamily: "SK Cuber",
                color: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {" "}
              Selected!{" "}
            </h3>
          ) : (
            <h3
              style={{
                fontSize: "17px",
                fontFamily: "SK Cuber",
                color: "#75092a",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {" "}
              Select NFT{" "}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};
