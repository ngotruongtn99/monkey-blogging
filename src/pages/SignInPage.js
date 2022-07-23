import { useAuth } from "context/auth-context";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import AuthenticationPage from "./AuthenticationPage";
import Button from "components/button";
import Field from "components/field";
import Input from "components/input";
import Label from "components/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebaseConfig/firebase-config";
import InputPasswordToggle from "components/input/InputPasswordToggle";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 character or greater")
    .required("Please enter your password"),
});

const SignInPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);

  useEffect(() => {
    document.title = "Login | Monkey Blog";
    // if (userInfo?.email) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const handleSignIn = async (values) => {
    if (!isValid) return;

    await signInWithEmailAndPassword(auth, values.email, values.password);

    navigate("/");
  };

  return (
    <AuthenticationPage>
      <form className="form" onSubmit={handleSubmit(handleSignIn)}>
        <Field>
          <Label htmlFor="email" className="label">
            Email
          </Label>
          <Input
            control={control}
            name="email"
            type="email"
            placeholder="Enter your Email ... "
            autoComplete="off"
          />
        </Field>
        <Field>
          <Label htmlFor="password" className="label">
            Password
          </Label>
          <InputPasswordToggle control={control} />
        </Field>
        <div className="have-account">
          Do not have an account ?
          <Link to={"/sign-up"}>Register an account</Link>
        </div>
        <Button
          type="submit"
          className="w-full max-w-[300px] mx-auto"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Login
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
