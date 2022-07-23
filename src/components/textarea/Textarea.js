import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import PropTypes from "prop-types";

const TextareaStyles = styled.div`
  position: relative;
  width: 100%;
  textarea {
    width: 100%;
    padding: 16px 20px;
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.grayf1};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s linear;
    resize: none;
    min-height: 200px;
  }

  color: ${(props) => props.theme.black};
  font-size: 14px;

  textarea::-webkit-input-placeholder {
    color: #84878b;
  }

  textarea::-moz-input-placeholder {
    color: #84878b;
  }
`;

/**
 *
 * @param {*} placeholder(optional) - Placeholder of input
 * @param {*} name(optional) - name of input
 * @param {*} control - control from react hook form
 * @returns Input
 */

const Textarea = ({
  name = "",
  type = "text",
  children,
  control,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });

  return (
    <TextareaStyles>
      <textarea type={type} id={name} {...field} {...props} />
    </TextareaStyles>
  );
};

Textarea.propTypes = {
  type: PropTypes.string,
};

export default Textarea;
