import Heading from "components/layouts/Heading";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import PostItem from "module/posts/PostItem";
import PostNewestItem from "module/posts/PostNewestItem";
import PostNewestLarge from "module/posts/PostNewestLarge";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import styled from "styled-components";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 40px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
  @media screen and (max-width: 1023.98px) {
    .layout {
      grid-template-columns: 100%;
    }
    .sidebar {
      padding: 14px 10px;
    }
  }
`;

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const docRef = query(
      collection(db, "posts"),
      where("status", "==", 1),
      where("hot", "==", false)
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
  }, []);

  const [first, ...other] = posts;

  if (posts.length <= 0) return null;
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Latest posts</Heading>
        <div className="layout">
          <PostNewestLarge data={first} />
          <div className="sidebar">
            {other.length > 0 &&
              other.map((post) => (
                <PostNewestItem key={post.id} data={post}></PostNewestItem>
              ))}
          </div>
        </div>
        <div className="grid-layout grid-layout--primary">
          <PostItem></PostItem>
          <PostItem></PostItem>
          <PostItem></PostItem>
          <PostItem></PostItem>
        </div>
      </div>
    </HomeNewestStyles>
  );
};
export default HomeNewest;
