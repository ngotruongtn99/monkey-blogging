import { ActionDelete, ActionEdit } from "components/actions";
import Button from "components/button";
import { LabelStatus } from "components/label";
import Table from "components/table";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import useLoadMoreItem from "hook/useLoadMoreItem";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userRole, userStatus, USER_PER_PAGE } from "utils/constants";

const UserTable = () => {
  const navigate = useNavigate();

  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case userStatus.BANNED:
        return <LabelStatus type="danger">Rejected</LabelStatus>;

      default:
        break;
    }
  };

  const renderRoleLabel = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return "Admin";
      case userRole.MODERATOR:
        return "Mode";
      case userRole.USER:
        return "User";

      default:
        break;
    }
  };

  const handleDeleteUser = async (user) => {
    const colRef = doc(db, "users", user.id);

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
        // await deleteUser(user);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const renderUserItem = (user) => (
    <tr key={user.id}>
      <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
      <td className="whitespace-nowrap">
        <div className="flex items-center gap-x-3">
          <img
            src={user?.avatar || "http://placehold.jp/150x150.png"}
            alt="user-avatar"
            className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
          />
          <div className="flex-1">
            <h3>{user?.fullname}</h3>
            <time className="text-sm text-gray-300">
              {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString(
                "vi-VI"
              )}
            </time>
          </div>
        </div>
      </td>
      <td>{user?.username}</td>
      <td title={user.email}>{user?.email.slice(0, 8) + "..."}</td>
      <td>{renderLabelStatus(Number(user?.status))}</td>
      <td>{renderRoleLabel(user?.role)}</td>
      <td>
        <div className="flex item-center gap-x-3  text-gray-500">
          <ActionEdit
            onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
          />
          <ActionDelete onClick={() => handleDeleteUser(user)} />
        </div>
      </td>
    </tr>
  );

  const { handleLoadMoreItem, itemList, total } = useLoadMoreItem(
    "users",
    USER_PER_PAGE,
    "email"
  );

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email address</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemList.length > 0 && itemList.map((user) => renderUserItem(user))}
        </tbody>
      </Table>
      {total > itemList.length && (
        <div className="mt-10">
          <Button className="mx-auto" onClick={handleLoadMoreItem}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
