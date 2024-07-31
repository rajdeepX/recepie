import { signInWithPopup } from "firebase/auth";
import "./Login.scss";
import { auth, provider } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuth }) => {
  let navigate = useNavigate();

  const signIn = () => {
    signInWithPopup(auth, provider).then((result) => {
      setIsAuth(true);
      navigate("/");
    });
  };

  return (
    <>
      <section className="section-login">
        <div className="login">
          <h2 className="login__head">Sign In to Create your post</h2>
          <button className="login__btn" onClick={signIn}>
            Sign in with Google
          </button>
        </div>
      </section>
    </>
  );
};
export default Login;
