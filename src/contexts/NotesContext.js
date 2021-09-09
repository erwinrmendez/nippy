import { createContext, useContext, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import {
  getName,
  getNotes,
  updateNotes,
  updateActiveTab,
} from "../utils/helpers";

export const NotesContext = createContext();

const NotesContextProvider = ({ children }) => {
  const { setActiveTab } = useContext(GlobalContext);
  const [notes, setNotes] = useState(getNotes());

  // add new note
  const handleAdd = () => {
    const newName = getName(notes, "new note");
    const newNotes = [...notes, { name: newName, content: "", show: true }];

    updateNotes(newNotes);
    setNotes(newNotes);

    updateActiveTab(newName);
    setActiveTab(newName);
  };

  // delete note
  const handleDelete = (name) => {
    const updatedNotes = notes.filter((note) => note.name !== name);

    updateNotes(updatedNotes);
    setNotes(updatedNotes);
  };

  // change note content
  const handleChangeContent = (changedNote) => {
    const updatedNotes = notes.map((e) =>
      e.name === changedNote.name ? { ...e, content: changedNote.content } : e
    );

    updateNotes(updatedNotes);
    setNotes(updatedNotes);
  };

  // change note name
  const handleChangeName = async (prev, updated) => {
    const newName = getName(notes, updated);

    const updatedNotes = notes.map((e) =>
      e.name === prev ? { ...e, name: newName } : e
    );

    updateNotes(updatedNotes);
    setNotes(updatedNotes);

    updateActiveTab(newName);
    setActiveTab(newName);
  };

  // toggle show/hide tab
  const toggleVisibility = (note, show) => {
    const updatedNotes = notes.map((e) =>
      e.name === note.name ? { ...e, show: show || !e.show } : e
    );

    // sort notes by show property
    updatedNotes.sort((a, b) => b.show - a.show);
    updateNotes(updatedNotes);
    setNotes(updatedNotes);
  };

  // Reorder notes when drag/drop-ing tabs
  const reorderNotes = (startIdx, endIdx) => {
    let result = notes;
    const [draggedEl] = result.splice(startIdx, 1);
    result.splice(endIdx, 0, draggedEl);

    updateNotes(result);
    setNotes(result);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        handleAdd,
        handleDelete,
        handleChangeName,
        handleChangeContent,
        toggleVisibility,
        reorderNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export default NotesContextProvider;
