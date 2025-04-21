
// Get saved species list from localStorage
export const getSavedSpecies = () => {
  const raw = localStorage.getItem("speciesList");
  return raw ? JSON.parse(raw) : [];
};

// Save species list to localStorage
export const saveSpecies = (speciesList) => {
  localStorage.setItem("speciesList", JSON.stringify(speciesList));
};
