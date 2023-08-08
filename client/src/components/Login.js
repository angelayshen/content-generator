import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignupForm";
import { Helmet } from 'react-helmet';

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);
  const backgroundClass = showLogin ? "login-background" : "signup-background";

  return (
    <div className={backgroundClass}>
      <Helmet>
        <title>Story Generator</title>
      </Helmet>
      <h1>Welcome to the Story Generator!</h1>
      {showLogin ? (
        <>
          <LoginForm onLogin={onLogin} />
          <p>
            Don't have an account? &nbsp;
            <button onClick={() => setShowLogin(false)}>
              Sign Up
            </button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm onLogin={onLogin} />
          <p>
            Already have an account? &nbsp;
            <button onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default Login;