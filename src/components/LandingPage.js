// import Head from 'next/head'
import Navbar from '../components/Navbar'
import BodyMain from '../components/BodyMain'
import Accordian from '../components/Accordian'
import Footer from '../components/Footer'
import BodyBlocks from '../components/BodyBlocks'
import { Helmet } from "react-helmet";
// import Script from 'next/script'

export default function LandingPage() {

  return (
    
    <>
      {/* <Head>
        <title>Short link Generator: linck</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Reach driven micro-influencer marketing platform for businesses and brands to create campaigns for increased ROI." />
        <meta content="Automated Influencer Marketing Platform: BroadReach" property="og:title" />
        <meta content="Reach driven micro-influencer marketing platform for businesses and brands to create campaigns for increased ROI." property="og:description" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.broadreach.in" />
        <meta name="google-site-verification" content="HvvX1gisMdTNXS66CRCrbZTdRWr_q-P5JXjMDhwP3_4" />
       
        
      </Head> */}

        <Helmet>
        <title>Turn Audio into Stunning Videos | AudioReel</title>
        <meta name="description" content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!" />
        <meta property="og:title" content="Turn Audio into Stunning Videos | AudioReel" />
        <meta property="og:description" content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.audioreel.io" />
        <meta name="google-site-verification" content="Y8Lu6AhM03esRTZg_PR1fnHPfEv-QVz70Px3WMg2boc" />
      </Helmet>


      <Navbar />
      <BodyMain />
      <BodyBlocks />
      {/* <Accordian /> */}
      <Footer />
      {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=G-D0SY7XGY0L"></Script>

        <Script id="analytics-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){
                dataLayer.push(arguments);
                }
                gtag('js', new Date());
                gtag('config', 'G-D0SY7XGY0L');`}}></Script> */}

         </>
  )
}
