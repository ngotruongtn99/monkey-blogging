import { IconEyeClose, IconEyeOpen } from "components/icons";
import React from "react";
import { useState } from "react";
import Input from "./Input";

const InputPasswordToggle = ({ control }) => {
  const [togglePassword, setTogglePassword] = useState(false);

  if (!control) return;
  return (
    <>
      <Input
        control={control}
        name="password"
        type={togglePassword ? "text" : "password"}
        placeholder="Enter your Password ... "
      >
        {!togglePassword ? (
          <IconEyeClose onClick={() => setTogglePassword(true)} />
        ) : (
          <IconEyeOpen onClick={() => setTogglePassword(false)} />
        )}
      </Input>
    </>
  );
};

export default InputPasswordToggle;
