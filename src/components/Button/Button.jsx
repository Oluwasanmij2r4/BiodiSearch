import styles from "./button.module.css";

const Button = ({btnClass= "primary", text, onClick}) => {
  return (
    <button className={styles[btnClass]} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
