import React from "react";
import styles from "./navbar.module.css";
import Button from "../Button/Button";
import Searchbox from "../Searchbox/Searchbox";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navHeader} >
          <div className={styles.logo}>EcoScholar</div>
          <div className={styles.searchBox}>
            <Searchbox />
          </div>
      </div> 
      {/* <div>
        <Button text="Sign In" />
      </div> */}
    </nav>
  );
};

export default Navbar;
