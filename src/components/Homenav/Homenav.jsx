import React from "react";
import styles from "./homenav.module.css"
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
   const saveList = () => {
     navigate("/SaveList"); //
   };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}><a href="/">EcoScholar</a></div>
      <div>
        <Button
        onClick={saveList}
        text= "My Species" />
      </div>
    </nav>
  );
};

export default Navbar;
