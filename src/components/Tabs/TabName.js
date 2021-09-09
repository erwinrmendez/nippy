import { useEffect, useState, useRef, useContext } from "react";
import { convertFromRaw } from "draft-js";
import styled from "styled-components";
import { NotesContext } from "../../contexts/NotesContext";
import { ReactComponent as Delete } from "../../assets/delete.svg";
import { ReactComponent as Hide } from "../../assets/hide.svg";
import Popup from "./Popup";

const Label = styled.div`
  background: ${(props) =>
    props.current ? "#ffffff" : "var(--color-background)"};
  border: 1px solid var(--color-light-gray);
  border-bottom: ${(props) => (props.current ? "1px solid #fff" : "none")};
  color: var(--color-primary);
  display: inline-flex;
  padding: 2.5px 5px;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  cursor: pointer;

  > span {
    width: 100px;
    overflow: hidden;
    font-size: 12px;
    line-height: 12px;
    font-weight: ${(props) => (props.current ? "bold" : "normal")};
    padding: 0.25em 0.5em;
  }
`;

const EditableSpan = styled.span`
  box-sizing: border-box;
  border-radius: 2.5px;
  outline: 1px solid var(--color-light-gray);
`;

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 15px;
  font-weight: bold;

  &:hover {
    background: var(--color-background);

    > svg > path {
      fill: var(--color-dark-gray);
    }
  }

  > svg {
    height: 8px;
    width: 8px;
  }

  > svg > path {
    fill: ${(props) =>
      props.current ? "var(--color-dark-gray)" : "transparent"};
  }
`;

export const TabName = (props) => {
  const { note, current, handleClick, deleteNote, provided } = props;
  const { handleChangeName, toggleVisibility } = useContext(NotesContext);
  const [editable, setEditable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // reference to container and label
  const editableSpan = useRef(null);
  const popup = useRef(null);

  // change elment when double clicked and add focus
  const toggleEditable = (e, bool) => {
    setEditable(bool);
    if (bool) {
      setTimeout(() => {
        editableSpan.current.focus();
      }, 100);
    } else {
      e.target.innerText !== note.name &&
        handleChangeName(note.name, e.target.innerText);
    }
  };

  // delete note on confirmation
  const handleDelete = () => {
    deleteNote(note.name);
    setShowPopup(false);
  };

  // handle open/close popup
  useEffect(() => {
    if (showPopup) {
      document
        .getElementById("root")
        .addEventListener("click", handleClosePopup);
    }

    return () => {
      document
        .getElementById("root")
        .removeEventListener("click", handleClosePopup);
    };
  }, [showPopup]);

  // if doesn't have content, delete without confirmation
  const handlePopup = () => {
    if (convertFromRaw(note.content).hasText()) {
      setShowPopup(true);
    } else {
      handleDelete();
    }
  };

  const handleClosePopup = () => {
    if (document.getElementById("root").contains(popup.current)) {
      setShowPopup(false);
    }
  };

  return (
    <>
      <Label
        onClick={() => handleClick(note.name)}
        current={current}
        className={current && "active"}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {editable ? (
          <EditableSpan
            ref={editableSpan}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => toggleEditable(e, false)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter") {
                toggleEditable(e, false);
              }
            }}
          >
            {note.name}
          </EditableSpan>
        ) : (
          <span
            onDoubleClick={(e) => toggleEditable(e, true)}
            style={{ userSelect: "none" }}
          >
            {note.name}
          </span>
        )}
        <Button
          current={current}
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(note, false);
          }}
          data-tooltip="hide note"
        >
          <Hide />
        </Button>
        <Button
          current={current}
          onClick={(e) => {
            e.stopPropagation();
            handlePopup();
          }}
          data-tooltip="delete note"
        >
          <Delete />
        </Button>
        {showPopup && (
          <Popup
            handleDelete={handleDelete}
            setShowPopup={setShowPopup}
            forwardRef={popup}
          />
        )}
      </Label>
    </>
  );
};
