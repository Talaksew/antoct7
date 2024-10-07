import React from "react";

import Navbar from "../components/Navbar/navbar";

import Officers from "../components/Officers/officers";
import Footer from "../components/Footer/footer";

function Home() {
  

  return (
    <div>
     <Navbar />     
     <Officers />
     <Footer />
   
    </div>
  );
}

export default Home;