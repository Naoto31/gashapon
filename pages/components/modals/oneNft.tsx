/** @format */

import {Image, Link, Modal, Text} from "@nextui-org/react"
import React, {useEffect, useState} from "react"

const OneNftComponent = (props: {
  data: {name: string; price: string; description: string; image: string}
  show: boolean
  showDetail: any
}) => {
  const [visible, setVisible] = useState<boolean | null>(null)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Modal
      open={props.show}
      noPadding
      onClose={() => {
        props.showDetail(props.data, 2, false)
      }}
    >
      <Modal.Header css={{position: "absolute", zIndex: "$1", top: 5, right: 8}}>
        <Text color='#363449'>test</Text>
      </Modal.Header>
      <Modal.Body>
        <Image showSkeleton src={props.data?.image} width={400} height={490} />
      </Modal.Body>
    </Modal>
  )
}

export default OneNftComponent
