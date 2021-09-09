import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  font-size: 10px;
  padding: 0.7em;

  > p {
    margin: 0;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>Created by Erwin Mendez | 2021 &copy; All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
