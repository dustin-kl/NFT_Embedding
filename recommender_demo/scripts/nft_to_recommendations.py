import numpy as np
import pandas as pd
import requests
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import sys
import json
import ast

X = 20

desc_emb = np.load("../data_copy/desc_emb.npz")
traindata_desc_embeddings = dict(
    zip(("desc_embeddings"), (desc_emb[k] for k in desc_emb))
)["d"]
d = dict(
    zip(
        ("description_list", "contract_addresses", "name_list"),
        (NFT_attributes[k] for k in NFT_attributes),
    )
)
contract_addresses = d["contract_addresses"]
train_add_emb_desc = list(
    zip(contract_addresses, traindata_desc_embeddings, description_list)
)

modelPath = "../data_copy/bert-base-model"
model = SentenceTransformer(modelPath)

input_description = sys.argv[1]

nft_description_embedding = model.encode(
    input_description, normalize_embeddings=True, show_progress_bar=True, batch_size=64
)

# now a quadruple of distance, embedded desc, desc and address but later will also have id
recommendations = []

for i, j in enumerate(train_add_emb_desc):

    train_address = j[0]
    train_description_embedding = j[1]
    train_description = j[2]

    distance = np.sum(
        np.square((train_description_embedding - nft_description_embedding))
    )

    if i < X:
        recommendations.append(
            (distance, train_description_embedding, train_description, train_address)
        )
        recommendations.sort(key=lambda x: x[0])
    else:
        highest_distance = recommendations[X - 1][0]
        if distance < highest_distance:
            recommendations[X - 1] = (
                distance,
                train_description_embedding,
                train_description,
                train_address,
            )
            recommendations.sort(key=lambda x: x[0])

output = [(i[3], 1) for i in recommendations]


sys.stdout.flush()
