import { useState } from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  function toggleDarkMode() {
    setDarkMode((preData) => !preData);
  }
  return (
    <section className={darkMode ? "dark" : ""}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Main darkMode={darkMode} />
    </section>
  );
}

export default App;
