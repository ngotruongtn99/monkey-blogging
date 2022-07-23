import { ActionDelete, ActionEdit, ActionView } from "components/actions";
import Button from "components/button";
import { Dropdown } from "components/dropdown";
import { LabelStatus } from "components/label";
import Table from "components/table";
import { useAuth } from "context/auth-context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import useLoadMoreItem from "hook/useLoadMoreItem";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postStatus, POST_PER_PAGE, userRole } from "utils/constants";

const PostManage = () => {
  const navigate = useNavigate();

  const { handleLoadMoreItem, itemList, total, handleInputFilter } =
    useLoadMoreItem("posts", POST_PER_PAGE, "title");

  const handleDeletePost = async (postId) => {
    const docRef = doc(db, "posts", postId);

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
        await deleteDoc(docRef);
        // await deleteUser(user);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };

  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">Approved</LabelStatus>;
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case postStatus.REJECTED:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
      default:
        break;
    }
  };
  const { userInfo } = useAuth();
  if (userInfo.role !== userRole.ADMIN) return null;
  return (
    <div>
      <DashboardHeading title="All posts" desc="Manage all posts" />
      <div className="mb-10 flex justify-end gap-5">
        <div className="w-full max-w-[200px]">
          <Dropdown>
            <Dropdown.Select placeholder="Category"></Dropdown.Select>
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleInputFilter}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemList.length > 0 &&
            itemList.map((post) => {
              const date = post?.createdAt?.seconds
                ? new Date(post?.createdAt?.seconds * 1000)
                : new Date();

              const formatDate = new Date(date).toLocaleDateString("vi-VI");
              return (
                <tr key={post.id}>
                  <td>{post.id.slice(0, 5) + "..."}</td>
                  <td>
                    <div className="flex items-center gap-x-3">
                      <img
                        src={post.image}
                        alt=""
                        className="w-[66px] h-[55px] rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold max-w-[300px] whitespace-pre-wrap">
                          {post.title}
                        </h3>
                        <time className="text-sm text-gray-500">
                          Date: {formatDate}
                        </time>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-gray-500">{post.category?.name}</span>
                  </td>
                  <td>
                    <span className="text-gray-500">{post.user?.username}</span>
                  </td>
                  <td>{renderPostStatus(post.status)}</td>
                  <td>
                    <div className="flex items-center gap-x-3 text-gray-500">
                      <ActionView onClick={() => navigate(`/${post.slug}`)} />
                      <ActionEdit
                        onClick={() =>
                          navigate(`/manage/update-post?id=${post.id}`)
                        }
                      />
                      <ActionDelete onClick={() => handleDeletePost(post.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
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

export default PostManage;
