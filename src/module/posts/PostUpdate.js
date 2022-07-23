import Button from "components/button";
import { Radio } from "components/checkbox";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import "react-quill/dist/quill.snow.css";

import Input from "components/input";
import { Dropdown } from "components/dropdown";
import Label from "components/label";
import Toggle from "components/toggle/Toggle";
import ImageUpload from "components/images/ImageUpload";
import Field, { FieldCheckboxes } from "components/field";
import { db } from "firebaseConfig/firebase-config";
import useFirebaseImage from "hook/useFirebaseImage";
import DashboardHeading from "module/dashboard/DashboardHeading";
import { postStatus } from "utils/constants";
import { toast } from "react-toastify";
import { useMemo } from "react";
import axios from "axios";
import slugify from "slugify";

Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [content, setContent] = useState("");

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
  });

  const watchStatus = watch("status");
  const watchHot = watch("hot");

  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item);
  };

  // Regex lấy ra tên của image
  const imageUrl = getValues("image");
  const imageName = getValues("image_name");

  // deleteAvatar function - Xóa trong firestore 'Users'
  const deletePostImage = async () => {
    const colRef = doc(db, "posts", postId);
    await updateDoc(colRef, {
      image: "", //set lại image rỗng để xóa image
    });
  };
  const { image, handleDeleteImage, handleSelectImage, progress, setImage } =
    useFirebaseImage(setValue, getValues, imageName, deletePostImage);

  // useEffect cập nhật lại avatar thay đổi hoặc bị xóa
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  useEffect(() => {
    async function fetchData() {
      if (!postId) return;

      const docRef = doc(db, "posts", postId);

      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.data()) {
        reset(docSnapshot.data());
        setSelectCategory(docSnapshot.data()?.category);
        setContent(docSnapshot.data()?.content || "");
      }
    }
    fetchData();
  }, [postId, reset]);

  useEffect(() => {
    async function getCategoryData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];

      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getCategoryData();
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: "https://api.imgbb.com/1/upload?key=f5b655bc6d7e775b92ea3dfb19751a62",
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );

  if (!postId) return null;

  const updatePostHandler = async (values) => {
    if (!isValid) return;
    const docRef = doc(db, "posts", postId);
    values.status = Number(values.status);
    values.slug = slugify(values.slug || values.title, { lower: true });

    await updateDoc(docRef, {
      ...values,
      image,
      content,
    });

    toast.success("Update post successfully!");
  };
  return (
    <>
      <DashboardHeading title="Update post" desc="Update post content" />
      <form onSubmit={handleSubmit(updatePostHandler)}>
        <div className="form-layout">
          <Field>
            <Label htmlFor="title">Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            />
          </Field>
          <Field>
            <Label htmlFor="slug">Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            />
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              name="image"
              className="h-[250px]"
              onChange={handleSelectImage}
              progress={progress}
              image={image}
              handleDeleteImage={handleDeleteImage}
            />
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={`${selectCategory.name || "Select category"}`}
              ></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleClickOption(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium ">
                {selectCategory?.name}
              </span>
            )}
          </Field>
        </div>

        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                theme="snow"
                modules={modules}
                value={content || ""}
                onChange={setContent}
              />
            </div>
          </Field>
        </div>

        <div className="form-layout">
          <Field>
            <Label htmlFor="">Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            />
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Update post
        </Button>
      </form>
    </>
  );
};

export default PostUpdate;
