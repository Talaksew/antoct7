import React from "react";

import Navbar from "../components/Navbar/navbar";
import Footer from "../components/Footer/footer";
import ContactUss from "../components/contactus"
import SpeedDial2 from "../components/speedDeail";
function Contact() {
  return (
    <div>
     <Navbar />
    
     <ContactUss />
     <SpeedDial2 />
     <Footer />
    </div>
  );
}

export default Contact;