import React from "react";
import styles from "./navbar.module.css";
import Searchbox from "../Searchbox/Searchbox";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navHeader} >
          <div className={styles.logo}><a href="/">EcoScholar</a></div>
          <div className={styles.searchBox}>
            <Searchbox />
          </div>
      </div> 
   
    </nav>
  );
};

export default Navbar;
