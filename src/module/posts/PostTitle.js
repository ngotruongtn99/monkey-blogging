import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const PostTitleStyles = styled.h3`
  font-weight: bold;
  line-height: 1.5;
  letter-spacing: 0.25px;
  a {
    display: block;
  }
  ${(props) =>
    props.size === "normal" &&
    css`
      font-size: 18px;
      @media screen and (max-width: 1023.98px) {
        font-size: 14px;
      }
    `};
  ${(props) =>
    props.size === "big" &&
    css`
      font-size: 22px;
      @media screen and (max-width: 1023.98px) {
        font-size: 16px;
      }
    `};
`;

const PostTitle = ({ children, className = "", size = "normal", to = "" }) => {
  return (
    <PostTitleStyles size={size} className={`post-title ${className}`}>
      <Link to={`/${to}`}>{children}</Link>
    </PostTitleStyles>
  );
};

export default PostTitle;
