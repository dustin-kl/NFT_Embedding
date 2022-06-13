import numpy as np
import pandas as pd
import requests

from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import json


# Import Data
print("Load Description Embeddings")
desc_emb = np.load("/home/dustin/Documents/Ducia/NFT_Embedding/data/desc_emb.npz")  # ("../data/desc_emb.npz")
traindata_desc_embeddings = dict(zip(("desc_embeddings"), (desc_emb[k] for k in desc_emb)))["d"]
print(traindata_desc_embeddings.shape)

print("Load Description Labels, Address Labels and Name Labels")
NFT_attributes = np.load("/home/dustin/Documents/Ducia/NFT_Embedding/data/NFT_attributes.npz")
d = dict(zip(("description_list", "contract_addresses", "name_list"),(NFT_attributes[k] for k in NFT_attributes),))
description_list = d["description_list"]
contract_addresses = d["contract_addresses"]
name_list = d["name_list"]
print(description_list.shape)

train_desc_address = list(zip(contract_addresses, traindata_desc_embeddings, description_list))

# -----------------------------------------------------------------------------------------------

recommendation_list = []

OWNER_LIST = ["0x376A273cFe9512b9f60304D289eccFE6905c020a", "0xA858DDc0445d8131daC4d1DE01f834ffcbA52Ef1", "0x45435e2aEE578EF60E11F8778dFEA69DC98BB946", "0x1fEDFda87C3ad2D6449e31297C89D698F006919a"]
owners_dict = {}

for l, OWNER in enumerate(OWNER_LIST):
    # Here we store the address of the person logging in with MetaMask
    print("Extract Contract Adresses of Owner")
    URL1 = f"https://eth-mainnet.alchemyapi.io/v2/demo/getNFTs/?owner={OWNER}"
    Owner_NFTs = requests.get(URL1).json()["ownedNfts"]

    # Format is (Contractaddress, tokenId)
    owner_nfts = []

    for nft in Owner_NFTs:
        nft_contract_address = nft["contract"]["address"]
        token_id = nft["id"]["tokenId"]
        owner_nfts.append((nft_contract_address, token_id))

    # --------------------------------------------------------------------------------------------------------

    print("Get Description of All NFTs of Owner")
    Owner_nft_fullAttributes = []
    Owner_Descriptions = []

    for nft in owner_nfts:
        nft_contract_address = nft[0]
        token_id = nft[1]
        URL2 = f"https://eth-mainnet.alchemyapi.io/v2/demo/getNFTMetadata?contractAddress={nft_contract_address}&tokenId={token_id}"
        NFT = requests.get(URL2)
        try:
            NFTjson = NFT.json()
        except:
            continue
        if (
            type(NFTjson) is dict
            and "metadata" in NFTjson.keys()
            and type(NFTjson["metadata"]) is dict
            and "description" in NFTjson["metadata"].keys()
        ):
            description = NFTjson["metadata"]["description"]
            Owner_Descriptions.append(description)
            Owner_nft_fullAttributes.append((nft_contract_address, token_id, description))
    # print(Owner_nft_fullAttributes[0])

    # -----------------------------------------------------------------------------------------------------------

    print("Compute Recommendation for each NFT hold")
    # Option 1: User then chooses a specific NFT and we provide X (e.g. X = 5) recommendations
    X = 5

    owner_descriptions = []
    for owner_nft in Owner_nft_fullAttributes:
        owner_descriptions.append(owner_nft[2])

    # Later on here we will just load out finetuned model from above
    model = SentenceTransformer("bert-base-nli-mean-tokens")

    # description embeddings
    nft_description_embeddings = model.encode(
        owner_descriptions,
        normalize_embeddings=True,
        show_progress_bar=True,
        batch_size=64,
    )

    owner_dict = {}

    for k, owner_nft in enumerate(Owner_nft_fullAttributes): #iterate through all nfts hold by owner
        nft_description = owner_nft[2]

        # now a quadruple of distance, embedded desc, desc and address but later will also have id
        recommendations = []
        total_recommendations = 0
        print(f'Compute Recommendation for NFT{k}')
        for i, j in enumerate(train_desc_address): # iterate through all other NFTs 11.000
            train_address = j[0]
            train_description_embedding = j[1]
            train_description = j[2]

            distance = np.sum(np.square((train_description_embedding - nft_description_embeddings[k])))

            if i < X and distance > 1e-6:
                recommendations.append(
                    (
                        distance,
                        train_description_embedding,
                        train_description,
                        train_address,
                    )
                )
                recommendations.sort(key=lambda x: x[0])
            else:
                highest_distance = recommendations[X - 1][0]
                if distance < highest_distance and distance > 1e-6:
                    recommendations[X - 1] = (
                        distance,
                        train_description_embedding,
                        train_description,
                        train_address,
                    )
                    recommendations.sort(key=lambda x: x[0])
        rec = []
        for m, recommendation in enumerate(recommendations):
            rec.append(recommendation[3])
        owner_dict[f'nft{k}'] = rec
        recommendation_list.append(recommendations)


    owner = f"owner{l}"
    owners_dict[owner] = owner_dict

print('Write Data')
with open('/home/dustin/Documents/Ducia/NFT_Embedding/data/data_recommendation.json', 'w') as f:
    json.dump(owners_dict, f)
