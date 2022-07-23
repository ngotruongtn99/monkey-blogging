import React from "react";
import { useForm } from "react-hook-form";

import Button from "components/button";
import { Radio } from "components/checkbox";
import Field from "components/field";
import { FieldCheckboxes } from "components/field";
import Input from "components/input";
import Label from "components/label";
import DashboardHeading from "module/dashboard/DashboardHeading";
import ImageUpload from "components/images/ImageUpload";
import { userStatus, userRole } from "utils/constants";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "firebaseConfig/firebase-config";
import useFirebaseImage from "hook/useFirebaseImage";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import slugify from "slugify";

const UserAddNew = () => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting, isValid },
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      avatar: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: new Date(),
    },
  });

  const {
    handleSelectImage,
    progress,
    image,
    handleDeleteImage,
    handleResetUpload,
  } = useFirebaseImage(setValue, getValues);

  const watchStatus = watch("status");
  const watchRole = watch("role");

  const handleCreateUser = async (values) => {
    if (!isValid) return;

    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);

      const colRef = collection(db, "users");

      await addDoc(colRef, {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.username || values.fullname, {
          lower: true,
          replacement: "",
          trim: true,
        }),
        avatar: image,
        status: Number(values.status),
        role: Number(values.role),
        createdAt: serverTimestamp(),
      });
      handleResetUpload();
      toast.success(`Create new user with email: ${values.email} successfully`);
      reset({
        fullname: "",
        email: "",
        password: "",
        username: "",
        avatar: "",
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: new Date(),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <DashboardHeading title="New user" desc="Add new user to system" />
      <form onSubmit={handleSubmit(handleCreateUser)} autoComplete="off">
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10 over">
          <ImageUpload
            className="!rounded-full h-full"
            image={image}
            onChange={handleSelectImage}
            progress={progress}
            handleDeleteImage={handleDeleteImage}
          />
        </div>

        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            />
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            />
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BANNED}
                value={userStatus.BANNED}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MODERATOR}
                value={userRole.MODERATOR}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
