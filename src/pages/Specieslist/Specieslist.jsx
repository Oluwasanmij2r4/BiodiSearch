import { useEffect, useState } from "react";
import { getSavedSpecies, saveSpecies } from "../../utils/localStorageUtils";
import { exportToPdf } from "../../utils/pdfExport";
import { exportToClipboard } from "../../utils/clipboardExport";
import styles from "./specieslist.module.css";
import Button from "../../components/Button/Button";
import {useNavigate} from "react-router-dom";
import { MdExpandMore as Moreicon, MdExpandLess as Lessicon } from "react-icons/md";

import { div } from "motion/react-client";

const Specieslist = () => {
  const [speciesList, setSpeciesList] = useState([]);
  const [editMode, setEditMode] = useState({});
  const navigate = useNavigate();
  const [expandedNotes, setExpandedNotes] = useState({});

  useEffect(() => {
    const saved = getSavedSpecies();
    setSpeciesList(saved);
  }, []);

  const handleNoteChange = (id, newNote) => {
    setSpeciesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, note: newNote } : s))
    );
  };

  const toggleExpanded = (id) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  const handleSave = (id) => {
    const updated = [...speciesList];
    saveSpecies(updated);
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  const handleCancel = (id) => {
    const saved = getSavedSpecies();
    setSpeciesList(saved); // reset to saved version
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  const handleRemove = (id) => {
    const updated = speciesList.filter((s) => s.id !== id);
    setSpeciesList(updated);
    saveSpecies(updated);
  };

  const truncateText = (text, limit = 100) => {
    if (!text) return "No notes yet.";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  const homeClick = () => {
    navigate("/"); 
  };

  return (
    <>
      <div className={styles.speciesListWrapper}>
        <div className={styles.speciesListHeader}>
          <div className={styles.speciesListHero}>
            <h1 className={styles.heroText}>My Species List </h1>
            <span className={styles.heroIcon}>📚</span>
          </div>

          <div className={styles.headerBtn}>
            <Button onClick={homeClick} text="Back to home" />
          </div>
        </div>

        {speciesList.length === 0 ? (
          <p className={styles.noSpecie}>No species saved yet.</p>
        ) : (
          <div className={""}>
            {speciesList.map((species) => (
              <div key={species.id} className={styles.speciesListCard}>
                <div className={styles.speciesListImageCard}>
                  <img
                    src={species.imageUrl}
                    alt={species.commonName}
                    className={styles.speciesListImage}
                  />
                </div>
                <div className={styles.speciesListDetailsCard}>
                  <h2 className={styles.heroCommonName}>
                    {species.commonName}{" "}
                    <span className={styles.heroScientificName}>
                      ({species.scientificName})
                    </span>
                  </h2>
                  <p className={styles.heroKingdom}>
                    <span className={styles.dot}>•</span> Kingdom:{" "}
                    {species.kingdom}
                  </p>

                  {editMode[species.id] ? (
                    <div>
                      <textarea
                        value={species.note || ""}
                        onChange={(e) =>
                          handleNoteChange(species.id, e.target.value)
                        }
                        placeholder="Add your research note here..."
                        className={""}
                        rows={3}
                      />

                      <div className={styles.textareaBtn}>
                        <Button
                          onClick={() => handleSave(species.id)}
                          text="Save"
                          btnClass="secondary"
                        />

                        <Button
                          onClick={() => handleCancel(species.id)}
                          text="Cancel"
                          btnClass="secondary"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noteBtn}>
                      <div className={styles.more}>
                        <p className={styles.listNote}>
                          {expandedNotes[species.id]
                            ? species.note
                            : truncateText(species.note, 100)}
                        </p>

                        {species.note && species.note.length > 100 && (
                          <span
                            onClick={() => toggleExpanded(species.id)}
                            className={styles.readMoreIcon}
                          >
                            {expandedNotes[species.id] ? (
                              <Lessicon />
                            ) : (
                              <Moreicon />
                            )}
                          </span>
                        )}
                      </div>

                      <div className={styles.editRemovebtn}>
                        <Button
                          onClick={() =>
                            setEditMode((prev) => ({
                              ...prev,
                              [species.id]: true,
                            }))
                          }
                          text="Edit"
                          btnClass="secondary"
                        />

                        <Button
                          onClick={() => handleRemove(species.id)}
                          text="Remove"
                          btnClass="secondary"
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.exportCopybtn}>
                    <Button
                      onClick={() => exportToPdf(speciesList)}
                      text="📄 Export to PDF"
                      btnClass="secondary"
                    />

                    <Button
                      onClick={() => exportToClipboard(speciesList)}
                      text="📋 Copy to Clipboard"
                      btnClass="secondary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Specieslist;
