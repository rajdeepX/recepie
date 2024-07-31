import { Link, useNavigate } from "react-router-dom";

import "./Navbar.scss";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

const Navbar = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsAuth(false);
    });
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar__links">
          <Link className="navbar__link" to={"/"}>
            Home
          </Link>

          {isAuth && (
            <>
              <Link className="navbar__link" to={"/create"}>
                Create Post
              </Link>
              <Link className="navbar__link" to={"/favourite"}>
                Favourites
              </Link>
            </>
          )}
          {!isAuth ? (
            <Link className="navbar__link" to={"/login"}>
              Login
            </Link>
          ) : (
            <Link className="navbar__link" onClick={handleSignOut}>
              Logout
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;
