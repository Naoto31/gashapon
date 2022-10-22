/** @format */
import React from "react"
import type {NextPage} from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import gashapon_1 from "assets/gashapon_1.png"
import dynamic from "next/dynamic"
import {Button} from "@nextui-org/react"

const NavbarComponent = dynamic(() => import("./components/navbar/navbar"), {ssr: false}) // to avoid warning, we need to use dynamic

const Home: NextPage = () => {
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
          <Image src={gashapon_1} alt='img' />
        </div>

        <div className={styles.grid}>
          <Button auto color='gradient' href='#'>
            Play Gashapon
          </Button>
          <Button auto color='secondary' flat href='#'>
            Add NFT
          </Button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
