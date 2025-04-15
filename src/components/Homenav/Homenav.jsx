import React from "react";
import styles from "./homenav.module.css";
import Button from "../Button/Button";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Biodiversity Explorer</div>
      <div>
        <Button
        text= "Sign In" />
      </div>
    </nav>
  );
};

export default Navbar;
