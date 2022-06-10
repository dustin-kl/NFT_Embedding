import React, { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export const NFTCard = ({
  nft,
  recAdd,
  setrecAdd,
  NFTRecommendations,
  setNFTRecommendations,
  setUserNFTs,
}) => {
  const [contactAddressList, setContactAddressList] = useState(["dd"]);

  const callApiAsync = async (current_address) => {
    var requestOptions = {
      method: "GET",
    };
    const api_key = "QptlBSlLspchzOK2mEHRDogveEdOGqNO";
    const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTMetadata`;

    const tokenId = "1";
    const fetchURL = `${baseURL}?contractAddress=${current_address}&tokenId=${tokenId}&tokenType=${tokenType}`;
    rec_nft = await fetch(fetchURL, requestOptions).then((data) => data.json());
    setNFTRecommendations((NFTRecommendations) => [
      ...NFTRecommendations,
      rec_nft,
    ]);

    return functionThatReturnsAPromise(item);
  };

  const CreateRecommendations = async () => {
    contactAddressList.length &&
      contactAddressList.map((current_address) => {
        callApiAsync(current_address);
      });
  };

  return (
    <div className="w-1/4 flex flex-col ">
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
            Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}
          </p>
          <p className="text-gray-600">
            Conract Address:{" "}
            {`${nft.contract.address.substr(
              0,
              4
            )}...${nft.contract.address.substr(
              nft.contract.address.length - 4
            )}`}
          </p>
        </div>

        <div className="flex-grow mt-2">
          <p className="text-gray-600">
            Description: {nft.description?.substr(0, 150)}
          </p>
        </div>
        <div className="flex justify-center mb-1">
          <button
            className="py-2 px-4 bg-blue-500 w-1/2 text-center rounded-m text-white cursor-pointer"
            onClick={() => {
              const address = nft.contract.address;
              // da kommt code um contactAddressList zu initialisieren
              setContactAddressList(
                "0xeF1a89cbfAbE59397FfdA11Fc5DF293E9bC5Db90"
              );
              console.log(contactAddressList);
              CreateRecommendations;
              setUserNFTs(false);
              setrecAdd(address);
              console.log(contactAddressList);
              console.log(NFTRecommendations);
            }}
          >
            See Similar NFTs
          </button>
        </div>
      </div>
    </div>
  );
};
