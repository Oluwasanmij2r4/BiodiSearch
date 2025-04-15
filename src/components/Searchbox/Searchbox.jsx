import React from "react";
import styles from "./searchbox.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../Button/Button";

const Searchbox = () => {
      const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
    };

    const handleSearchSubmit = (event) => {
      event.preventDefault();
      if (!searchValue.trim()) {
        alert("Please enter a search query.");
        return;
      }
      navigate(`/results?query=${encodeURIComponent(searchValue)}`);
    };

    return (
      <div className={styles.searchWrapper}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search here..."
            className={styles.searchInput}
          />

          <Button
            type="submit"
            text="Start Research"
            onClick={handleSearchSubmit}
          />
        </form>
      </div>
    );
}

export default Searchbox;