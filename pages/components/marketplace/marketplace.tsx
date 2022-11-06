/** @format */

import axios from "axios"
import {Card, Grid, Row, Text} from "@nextui-org/react"
import Gashapon_V1 from "../../../Gashapon_V1.json"
import React, {useState} from "react"
// import OneNftComponent from "../modals/oneNft"

const MarketplaceComponent: any = ({}) => {
  const [data, updateData] = useState([] as any[])
  const [dataFetched, updateFetched] = useState(false)

  async function getAllNFTs() {
    const ethers = require("ethers")
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    //Pull the deployed contract instance
    let contract = new ethers.Contract(Gashapon_V1.address, Gashapon_V1.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items: any[] = await Promise.all(
      transaction.map(async (i: any) => {
        const tokenURI = await contract.tokenURI(i.tokenId)
        let meta = await axios.get(tokenURI)
        const data: {name: string; image: string; description: string} = meta.data

        let price = ethers.utils.formatUnits(i.price.toString(), "ether")
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: data.image,
          name: data.name,
          description: data.description,
        }
        return item
      })
    )
    updateFetched(true)
    updateData(items)
  }

  if (!dataFetched) getAllNFTs()

  // const [visible, setVisible] = React.useState({} as any)
  // const handler = (index: any) => {
  //   setVisible({
  //     show: {
  //       [index]: true,
  //     },
  //   })
  // }

  // const [modalData, setModalData] = useState(null)

  // const handle = (data: any, index: number) => {
  //   console.log(data)
  //   setModalData({
  //     ...data,
  //     index: index,
  //   })
  // }

  return (
    <Grid.Container gap={2} justify='flex-start'>
      {data.map((item, index) => (
        <Grid xs={6} sm={3} key={index}>
          <Card isPressable>
            <Card.Body css={{p: 0}}>
              <Card.Image
                src={item.image}
                objectFit='cover'
                width='100%'
                height={140}
                alt={item.name}
                // onClick={() => {
                //   handle(item, index)
                //   handler(index)
                // }}
              />
            </Card.Body>
            <Card.Footer css={{justifyItems: "flex-start"}}>
              <Row wrap='wrap' justify='space-between' align='center'>
                <Text b>{item.name}</Text>
                <Text
                  css={{color: "$accents7", fontWeight: "$semibold", fontSize: "$sm"}}
                >
                  {item.price}
                </Text>
              </Row>
            </Card.Footer>
          </Card>
          {/* <OneNftComponent
            show={visible?.show?.[modalData?.index] === true}
            data={{
              name: modalData?.name,
              image: modalData?.image,
              description: modalData?.description,
              price: modalData?.price,
            }}
          /> */}
        </Grid>
      ))}
    </Grid.Container>
  )
}

export default MarketplaceComponent
