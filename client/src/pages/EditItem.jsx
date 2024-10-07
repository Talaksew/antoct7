import React from "react";

import Navbar from "../components/Navbar/navbar";
import EditSelectedItem from "../components/viewDetail/editItem";
import SpeedDial2 from "../components/speedDeail";
import Footer from "../components/Footer/footer";

function edititem() {
  

  return (
    <div>
     <Navbar />
     <EditSelectedItem />
     <SpeedDial2 />
     <Footer />
   
    </div>
  );
}

export default edititem;