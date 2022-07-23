import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";

const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 20px;
      height: 433px;
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
    &-image {
      height: 250px;
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  if (!data) return null;

  const { image, category, title, createdAt, user } = data;

  const date = createdAt?.seconds
    ? new Date(createdAt?.seconds * 1000)
    : new Date();

  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  return (
    <PostNewestLargeStyles>
      <PostImage url={image} alt="" to={data?.slug} />
      <PostCategory to={category?.slug}>{category?.name}</PostCategory>
      <PostTitle size="big" to={data?.slug}>
        {title}{" "}
      </PostTitle>
      <PostMeta
        to={slugify(user?.username, { lower: true })}
        authorName={user?.fullname}
        date={formatDate}
      />
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
