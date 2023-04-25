import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useData } from "../context/context";

const Layout = ({ children }: any) => {
  const { sideBar } = useData();

  useEffect(() => {
    if (sideBar) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  });

  return (
    <>
      {/* <Head>
        <title>FinCategory - Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <div className="wrapper bg-gray-50">
        <div className="container px-4 mx-auto">
          <Header />
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
