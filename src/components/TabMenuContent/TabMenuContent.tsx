import React, { useState } from "react";
import styled from "styled-components";
import { config } from "../../content";
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
  @media (max-width: ${config.breakpoint}px) {
    display: flex;
    flex-direction: row;
    overflow: unset;
    margin-bottom: 24px;
  }
  @media (max-width: ${382}px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div`
  padding-left: 88px;
  width: 100%;
  overflow: auto;
  @media (max-width: ${config.breakpoint}px) {
    padding-left: 0;
  }
`;

const Container = styled.div<{ height?: number }>`
  display: flex;
  height: ${({ height }) => height && `${height}px`};
  flex-direction: row;
  overflow: hidden;
  @media (max-width: ${config.breakpoint}px) {
    flex-direction: column;
    height: fit-content;
  }
`;

const TabMenuContent = ({ tabs, title, height }: Props) => {
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
        <ContentContainer>
          {tabs.find((tab) => tab.id === selectedTabId)?.content}
        </ContentContainer>
      </Container>
    </div>
  );
};

export default TabMenuContent;
