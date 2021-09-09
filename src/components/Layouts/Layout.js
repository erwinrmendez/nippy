import { useContext } from "react";
import Footer from "./Footer";
import Header from "./Header";
import TabsContainer from "../Tabs/TabsContainer";
import SearchForm from "../Search/SearchForm";
import { GlobalContext } from "../../contexts/GlobalContext";
import styled from "styled-components";

const Container = styled.div`
  background: var(--color-primary);
  width: 600px;
  height: 420px;
  padding: 0.5em;
  margin: 0;
  position: relative;
`;

const Layout = () => {
  const { visibleSearch } = useContext(GlobalContext);

  return (
    <>
      <Container id="app">
        <Header />
        <TabsContainer />
        <Footer />
      </Container>
      {visibleSearch && <SearchForm />}
    </>
  );
};

export default Layout;
