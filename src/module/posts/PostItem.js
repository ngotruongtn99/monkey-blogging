import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";

const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 20px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-image {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;

const PostItem = ({ data, imgFull }) => {
  if (!data) return null;
  const { image, category, title, createdAt, user, slug } = data;
  const date = createdAt?.seconds
    ? new Date(createdAt?.seconds * 1000)
    : new Date();

  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostItemStyles>
      <PostImage url={image || ""} alt="" to={slug} imgFull={imgFull} />
      <PostCategory to={category?.slug}>{category?.name}</PostCategory>
      <PostTitle className="post-title" to={slug}>
        {title}
      </PostTitle>
      <PostMeta
        to={user?.username}
        authorName={user?.fullname}
        date={formatDate}
      />
    </PostItemStyles>
  );
};

export default PostItem;
