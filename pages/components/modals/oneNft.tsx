/** @format */

import {Image, Link, Modal, Text} from "@nextui-org/react"
import React from "react"

const OneNftComponent = (props: {
  show: boolean
  data: {name: string; price: string; description: string; image: string}
}) => {
  console.log("here")
  return (
    <Modal open={props.show} noPadding>
      <Modal.Header css={{position: "absolute", zIndex: "$1", top: 5, right: 8}}>
        <Text color='#363449'>test</Text>
      </Modal.Header>
      <Modal.Body>
        <Image showSkeleton src={props.data.image} width={400} height={490} />
      </Modal.Body>
    </Modal>
  )
}

export default OneNftComponent
