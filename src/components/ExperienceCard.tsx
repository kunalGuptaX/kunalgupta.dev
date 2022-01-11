import styled from "styled-components";
import { config } from "../content";
import { BlueSubText } from "./BlueSubText";
import { DescriptionText } from "./DescriptionText";
import { Title } from "./Title";

interface ExperienceCardProps {
  title: string;
  content: React.ReactNode;
  location: string;
  startMonth: string;
  startYear: number;
  endMonth?: string;
  endYear?: number;
  isPresentJob: boolean;
}

const ExperienceCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  @media (max-width: ${config.breakpoint}px) {
    flex-direction: column;
  }
`;

const Duration = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  color: #c4c4c4;
`;

const ExperienceContentContainer = styled(DescriptionText)`
  white-space: pre-wrap;
`;

export const ExperienceCard = ({
  title,
  location,
  startMonth,
  startYear,
  endMonth,
  endYear,
  isPresentJob,
  content,
}: ExperienceCardProps) => {
  return (
    <div style={{ width: "100%" }}>
      <ExperienceCardHeader>
        <Title>{title}</Title>
        <Duration>
          {`${startMonth} ${startYear} - ${
            isPresentJob ? "Present" : `${endMonth} ${endYear}`
          }`}
        </Duration>
      </ExperienceCardHeader>
      <BlueSubText>{location}</BlueSubText>
      <ExperienceContentContainer>{content}</ExperienceContentContainer>
    </div>
  );
};
