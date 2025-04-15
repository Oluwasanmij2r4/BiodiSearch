import React from "react";
import styles from "./homenav.module.css";
import SignInButton from "../Signinbutton/Signinbutton";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Biodiversity Explorer</div>
      <div>
        <SignInButton />
      </div>
    </nav>
  );
};

export default Navbar;
