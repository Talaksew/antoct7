import React, { useState, useEffect } from "react";
import axios from "axios";
import "./item.css";
import BedIcon from "@mui/icons-material/Bed";
import WifiIcon from "@mui/icons-material/Wifi";
import BathroomIcon from "@mui/icons-material/Bathroom";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from '@mui/icons-material/Add';
import Details from "./Detailold";

function Pagination({ itemsPerPage, totalItems, paginate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Detail() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [popup, setPopup] = useState('close');

  const togglePopup = () => {
    setPopup(popup === 'close' ? 'open' : 'close');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/item_view');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <section className="offer container section">
        <div className="secContainer">
          <div className="secImage">
            <h2 className="secTitle">Travel with us</h2>
            <p>From the historical places, events...</p>
          </div>
          <div className="mainContent grid">
            {currentItems.map((file) => (
              <div key={file.item_id} className="singleOffer">
                <div className="desImage">
                  <img src={'http://localhost:5000/public/uploads/' + file.image[0]} alt={file.item_name} />
                  <span className="discount">{file.item_name}</span>
                </div>
                <div className="offerBody">
                  <div className="price flex">
                    <h4>${file.spetial_date} Negotiable</h4>
                    <span className="status">For Rent</span>
                  </div>
                  <div className="amenities flex">
                    <div className="singleAmenity flex">
                      <BedIcon className="icon" />
                      <small>2 Beds</small>
                    </div>
                    <div className="singleAmenity flex">
                      <BathroomIcon className="icon" />
                      <small>Bathroom</small>
                    </div>
                    <div className="singleAmenity flex">
                      <WifiIcon className="icon" />
                      <small>Wifi</small>
                    </div>
                    <div className="singleAmenity flex">
                      <AirportShuttleIcon className="icon" />
                      <small>Shuttle</small>
                    </div>
                  </div>
                  <div className="location flex">
                    <LocationOnIcon className="icon" />
                    <small>450 Vine $310, Addis Ababa</small>
                  </div>
                  <div className="btndiv">
                    <button className="btngg" >
                      View Detail
                      <ChevronRightIcon />
                    </button>
                    <Details somepop={popup} />
                    <button className="btnggadd">
                      Reserve
                      <AddIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        paginate={paginate}
      />
    </div>
  );
}

export default Detail;
