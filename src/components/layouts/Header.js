import Button from "components/button";
import { useAuth } from "context/auth-context";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/blog",
    title: "Blog",
  },
  {
    url: "/contact",
    title: "Contact",
  },
];

const HeaderStyles = styled.header`
  padding: 15px 0;
  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-auth {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .logo {
    display: block;
    max-width: 50px;
  }

  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
    font-weight: 500;
  }

  .search {
    width: 100%;
    max-width: 320px;
    margin-left: auto;
    padding: 15px 25px;
    border: 1px solid #ccc;
    border-radius: 8px;
    align-items: center;
    position: relative;
  }
  .search-input {
    width: 100%;
    flex: 1;
    padding-right: 45px;
  }

  .search-icon {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    right: 25px;
  }

  .header-button,
  .header-auth {
    margin-left: 20px;
  }

  @media screen and (max-width: 1023.98px) {
    .logo {
      max-width: 30px;
    }
    .menu,
    .search,
    .header-button,
    .header-auth {
      display: none;
    }
  }
`;

const Header = () => {
  const { userInfo } = useAuth();
  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img
              srcSet="/monkey-logo.png 2x"
              alt="monkey-blogging"
              className="logo"
            />
          </NavLink>
          <ul className="menu">
            {menuLinks.map((item) => (
              <li className="menu-item" key={item.title}>
                <NavLink to={item.url} className="menu-lik">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search posts ...  "
            />
            <IconSearch className="search-icon" />
          </div> */}
          {!userInfo ? (
            <Button
              to="/sign-in"
              type="button"
              height="56px"
              className="header-button"
            >
              Login
            </Button>
          ) : (
            <div className="header-auth">
              <Button
                type="button"
                height="56px"
                className="header-button"
                to="/dashboard"
              >
                Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
