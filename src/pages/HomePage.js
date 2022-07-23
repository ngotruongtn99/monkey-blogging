import Layout from "components/layouts/Layout";
import HomeBanner from "module/home/HomeBanner";
import HomeFeature from "module/home/HomeFeature";
import HomeNewest from "module/home/HomeNewest";
import React, { useEffect } from "react";
import styled from "styled-components";

const HomePageStyles = styled.div``;

const HomePage = () => {
  useEffect(() => {
    document.title = "Monkey Blog";
  }, []);

  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner />
        <HomeFeature />
        <HomeNewest />
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
