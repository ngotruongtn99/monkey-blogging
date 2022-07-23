import Heading from "components/layouts/Heading";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import React, { useEffect } from "react";
import { useState } from "react";
import PostItem from "./PostItem";

const PostRelated = ({ categoryId = "" }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const docRef = query(
      collection(db, "posts"),
      where("category.id", "==", categoryId)
    );
    onSnapshot(docRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log("onSnapshot ~ results", results);
      setPosts(results);
    });
  }, [categoryId]);

  if (!categoryId || posts.length <= 0) return null;
  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary">
        {posts.map((post) => (
          <PostItem key={post.id} data={post}></PostItem>
        ))}
      </div>
    </div>
  );
};

export default PostRelated;
