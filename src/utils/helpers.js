//  Get active tab
export const getActiveTab = () => {
  const activeTab = window.localStorage.getItem("activeTab");

  if (!activeTab) {
    return null;
  }

  return JSON.parse(activeTab);
};

// Uppdate active tab in local storage
export const updateActiveTab = (activeTab) => {
  window.localStorage.setItem("activeTab", JSON.stringify(activeTab));
};

//  Get notes from local storage
export const getNotes = () => {
  const notes = window.localStorage.getItem("notes");

  if (!notes) {
    return [];
  }

  return JSON.parse(notes);
};

// Generate new note name
export const getName = (notes, placeholder) => {
  let name = placeholder;
  let count = 0;

  // eslint-disable-next-line
  while (notes.filter((e) => e.name === name).length > 0) {
    count = count + 1;
    name = `${placeholder} (${count})`;
  }

  return name;
};

// Uppdate notes in local storage
export const updateNotes = (newNotes) => {
  window.localStorage.setItem("notes", JSON.stringify(newNotes));
};
