import React from "react";
import "./styles.css";
import styled from "styled-components";
import StackedCarousel from "./StackedCarousel";
import WithCamera from "./WithCamera";

export default function App() {
  return (
    <Main>
      <h1> 스택 카드 캐러쉘 </h1>
      {/* <h2>상단 아이템 드래그 </h2>
      <StackedCarousel /> */}
      <h2>카메라 사용 </h2>
      <WithCamera />
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
