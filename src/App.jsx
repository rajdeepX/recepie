import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Create from "./pages/Create/Create";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Recipe from "./pages/Recipe/Recipe";
// import { UserContextProvider } from "./UserContext";
import { useState } from "react";
import Favorite from "./pages/Favourite/Favourite";
import Footer from "./components/Footer/Footer";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      <BrowserRouter>
        {/* <UserContextProvider> */}
        <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
        <Routes>
          <Route
            exact
            path="/"
            element={<Home isAuth={isAuth} setIsAuth={setIsAuth} />}
          />
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/favourite" element={<Favorite />} />
          <Route path="/recipe/:id" element={<Recipe />} />
        </Routes>
        <Footer />
        {/* </UserContextProvider> */}
      </BrowserRouter>
    </>
  );
}

export default App;
