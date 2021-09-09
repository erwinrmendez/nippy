import NotesContextProvider from "./contexts/NotesContext";
import GlobalContextProvider from "./contexts/GlobalContext";
import Layout from "./components/Layouts/Layout";
import "./App.css";

const App = () => {
  return (
    <GlobalContextProvider>
      <NotesContextProvider>
        <Layout />
      </NotesContextProvider>
    </GlobalContextProvider>
  );
};

export default App;
