import React, { useState } from "react";
import styled from "styled-components";
import { UppercaseTitle } from "../UppercaseTitle";
import Tab from "./Tab";

interface Props {
  tabs: {
    title: string;
    id: string;
    content: React.ReactNode;
  }[];
  title: string;
  height?: number;
}

const TabsContainer = styled.div`
    min-width: 200px;
    overflow: auto;
`;

const ContentContainer = styled.div`
  padding-left: 88px;
  width: 100%;
  overflow: auto;
`;

const Container = styled.div<{ height?: number }>`
  display: flex;
  height: ${({ height }) => height && `${height}px`};   
  flex-direction: row;
  overflow: hidden;
`;

const TabMenuContent = ({ tabs, title,height }: Props) => {
  const [selectedTabId, setSelectedTabId] = useState(tabs[0].id);
  return (
    <div>
      <UppercaseTitle>{title}</UppercaseTitle>
      <Container height={height}>
        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              selected={selectedTabId === tab.id}
              onClick={() => setSelectedTabId(tab.id)}
            >
              {tab.title}
            </Tab>
          ))}
        </TabsContainer>
        <ContentContainer>{tabs.find(tab => tab.id === selectedTabId)?.content}</ContentContainer>
      </Container>
    </div>
  );
};

export default TabMenuContent;
