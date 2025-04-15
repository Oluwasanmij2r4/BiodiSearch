import styles from "./resultspage.module.css";
import {React, useEffect} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar/Navbar";

const ResultPage = () => {
  const [searchParams] = useSearchParams(); // Get the search value from the URL parameters
  const navigate = useNavigate(); 

  const query = searchParams.get("query");

  useEffect(() => {
    if (!query) {
      alert("❌ No search query found...");
      navigate("/");
    }
  }, [query, navigate]);


  return (
    <div>
      <div className={styles.header}>
        <p>goat</p>
      </div>
      <div className={styles.resultPageContainer}>
        <div className={styles.resultPage}>
          
          <div className={styles.homepage}>
            <h1>Welcome to the Homepage: "{query}"</h1>
            <p>This is the homepage of our application.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
