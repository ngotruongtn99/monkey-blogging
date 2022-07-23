import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "context/auth-context";

const HomePage = React.lazy(() => import("pages/HomePage"));
const DashboardLayout = React.lazy(() =>
  import("module/dashboard/DashboardLayout")
);

const DashboardPage = React.lazy(() => import("pages/DashboardPage"));
const CategoryPage = React.lazy(() => import("pages/CategoryPage"));
const SignUpPage = React.lazy(() => import("pages/SignUpPage"));
const SignInPage = React.lazy(() => import("pages/SignInPage"));
const PageNotFound = React.lazy(() => import("pages/PageNotFound"));

const PostDetailsPage = React.lazy(() =>
  import("module/posts/PostDetailsPage")
);
const PostUpdate = React.lazy(() => import("module/posts/PostUpdate"));
const PostManage = React.lazy(() => import("module/posts/PostManage"));
const PostAddNew = React.lazy(() => import("module/posts/PostAddNew"));

const UserUpdate = React.lazy(() => import("module/user/UserUpdate"));
const UserProfile = React.lazy(() => import("module/user/UserProfile"));
const UserAddNew = React.lazy(() => import("module/user/UserAddNew"));
const UserManage = React.lazy(() => import("module/user/UserManage"));

const CategoryAddNew = React.lazy(() =>
  import("module/category/CategoryAddNew")
);
const CategoryManage = React.lazy(() =>
  import("module/category/CategoryManage")
);
const CategoryUpdate = React.lazy(() =>
  import("module/category/CategoryUpdate")
);

function App() {
  return (
    <div>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/:slug" element={<PostDetailsPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manage/posts" element={<PostManage />} />
              <Route path="/manage/add-post" element={<PostAddNew />} />
              <Route path="/manage/update-post" element={<PostUpdate />} />
              <Route path="/manage/category" element={<CategoryManage />} />
              <Route path="/manage/add-category" element={<CategoryAddNew />} />
              <Route
                path="/manage/update-category"
                element={<CategoryUpdate />}
              />
              <Route path="/manage/update-user" element={<UserUpdate />} />
              <Route path="/manage/user" element={<UserManage />} />
              <Route path="/manage/add-user" element={<UserAddNew />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
