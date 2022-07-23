import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import Input from "components/input";
import Label from "components/label";
import Field from "components/field";
import Button from "components/button";
import { auth, db } from "firebaseConfig/firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import InputPasswordToggle from "components/input/InputPasswordToggle";
import slugify from "slugify";
import { userRole, userStatus } from "utils/constants";

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 character or greater")
    .required("Please enter your password"),
});
const SignUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | Monkey Blog";
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    // watch,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleSignUp = async (values) => {
    if (!isValid) return;
    // console.log("handleSignUp ~ values", values);

    await createUserWithEmailAndPassword(auth, values.email, values.password);

    await updateProfile(auth.currentUser, {
      displayName: values.fullname,
      photoURL:
        "https://images.unsplash.com/photo-1656694878481-eaf9cc3abc0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    });

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      username: slugify(values.fullname, { lower: true }),
      avatar:
        "https://images.unsplash.com/photo-1656694878481-eaf9cc3abc0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: serverTimestamp(),
    });
    // await addDoc(colRef, {
    //   fullname: values.fullname,
    //   email: values.email,
    //   password: values.password,
    // });

    toast.success("Register successfully !!!", {
      pauseOnHover: false,
      delay: 0,
    });
    reset({
      fullname: "",
      email: "",
      password: "",
    });
    navigate("/");
  };

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);

  return (
    <AuthenticationPage>
      <form className="form" onSubmit={handleSubmit(handleSignUp)}>
        <Field>
          <Label htmlFor="fullname" className="label">
            Fullname
          </Label>
          <Input
            control={control}
            name="fullname"
            type="text"
            placeholder="Enter your FullName ... "
            autoComplete="off"
          />
        </Field>
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
          Already have an account? <Link to={"/sign-in"}>Login</Link>
        </div>
        <Button
          type="submit"
          style={{ width: "100%", maxWidth: 300, margin: "0 auto" }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
