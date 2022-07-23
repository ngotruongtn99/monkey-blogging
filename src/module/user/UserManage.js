import Button from "components/button";
import { useAuth } from "context/auth-context";
import useLoadMoreItem from "hook/useLoadMoreItem";

import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { userRole } from "utils/constants";
import UserTable from "./UserTable";

const UserManage = () => {
  const { handleInputFilter } = useLoadMoreItem();

  const { userInfo } = useAuth();
  if (userInfo.role !== userRole.ADMIN) return null;

  return (
    <div>
      <div className="flex justify-between mb-10">
        <DashboardHeading title="Users" desc="Manage your user" />
        <Button kind="ghost" to="/manage/add-user">
          Add new user
        </Button>
      </div>
      <div className="mb-10 flex justify-end">
        <input
          type="text"
          placeholder="Search user email ...."
          className="px-4 py-5 border border-gray-400 rounded-lg"
          onChange={handleInputFilter}
        />
      </div>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
