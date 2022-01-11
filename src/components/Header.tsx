import React from "react";
import styled from "styled-components";

interface Props {}

const Container = styled.div`
  padding: 40px 0;
  background-color: transparent;
  font-size: 24px;
  font-weight: 300;
  color: #ffffff;
  max-width: 1078px;
  width: 100%;
  @media (max-width: ${382}px) {
    padding: 24px 0;
  }
`;

const Header = (props: Props) => {
  return <Container>DR.</Container>;
};

export default Header;
