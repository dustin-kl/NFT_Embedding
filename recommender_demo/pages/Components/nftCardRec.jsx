import React from "react";
import { useState, useEffect } from "react";

export const NFTCard = ({
  nft,
  recAdd,
  setrecAdd,
  NFTRecommendations,
  setNFTRecommendations,
  contractAddressList,
  setContractAddressList,
  inputDescription,
  setInputDescription,
  setUserNFTs,
  wallet,
}) => {
  const callApiAsync = async (current_address) => {
    var requestOptions = {
      method: "GET",
    };
    const api_key = "QptlBSlLspchzOK2mEHRDogveEdOGqNO";
    const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${api_key}/getNFTMetadata`;

    const tokenId = "1";
    const fetchURL = `${baseURL}?contractAddress=${current_address}&tokenId=${tokenId}`;
    let rec_nft;
    rec_nft = await fetch(fetchURL, requestOptions).then((data) => data.json());
    console.log("hdhd", NFTRecommendations);
    setNFTRecommendations((NFTRecommendations) => [
      ...NFTRecommendations,
      rec_nft,
    ]);
  };

  const CreateRecommendations = async () => {
    setNFTRecommendations([]);
    contractAddressList.length &&
      contractAddressList.map((current_address) => {
        callApiAsync(current_address);
      });
  };

  return (
    <div className="w-1/4 flex flex-col ">
      <link rel="stylesheet" href="https://pyscript.net/alpha/pyscript.css" />
      <script defer src="https://pyscript.net/alpha/pyscript.js"></script>
      <div className="rounded-md">
        <img
          className="object-cover h-128 w-full rounded-t-md"
          src={nft.media[0].gateway}
        ></img>
      </div>
      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
        <div className="">
          <h2 className="text-xl text-gray-800">{nft.title}</h2>
          <p className="text-gray-600">
            NFT Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}
          </p>
          <p className="text-gray-600">
            Collection Address:
            {` ${nft.contract.address.substr(
              0,
              4
            )}...${nft.contract.address.substr(
              nft.contract.address.length - 4
            )}`}
          </p>
        </div>
        <div className="flex-grow">
          <p className="text-gray-600">
            Description:{" "}
            {nft.description === undefined
              ? "NA"
              : nft.description === ""
              ? "NA"
              : nft.description.substr(0, 150)}
          </p>
        </div>
        <div className="flex justify-center mb-1 mt-4">
          <button
            id="btn"
            className="py-2 px-4 bg-blue-500 w-1/2 text-center rounded-m text-white cursor-pointer"
            onClick={() => {
              let recs;
              //recs = dustinfile[wallet][nft.contract.address]
              recs = [
                "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
                "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258",
              ];
              setContractAddressList(recs);
              CreateRecommendations();
              setUserNFTs(false);
            }}
          >
            <script>
              {" "}
              if(UserNFTs == false){" "}
              {(document.getElementById("btn").disabled = true)}
            </script>
            See Similar NFTs
          </button>
        </div>
      </div>
    </div>
  );
};
