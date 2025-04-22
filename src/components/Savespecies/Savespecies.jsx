import { div } from "motion/react-client";
import {useEffect, useState} from "react"
import styles from "./savespecies.module.css"
import Button from "../Button/Button";

const Savespecies = ({isOpen, onClose, species}) => {
    const [note, setNote] = useState("")
    useEffect (() => {
        const handleEscape = (e) => {
            if (e.key ==="Escape"){
                onClose();
            }
        };
        if (isOpen){
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener ("keydown", handleEscape)
        };
    }, [isOpen, onClose]);

    const handleSave = () => {
        const existing = JSON.parse (localStorage.getItem("speciesList")) ||[];

        const filtered = existing.filter (
            (item) => item.scientificName !== species.scientificName
        );

          filtered.push({
            id: species.scientificName,
            commonName: species.commonName,
            scientificName: species.scientificName,
            imageUrl: species.imageUrl,
            kingdom: species.kingdom,
            note: note,
          });
          localStorage.setItem("speciesList", JSON.stringify(filtered));
          onClose();
    };
    if (!isOpen) return null;

    return (
      <div>
        <div className={styles.modalOverlay} onClick={onClose}></div>
        <div className={styles.purchaseModal}>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>

          <div className={styles.modalBody}>
            {species && (
              <div>
                <div className={styles.modalHeader}>
                  <div className={styles.modalImageCard}>
                    <img
                      src={species.imageUrl}
                      alt={species.commonName}
                      className={styles.modalImage}
                    />
                  </div>
                  <div className={styles.modalHero}>
                    <h2 className={styles.title}>{species.commonName}</h2>
                    <p className={styles.scientificName}>
                      {species.scientificName}
                    </p>
                    <p className={styles.kingdom}>Kingdom: {species.kingdom}</p>
                  </div>
                </div>

                <textarea
                  className={styles.noteInput}
                  placeholder="Add your research notes here..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                <Button className={styles.saveButton} onClick={handleSave} text= "Save to My Species List" />
                  
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

export default Savespecies;