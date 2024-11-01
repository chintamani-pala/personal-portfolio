import { GoogleTagManager } from '@next/third-parties/google';
import { personalData } from "@/utils/data/personal-data";
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/footer';
import Navbar from './components/navbar';
import './css/card.scss';
import './css/globals.scss';
const inter = Inter({ subsets: ['latin'] });
import {Suspense} from "react"

export const metadata = {
  title: `${personalData.name}: Portfolio - Web developer`,
  description: `Welcome to ${personalData.name}'s portfolio. I'm a self-taught full stack developer passionate about learning and collaboration. Let's create innovative web solutions together..`,
  keywords:"chintamani pala , full stack web developer, chintamani , pala, web developer , backend developer, frontend developer, software developer, giet university"
};

export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          <Navbar />
          {children}
        </main>
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
    </html>
  )
};
