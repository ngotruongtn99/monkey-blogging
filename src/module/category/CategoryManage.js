import { ActionDelete, ActionEdit, ActionView } from "components/actions";
import Button from "components/button";
import { LabelStatus } from "components/label";
import Table from "components/table";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { categoryStatus, CATEGORY_PER_PAGE } from "utils/constants";
import useLoadMoreItem from "./../../hook/useLoadMoreItem";

const CategoryManage = () => {
  const navigate = useNavigate();

  const handleDeleteCategory = async (docId) => {
    const colRef = doc(db, "categories", docId);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1DC071",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const { handleLoadMoreItem, itemList, total, handleInputFilter } =
    useLoadMoreItem("categories", CATEGORY_PER_PAGE, "slug");
  return (
    <>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button kind="ghost" height="60px" to="/manage/add-category">
          Create category
        </Button>
      </DashboardHeading>
      <div className="mb-10 flex justify-end">
        <input
          type="text"
          placeholder="Search category ...."
          className="px-4 py-5 border border-gray-400 rounded-lg"
          onChange={handleInputFilter}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemList.length > 0 &&
            itemList.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <span className="italic text-gray-400">{category.slug}</span>
                </td>
                <td>
                  {Number(category.status) === categoryStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {Number(category.status) === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="danger">Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex item-center gap-x-3  text-gray-500">
                    <ActionView
                      onClick={() => navigate(`/category/${category.slug}`)}
                    />
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${category.id}`)
                      }
                    />
                    <ActionDelete
                      onClick={() => handleDeleteCategory(category.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > itemList.length && (
        <div className="mt-10">
          <Button className="mx-auto" onClick={handleLoadMoreItem}>
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default CategoryManage;
