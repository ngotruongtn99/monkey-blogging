import Button from "components/button";
import { Radio } from "components/checkbox";
import Field, { FieldCheckboxes } from "components/field";
import Input from "components/input";
import Label from "components/label";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { categoryStatus } from "utils/constants";

const CategoryUpdate = () => {
  const {
    control,
    watch,
    formState: { isSubmitting, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });
  const [params] = useSearchParams();
  const categoryId = params.get("id");
  const navigate = useNavigate();

  const watchStatus = watch("status");

  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "categories", categoryId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data());
    }

    fetchData();
  }, [categoryId, reset]);

  const handleUpdateCategory = async (values) => {
    if (!isValid) return;

    const colRef = doc(db, "categories", categoryId);
    try {
      await updateDoc(colRef, {
        name: values.name,
        slug: slugify(values.slug || values.name, { lower: true }),
        status: Number(values.status),
      });
      toast.success("Update successfully !!");
      navigate("/manage/category");
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset({
        name: "",
        slug: "",
        status: 1,
        createdAt: new Date(),
      });
    }
  };

  if (!categoryId) return null;
  return (
    <>
      <DashboardHeading
        title="Update Category"
        desc={`Update category id: ${categoryId}`}
      />
      <form onSubmit={handleSubmit(handleUpdateCategory)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
              required
            />
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
            />
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.APPROVED}
                value={categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                value={categoryStatus.UNAPPROVED}
              >
                Unapproved
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
          Update category
        </Button>
      </form>
    </>
  );
};

export default CategoryUpdate;
