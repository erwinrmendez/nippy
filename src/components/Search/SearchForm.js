import React, { useContext, useState } from "react";
import styled from "styled-components";
import { convertFromRaw } from "draft-js";
import { NotesContext } from "../../contexts/NotesContext";
import { GlobalContext } from "../../contexts/GlobalContext";
import { ReactComponent as Delete } from "../../assets/delete.svg";
import { ReactComponent as Show } from "../../assets/show.svg";
import { ReactComponent as Hide } from "../../assets/hide.svg";
import Popup from "../Tabs/Popup";

const SearchBox = styled.div`
  z-index: 99;
  position: absolute;
  top: 35px;
  right: 0.5em;
  padding: 0.5em;
  border-radius: 5px;
  background: var(--color-background);
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.15);

  > ul {
    list-style: none;
    font-size: 12px;
    margin: 0;
    padding: 0;
    height: 150px;
    overflow-y: auto;

    > li {
      cursor: pointer;
      padding: 0.5em;
      border: 1px solid #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background: #fff;
      }

      > span {
        overflow: hidden;
        max-width: 125px;
      }

      > div {
        display: flex;
        width: 40px;
      }

      & svg {
        width: 12px;
        height: auto;
        margin-left: 10px;

        > path {
          fill: var(--color-primary-75);
        }

        &:hover > path {
          fill: var(--color-primary);
        }
      }
    }
  }
`;

const EmptyBox = styled.div`
  font-size: 12px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchInput = styled.input`
  outline: none;
  border: 1px solid var(--color-primary);
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 0.5em;
`;

const SearchForm = () => {
  const { notes, toggleVisibility, handleDelete } = useContext(NotesContext);
  const { setActiveTab, setVisibleSearch } = useContext(GlobalContext);
  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const onClickTab = (note) => {
    setVisibleSearch(false);
    toggleVisibility(note, true);
    setActiveTab(note.name);
  };

  const onClickToggle = (e, note) => {
    e.stopPropagation();
    toggleVisibility(note);
  };

  const onDelete = (e, note) => {
    e.stopPropagation();

    if (convertFromRaw(note.content).hasText()) {
      setShowPopup(true);
    } else {
      handleDelete(note.name);
    }
  };

  return (
    <SearchBox>
      <SearchInput
        type="text"
        value={searchValue}
        autoFocus
        placeholder="Search tabs"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {notes.length > 0 ? (
        <ul>
          {notes
            .filter((note) =>
              note.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((note) => (
              <React.Fragment key={note.name}>
                <li onClick={() => onClickTab(note)}>
                  <span>{note.name}</span>
                  <div>
                    {note.show ? (
                      <Hide onClick={(e) => onClickToggle(e, note)} />
                    ) : (
                      <Show onClick={(e) => onClickToggle(e, note)} />
                    )}
                    <Delete onClick={(e) => onDelete(e, note)} />
                  </div>
                </li>
                {showPopup && (
                  <Popup
                    key="popup"
                    handleDelete={() => {
                      handleDelete(note.name);
                      setShowPopup(false);
                    }}
                    setShowPopup={setShowPopup}
                  />
                )}
              </React.Fragment>
            ))}
        </ul>
      ) : (
        <EmptyBox>Nothing to show here.</EmptyBox>
      )}
    </SearchBox>
  );
};

export default SearchForm;
