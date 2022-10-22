/** @format */

import React from "react"
import {Navbar, Button, Link, Text} from "@nextui-org/react"

const NavbarComponent: any = ({}) => {
  return (
    <Navbar isBordered variant='floating'>
      <Navbar.Brand>
        <Text b color='inherit' hideIn='xs'>
          Gashapon
        </Text>
      </Navbar.Brand>

      <Navbar.Content>
        <Navbar.Item>
          <Button auto flat as={Link} href='#'>
            Connect Wallet
          </Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  )
}

export default NavbarComponent
