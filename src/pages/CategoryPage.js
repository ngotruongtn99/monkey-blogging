import Heading from "components/layouts/Heading";
import Layout from "components/layouts/Layout";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import PostItem from "module/posts/PostItem";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const param = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("category.slug", "==", param.slug)
      );
      onSnapshot(docRef, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(results);
      });
    }
    fetchData();
  }, [param.slug]);

  if (posts.length <= 0) return null;
  return (
    <Layout>
      <div className="container">
        <div className="pt-10">
          <Heading>Bài viết về {posts[0].category?.name}</Heading>
          <div className="grid-layout grid-layout--primary">
            {posts.length > 0 &&
              posts.map((item) => (
                <PostItem key={item.id} data={item} imgFull></PostItem>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
