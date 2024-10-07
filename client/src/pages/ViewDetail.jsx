import React from "react";

import Navbar from "../components/Navbar/navbar";
import ViewDetail from "../components/viewDetail/ViewDetails";
import SpeedDial2 from "../components/speedDeail";
import Footer from "../components/Footer/footer";

function View_Detail() {
  

  return (
    <div>
     <Navbar />
     <ViewDetail />
     <SpeedDial2 />
     <Footer />
   
    </div>
  );
}

export default View_Detail;