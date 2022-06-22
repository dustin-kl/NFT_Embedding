import { useState, useEffect } from "react";
import { constants, utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { DAppProvider, useEthers, useContractFunction } from "@usedapp/core";
import CollectibleCreator from "../../target_users2.json";
import {
  Button,
  Snackbar,
  CircularProgress,
  ImageList,
  makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export const MintButton = () => {
  const METADATA =
    "https://ipfs.io/ipfs/QmYHT7H8GdCaPzViFfAwGoK3spbq8bEkqAB9kMzNhhLeUe";
  const { chainId } = useEthers();
  const { abi } = CollectibleCreator;
  const collectibleCreatorAddress = chainId ? "137" : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(
    collectibleCreatorAddress,
    tokenFarmInterface
  );

  const { state, send } = useContractFunction(
    tokenFarmContract,
    "createCollectible",
    { transactionName: "Wrap" }
  );

  const { status } = state;

  const isMining = status === "Mining";
  const [txStatus, setTxStatus] = useState(false);

  const mint = () => {
    void send(METADATA);
  };

  const handleCloseSnack = () => {
    setTxStatus(false);
  };

  useEffect(() => {
    if (status === "Success") {
      setTxStatus(true);
    }
  }, [status]);

  return (
    <>
      <div>
        <Button
          style={{
            backgroundColor: "black",
            color: "white",
            height: "60px",
            width: "280px",
            borderWidth: "3px",
            borderRadius: "12px",
            borderColor: "white",
            fontSize: "30px",
            marginRight: "30px",
          }}
          onClick={() => mint()}
        >
          {isMining ? <CircularProgress size={26} /> : "Execute Airdrop"}
        </Button>
      </div>
      <div>
        <p>Status: {status}</p>
      </div>
      <div>
        {txStatus ? (
          <Alert onClose={handleCloseSnack} severity="success">
            Your NFT has been minted
          </Alert>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
