import React from "react";
import styled from "styled-components";

const PopupWrapper = styled.div`
  z-index: 99;
  background: var(--color-background);
  position: absolute;
  top: 75px;
  width: 200px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);

  > h5 {
    font-size: 12px;
    color: var(--color-dark-gray);
    text-align: center;
    margin: 1em auto;
    white-space: normal;
  }

  > div {
    display: flex;
    justify-content: center;

    > button {
      background: var(--color-primary);
      color: #fff;
      width: 50px;
      padding: 0.25em 0;
      margin: 0.5em 0.5em 1em;
      border: none;
      cursor: pointer;

      &:hover {
        filter: brightness(95%);
      }
    }
  }
`;

const Popup = ({ forwardRef, handleDelete, setShowPopup }) => {
  return (
    <PopupWrapper ref={forwardRef} role="dialog">
      <h5>
        There is some content here.<br></br>Do you want to delete it?
      </h5>
      <div>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={() => setShowPopup(false)}>No</button>
      </div>
    </PopupWrapper>
  );
};

export default Popup;
