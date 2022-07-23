import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AuthenticationStyles = styled.div`
  min-height: 100vh;
  padding: 40px;
  .logo {
    margin: 0 auto 20px;
  }
  .heading {
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-weight: 600;
    font-size: 40px;
  }

  .form {
    max-width: 600px;
    margin: 0 auto;
  }
  .have-account {
    margin-bottom: 20px;
    a {
      display: inline-block;
      color: ${(props) => props.theme.primary};
      font-weight: 500;
    }
  }
`;

const AuthenticationPage = ({ children }) => {
  return (
    <AuthenticationStyles>
      <div className="container">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              srcSet="/monkey-logo.png 2x"
              alt="monkey-blogging"
              className="logo"
            />
          </Link>
        </div>
        <h1 className="heading">Monkey Blogging</h1>
        {children}
      </div>
    </AuthenticationStyles>
  );
};

export default AuthenticationPage;
