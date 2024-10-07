import React from "react";


import Navbar from "../components/Navbar/navbar";
import Filter from "../components/Filter/filter";
import Item from "../components/Items/Item";
import SpeedDial2 from "../components/speedDeail";
import Footer from "../components/Footer/footer";

function Home() {
 

  
  return (
    <div>
     <Navbar />
     <Filter />
     <Item />
     <SpeedDial2 />
     <Footer />
    </div>
  );
}

export default Home;
