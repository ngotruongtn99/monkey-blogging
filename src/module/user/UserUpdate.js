import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";

import useFirebaseImage from "hook/useFirebaseImage";
import Button from "components/button";
import { Radio } from "components/checkbox";
import Field, { FieldCheckboxes } from "components/field";
import ImageUpload from "components/images/ImageUpload";
import Input from "components/input";
import Label from "components/label";
import DashboardHeading from "module/dashboard/DashboardHeading";
import { userRole, userStatus } from "utils/constants";
import Textarea from "components/textarea";

const UserUpdate = () => {
  const [params] = useSearchParams();
  const userId = params.get("id");

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
  });

  const watchStatus = watch("status");
  const watchRole = watch("role");

  // Regex lấy ra tên của avatar
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";

  // deleteAvatar function - Xóa trong firestore 'Users'
  const deleteAvatar = async () => {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "", //set lại avatar rỗng để xóa avatar
    });
  };

  const { image, handleDeleteImage, handleSelectImage, progress, setImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  // Update function
  const handleUpdateUser = async (values) => {
    if (!isValid) return; //kiểm tra validation
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        username: slugify(values.username || values.fullname, {
          lower: true,
          replacement: "",
          trim: true,
        }),
        avatar: image,
      });
      toast.success("Update User information successfully !");
    } catch (error) {
      console.log(error);
      toast.error("Update user failed!");
    }
  };

  // useEffect cập nhật lại avatar thay đổi hoặc bị xóa
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  // useEffect lấy dữ liệu của User trước khi update
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      const colRef = doc(db, "users", userId);

      const docData = await getDoc(colRef);
      reset(docData && docData.data());
    }
    fetchData();
  }, [userId, reset]);

  if (!userId) return null;

  return (
    <div>
      <DashboardHeading title="Update user" desc="Update user information" />
      <form onSubmit={handleSubmit(handleUpdateUser)} autoComplete="off">
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
        <div className="form-layout">
          <Field>
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Enter your Description"
              control={control}
            ></Textarea>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
