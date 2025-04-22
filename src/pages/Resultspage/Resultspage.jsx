import styles from "./resultspage.module.css";
import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch as Searchicon } from "react-icons/fa";
import Speciescard from "../../components/SpeciesCard/Speciescard";
import Button from "../../components/Button/Button";


const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();


 
const query = new URLSearchParams(location.search).get("query");
useEffect(() => {
  
    if (!query) {
      alert("❌ No search query found...");
      navigate("/");
      return;
    }
  });

   const saveList = () => {
     navigate("/SaveList"); //
   };

  


  return (
    <div className={styles.resultsPageWrapper}>
      <div className={styles.header}>
        <Navbar />
      </div>

      
       
          <div className={styles.searchResults}>
            <div className={styles.searchResultsHeader}>
              <Searchicon className={styles.searchIcon} />
              <h2 className={styles.searchText}>Search Results For: {query}</h2>
            </div>

            <div>
              <Button text="My Species" onClick={saveList}></Button>
            </div>
          </div>
   
     

      <div>
        <Speciescard/>
      </div>

      
    </div>
  );
};

export default ResultPage;
