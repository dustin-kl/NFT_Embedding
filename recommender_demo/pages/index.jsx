import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { NFTCard } from "/home/dustin/Documents/Ducia/NFT_Embedding/recommender_demo/pages/Components/nftCard"
//import { NFTCard } from "./pages/Components/nftCard.jsx"

const Home = () => {
  const [wallet, setWalletAddress] = useState("")
  const [NFTs, setNFTs] = useState([])


  const fetchNFTs = async () => {
    let nfts
    var requestOptions = {
      method: 'GET'
    }
    const api_key = "QptlBSlLspchzOK2mEHRDogveEdOGqNO"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    const fetchURL = `${baseURL}?owner=${wallet}`;

    nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }
  }


  const runPythonScript = async () => {

    const spawn = require('child_process')
    const data_to_pass_in = {
      data_sent: 'blabla1',
      data_returned: undefined
    }

    console.log("Data sent to pass in: ", data_to_pass_in)

    const python_process = spawn('python', ['../scripts/testir.py', JSON.stringify(data_to_pass_in)])

    python_process.stdout.on('data', (data) => {
      console.log("Data received from python script: ", JSON.parse(data.toString()))
    })
  }


  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      {/* <link rel="stylesheet" href="https://pyscript.net/alpha/pyscript.css" />
      <script defer src="https://pyscript.net/alpha/pyscript.js"></script>
      <py-env>
        - numpy
      </py-env>
      <py-script> src="python.py"</py-script>
      <py-script>
        print('Hello Python')
        #print(np.sum([11,2,3]))
      </py-script> */}
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            fetchNFTs()
          }
        }>Show my NFTs!
        </button>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            runPythonScript()
          }
        }>Test!
        </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.filter((item, idx) => idx < 10).map(nft => {
            console.log(nft.media[0].gateway)
            console.log(typeof (nft.media[0].gateway))
            if (nft.media[0].gateway.length > 0) {
              return (
                <NFTCard nft={nft}></NFTCard>
              )
            }
          })
        }
      </div>
    </div>
  )
}

export default Home
