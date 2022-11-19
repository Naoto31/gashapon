/** @format */

import React, {useEffect, useState} from "react"
import {Navbar, Button, Text} from "@nextui-org/react"

const NavbarComponent: any = ({}) => {
  const [connected, toggleConnect] = useState(false)
  // const location = useLocation()
  const [currAddress, updateAddress] = useState("0x")

  async function getAddress() {
    const ethers = require("ethers")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      const signer = provider.getSigner()
      const addr = await signer.getAddress()
      updateAddress(addr)
    } catch (e) {
      console.log("no account is connected")
      console.log("test")
      return false
    }
    return true
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton")
    if (!ethereumButton) return
    ethereumButton.textContent = "Connected"
    // ethereumButton.classList.remove("hover:bg-blue-70")
    // ethereumButton.classList.remove("bg-blue-500")
    // ethereumButton.classList.add("hover:bg-green-70")
    // ethereumButton.classList.add("bg-green-500")
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({method: "eth_chainId"})
    if (chainId !== "0x5") {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{chainId: "0x5"}],
      })
    }
    await window.ethereum.request({method: "eth_requestAccounts"}).then(async () => {
      updateButton()
      const hasAddress = await getAddress()
      if (hasAddress) {
        window.location.replace(location.pathname)
      }
    })
  }

  useEffect(() => {
    let val = window?.ethereum?.isConnected() // In details, this function refers if the provider can make RPC requests to the current chain.
    if (val) {
      // declare the data fetching function
      const fetch = async () => {
        const hasAddress = await getAddress()
        if (hasAddress) {
          toggleConnect(val)
          updateButton()
        }
      }

      // call the function
      fetch()
        // make sure to catch any error
        .catch(console.error)
    }

    window?.ethereum?.on("accountsChanged", () => {
      window.location.replace(location.pathname)
    })
  }, [])

  return (
    <Navbar isBordered variant='floating'>
      <Navbar.Brand>
        <Text color='inherit'>Gashapon</Text>
      </Navbar.Brand>

      <Navbar.Content>
        <Navbar.Item>
          <Button className='enableEthereumButton' flat onClick={connectWebsite}>
            {connected ? "Connected" : "Connect Wallet"}
          </Button>
        </Navbar.Item>
        <div className='text-white text-bold text-right mr-10 text-sm'>
          {currAddress !== "0x"
            ? "Connected to"
            : "Not Connected. Please login to view NFTs"}{" "}
          {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
        </div>
      </Navbar.Content>
    </Navbar>
  )
}

export default NavbarComponent
