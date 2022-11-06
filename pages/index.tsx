/** @format */
import React, {useState} from "react"
import type {NextPage} from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import gashapon_1 from "assets/gashapon_1.png"
import dynamic from "next/dynamic"
import {Button, Modal, Text} from "@nextui-org/react"
import {uploadFileToIPFS, uploadJSONToIPFS} from "../pinata"
import Gashapon_V1 from "../Gashapon_V1.json"
import MarketplaceComponent from "./components/marketplace/marketplace"
import * as ethers from "ethers"

const NavbarComponent = dynamic(() => import("./components/navbar/navbar"), {ssr: false}) // to avoid warning, we need to use dynamic

const Home: NextPage = () => {
  const [visible, setVisible] = React.useState(false)
  const handler = () => {
    setVisible(true)
  }
  const closeHandler = () => {
    setVisible(false)
  }

  const [formParams, updateFormParams] = useState({name: "", description: "", price: ""})
  const [fileURL, setFileURL] = useState(null)
  // const ethers = require("ethers")
  const [message, updateMessage] = useState("")
  // const location = useLocation()

  async function OnChangeFile(e: any) {
    const file = e.target.files[0]

    try {
      const response = await uploadFileToIPFS(file)
      if (response.success === true) {
        console.log("Uploaded image to Pinata:", response.pinataURL)
        setFileURL(response.pinataURL)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function uploadMetadataToIPFS() {
    const {name, description, price} = formParams
    //Make sure that none of the fields are empty
    if (!name || !description || !price || !fileURL) return

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    }

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON)
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response)
        return response.pinataURL
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e)
    }
  }

  async function listNFT(e: any) {
    //    e.preventDefault()

    try {
      const metadataURL = await uploadMetadataToIPFS()
      const provider = new ethers.providers.Web3Provider(window.ethereum) // should fix the error
      const signer = provider.getSigner()

      updateMessage("Please wait ... uploading (up to 5mins)")

      let contract = new ethers.Contract(Gashapon_V1.address, Gashapon_V1.abi, signer)
      const price = ethers.utils.parseUnits(formParams.price, "ether")
      let listingPrice = await contract.getListPrice()
      listingPrice = listingPrice.toString()

      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      })
      await transaction.wait()

      alert("Successfully listed your NFT!")
      updateMessage("")
      updateFormParams({name: "", description: "", price: ""}) // we could set price same
      window.location.replace("/")
    } catch (e) {
      console.log(e)
    }
  }

  let [show, toggle] = useState(false)
  const toggleButton = () => {
    return toggle(!show)
  }

  async function play() {
    try {
      const ethers = require("ethers")
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      //Pull the deployed contract instance
      let contract = new ethers.Contract(Gashapon_V1.address, Gashapon_V1.abi, signer)
      const salePrice = ethers.utils.parseUnits("0.001", "ether") // this will be defined later, but for now every nft costs 0.001
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
      //run the executeSale function
      const count = await contract.getCurrentToken()
      const randomTokenId = Math.floor(Math.random() * count + 1)
      let transaction = await contract.executeSale(randomTokenId, {value: salePrice})
      await transaction.wait()

      alert("You successfully bought the NFT!")
      updateMessage("")
    } catch (e) {
      alert("Upload Error" + e)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Gashapon</title>
        <meta name='description' content='Gashapon' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <NavbarComponent />

      <main className={styles.main}>
        <h1 className={styles.title}>Let us play Gashapon!</h1>

        <div className={styles.img_block}>
          <Image
            style={{cursor: "pointer"}}
            src={gashapon_1}
            alt='img'
            onClick={toggleButton}
          />
        </div>

        {show ? (
          <div className={styles.marketplace_container}>
            <MarketplaceComponent />
          </div>
        ) : (
          ""
        )}

        <div className={styles.grid}>
          <Button auto color='gradient' onClick={play}>
            Play Gashapon
          </Button>

          <Button auto color='secondary' flat shadow onClick={handler}>
            Add NFT
          </Button>
        </div>

        <Modal
          closeButton
          blur
          aria-labelledby='modal-title'
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id='modal-title' size={18}>
              Add your NFT to{" "}
              <Text b size={18}>
                Gashapon!
              </Text>
            </Text>
          </Modal.Header>
          <Modal.Body>
            <form className='bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4'>
              <h3 className='text-center font-bold text-purple-500 mb-8'>
                Upload your NFT to the marketplace
              </h3>
              <div className='mb-4'>
                <label
                  className='block text-purple-500 text-sm font-bold mb-2'
                  htmlFor='name'
                >
                  NFT Name
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='name'
                  type='text'
                  placeholder='Axie#4563'
                  onChange={e => updateFormParams({...formParams, name: e.target.value})}
                  value={formParams.name}
                ></input>
              </div>
              <div className='mb-6'>
                <label
                  className='block text-purple-500 text-sm font-bold mb-2'
                  htmlFor='description'
                >
                  NFT Description
                </label>
                <textarea
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='description'
                  placeholder='Axie Infinity Collection'
                  value={formParams.description}
                  onChange={e =>
                    updateFormParams({...formParams, description: e.target.value})
                  }
                ></textarea>
              </div>
              <div className='mb-6'>
                <label
                  className='block text-purple-500 text-sm font-bold mb-2'
                  htmlFor='price'
                >
                  Price (in ETH)
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='number'
                  placeholder='Min 0.001 ETH'
                  step='0.001'
                  value={formParams.price}
                  onChange={e => updateFormParams({...formParams, price: e.target.value})}
                ></input>
              </div>
              <div>
                <label
                  className='block text-purple-500 text-sm font-bold mb-2'
                  htmlFor='image'
                >
                  Upload Image
                </label>
                <input type={"file"} onChange={OnChangeFile}></input>
              </div>
              <br></br>
              {/* <div className='text-green text-center'>{message}</div> */}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color='error' onClick={closeHandler}>
              Close
            </Button>
            <Button auto onClick={listNFT}>
              List your NFT
            </Button>
          </Modal.Footer>
        </Modal>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by Naoto & Pung
          {/* <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span> */}
        </a>
      </footer>
    </div>
  )
}

export default Home
