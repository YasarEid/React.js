import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../base";
import { AuthContext } from "../Components/AuthComponents/Auth.js";
import classes from './Login.module.css';

const Login = ({ history }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorLogin, setErrorLogin] = useState(false);
  const [errorMessageLogin, setErrorMessageLogin] = useState("");
  const [errorSignup, setErrorSignup] = useState(false);
  const [errorMessageSignup, setErrorMessageSignup] = useState("");

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        setErrorLogin(true);
        setErrorMessageLogin(error.message);
      }
    },
    [history]
  );

  const handleSignUp = useCallback(async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await app
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value);
      history.push("/");
    } catch (error) {
      setErrorSignup(true);
      setErrorMessageSignup(error.message);
    }
  }, [history]);

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={isLogin ? handleLogin : handleSignUp}>
        <div className={classes.control}>
          <label>
            Email
            <input name="email" type="email" placeholder="Email" />
          </label>
        </div>
        <div className={classes.control}>
          <label>
            Password
            <input name="password" type="password" placeholder="Password" />
          </label>
        </div>
        <div className={classes.actions}>
          {isLogin && errorLogin && <p style={{ color: 'red' }}>{errorMessageLogin}</p>}
          {!isLogin && errorSignup &&  <p style={{ color: 'red' }}>{errorMessageSignup}</p>}

          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default withRouter(Login);



