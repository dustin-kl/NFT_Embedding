import Head from "next/head";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { abi } from "../constants/abi";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { DataGrid } from "@material-ui/data-grid";
import myData from "../../target_users.json";
import { NFTCard } from "./nftCard.jsx";
import mypic1 from "../public/images/NFT_1.gif";
import mypic2 from "../public/images/NFT_2.gif";
import mypic3 from "../public/images/NFT_3.jpg";
import mypic4 from "../public/images/NFT_4.jpg";
import mypic5 from "../public/images/NFT_5.gif";
import { MintButton } from "./mintButton";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import styles from "./Test.module.css";

export const injected = new InjectedConnector();

const useStyles = makeStyles({
  root: {
    backgroundColor: "#F4EFE9",
  },
  gradtext: {
    backgroundImage: "linearGradient(to bottom, #FF005B, #FFD4A9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
});

export default function Home() {
  const classes = useStyles();
  const [hasMetamask, setHasMetamask] = useState(false);
  const [listSent, setListSent] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [background1, setBackground1] = useState("white");
  const [checked, setChecked] = useState("");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  useEffect(() => {
    if (background1 == "white") {
      setBackground1("green");
    } else {
      setBackground1("white");
    }
  }, [hasMetamask]);

  const {
    active,
    activate,
    chainId,
    account,
    library: provider,
  } = useWeb3React();

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function execute() {
    if (active) {
      const signer = provider.getSigner();
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        await contract.store(42);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "Account Number",
      width: "200",
      align: "left",
    },
    {
      field: "address",
      headerName: "Wallet Address",
      sortable: false,
      width: "400",
      align: "left",
    },
    {
      field: "sent",
      headerName: "Already Sent",
      width: "200",
      type: "bool",
    },
    {
      field: "balance",
      headerName: "Balance (ETH)",
      width: "170",
      type: "number",
    },
    {
      field: "nfts",
      headerName: "Number of Basketball NFTs",
      width: "300",
      type: "number",
    },
  ];

  const rows = Object.keys(myData).map((add, index) => {
    return {
      id: index + 1,
      address: add,
      sent: listSent.includes(add) ? true : false,
      balance: myData[add][1].toFixed(3),
      nfts: myData[add][0],
    };
  });
  console.log(selectionModel);

  return (
    <div
      style={{
        backgroundColor: "#0F0F12",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <Head>
          <link rel="stylesheet" href="https://use.typekit.net/fox1qde.css" />
        </Head>
      </div>
      <div>
        {hasMetamask ? (
          active ? (
            <div></div>
          ) : (
            <button
              className={styles.btn}
              style={{
                height: "80px",
                width: "200px",
                fontSize: "18px",
                marginTop: "30px",
                marginRight: "30px",
                float: "right",
                fontFamily: "SK Cuber",
              }}
              onClick={() => connect()}
            >
              Connect Metamask
            </button>
          )
        ) : (
          "Please install metamask"
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <h1
          style={{
            fontSize: "80px",
            fontFamily: "SK Cuber",
            color: "white",
            textAlign: "center",
          }}
        >
          🏀 Krause House Airdrop Tool 🏀
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          marginTop: "40px",
          fontFamily: "headline-gothic-atf",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <h1
          className={styles.test}
          style={{
            fontSize: "50px",
            display: "inline",
            float: "left",
          }}
        >
          Step 1:
        </h1>
        <h1
          style={{
            fontSize: "50px",
            color: "#F4EFE9",
            display: "inline",
          }}
        >
          &nbsp; Select The Addresses to Target
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "15px",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <div
          style={{
            height: "370px",
            fontSize: "10px",
            color: "white",
            width: "100%",
          }}
        >
          <DataGrid
            className={classes.root}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            isRowSelectable={(params) => params.row.sent == false}
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
          marginTop: "40px",
          fontFamily: "headline-gothic-atf",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <h1
          className={styles.test}
          style={{
            fontSize: "50px",
            display: "inline",
          }}
        >
          Step 2:
        </h1>
        <h1
          style={{
            fontSize: "50px",
            color: "#F4EFE9",
            display: "inline",
          }}
        >
          &nbsp; Choose the NFT Design
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gridGap: "20px",
          marginTop: "15px",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <NFTCard
          pic={mypic1}
          checked={checked}
          setChecked={setChecked}
        ></NFTCard>
        <NFTCard
          pic={mypic3}
          checked={checked}
          setChecked={setChecked}
        ></NFTCard>
        <NFTCard
          pic={mypic5}
          checked={checked}
          setChecked={setChecked}
        ></NFTCard>
        <NFTCard
          pic={mypic4}
          checked={checked}
          setChecked={setChecked}
        ></NFTCard>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          marginTop: "40px",
          fontFamily: "headline-gothic-atf",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <h1
          className={styles.test}
          style={{
            fontSize: "50px",
            display: "inline",
          }}
        >
          Step 3:
        </h1>
        <h1
          style={{
            fontSize: "50px",
            color: "#F4EFE9",
            display: "inline",
          }}
        >
          &nbsp; Choose the Description Message
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: "5px",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <p style={{ color: "#F4EFE9" }}>
          {" "}
          Feel free to modify the Placeholder:
        </p>
        <textarea
          id="phone"
          style={{ width: "100%", borderRadius: "4px", height: "90px" }}
        >
          Hey Basketball Fan! Our mission is to own an NBA team and we would
          love to have you join us and become part of the team 🏀 🚀
        </textarea>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
          marginTop: "40px",
          fontFamily: "headline-gothic-atf",
          marginLeft: "120px",
          marginRight: "120px",
        }}
      >
        <h1
          className={styles.test}
          style={{
            fontSize: "50px",
            display: "inline",
          }}
        >
          Step 4:
        </h1>
        <h1
          style={{
            fontSize: "50px",
            color: "#F4EFE9",
            display: "inline",
          }}
        >
          &nbsp; Mint and Grow the DAO!
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "40px",
          marginBottom: "40px",
        }}
      >
        <div>
          <button
            className={styles.btn}
            style={{
              height: "120px",
              width: "350px",
              fontSize: "30px",
              marginRight: "30px",
              fontFamily: "SK Cuber",
            }}
            onClick={() => execute()}
          >
            Execute Airdrop!
          </button>
          <button
            className={styles.btn2}
            style={{
              height: "120px",
              width: "350px",
              fontSize: "30px",
              marginRight: "30px",
              fontFamily: "SK Cuber",
            }}
            onClick={() => execute()}
          >
            Track Conversion
          </button>
        </div>
      </div>
    </div>
  );
}
