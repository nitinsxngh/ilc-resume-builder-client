import type { NextPage } from 'next';
import styled from 'styled-components';
import Head from 'next/head';
import Hero from 'src/home/hero';
import Features from 'src/home/features';
import NavBar from 'src/home/navbar';
import Footer from 'src/home/footer';

const Main = styled.main`
  margin: 0;
  padding: 0;
  max-width: 100%;
  overflow-x: hidden;
`;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ILC Blockchain Resume Builder</title>
        <meta name="description" content="Build, verify, and store your professional credentials on the blockchain with ILC Network" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="blockchain, resume builder, ILC network, professional credentials, decentralized, verification" />
        <meta name="author" content="ILC Network" />
      </Head>

      <Main>
        <NavBar />
        <Hero />
        <Features />
        <Footer />
      </Main>
    </>
  );
};

export default Home;
