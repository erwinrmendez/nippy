import React, { useContext } from "react";
import { NotesContext } from "../../contexts/NotesContext";
import { GlobalContext } from "../../contexts/GlobalContext";
import logo from "../../assets/logo.png";
import add from "../../assets/add.svg";
import more from "../../assets/more.svg";
import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  padding: 0;
  margin: 0 0.5em;
  height: 20px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Header = () => {
  const { handleAdd } = useContext(NotesContext);
  const { visibleSearch, setVisibleSearch } = useContext(GlobalContext);

  return (
    <>
      <HeaderContainer>
        <img
          src={logo}
          alt="nippy"
          style={{ height: "26px", marginLeft: "5px" }}
        />
        <div>
          <Button onClick={() => handleAdd()} data-tooltip="add note">
            <img src={add} alt="add" style={{ height: "20px" }} />
          </Button>
          <Button
            onClick={() => setVisibleSearch(!visibleSearch)}
            data-tooltip="more tabs"
          >
            <img src={more} alt="more" style={{ height: "20px" }} />
          </Button>
        </div>
      </HeaderContainer>
    </>
  );
};

export default Header;
