import React  from "react";

import "../App.css";
import Navbar from "../components/Navbar/navbar";

import Footer from "../components/Footer/footer";
import AddHotel from "../components/imgImport/addHotel";

function addNew() {
  

  return (
    <div>
     <Navbar />
    
     <AddHotel />
     <Footer />
   
    </div>
  );
}

export default addNew;