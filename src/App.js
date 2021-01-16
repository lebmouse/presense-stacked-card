import React from "react";
import "./styles.css";
import styled from "styled-components";
import StackedCarousel from "./StackedCarousel";

export default function App() {
  return (
    <Main>
      <h1> 스택 카드 캐러쉘 </h1>
      <StackedCarousel />
    </Main>
  );
}

const Main = styled.main`
  padding: 0;
  margin: auto;
  width: 100%;
  max-width: 500px;
  /* background: #fff; */
`;
