import React from "react";
import styles from "./signinbutton.module.css";

const SignInButton = () => {
  return (
    <div className={styles.signinbutton}>
      <ul>
        <li>
          <a href="#contact">
            <button>Sign In</button>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SignInButton;
