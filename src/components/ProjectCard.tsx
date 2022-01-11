import { BiLinkAlt } from "react-icons/bi";
import { SiGithub } from "react-icons/si";
import styled from "styled-components";
import { BlueSubText } from "./BlueSubText";
import { Button } from "./Button";
import { DescriptionText } from "./DescriptionText";
import { Flex } from "./Flex";
import { Title } from "./Title";

interface ProjectCard {
  imageSrc: string;
  title: string;
  description: string;
  tags: string[];
  demoLink?: string;
  githubLink?: string;
}

const ProjectCardContainer = styled.div`
  max-width: 344px;
  width: 100%;
  height: 634px;
  ${Button} {
    margin-left: 0;
  }
`;

const ProjectCardImage = styled.img`
  width: 344px;
  height: 237px;
  object-fit: cover;
`;

const ProjectTitle = styled(Title)`
  margin-top: 26px;
`;

const ProjectDescription = styled(DescriptionText)`
  margin: 30px 0;
`;

export const ProjectCard = ({
  imageSrc,
  title,
  description,
  tags,
  demoLink,
  githubLink,
}: ProjectCard) => {
  return (
    <ProjectCardContainer>
      <ProjectCardImage src={imageSrc} />
      <ProjectTitle>{title}</ProjectTitle>
      <ProjectDescription>{description}</ProjectDescription>
      <BlueSubText>
        {tags.map((tag, index) => (
          <span key={tag}>
            <span>{tag}</span>
            {index !== tags?.length - 1 ? " - " : ""}
          </span>
        ))}
      </BlueSubText>
      <Flex style={{ marginTop: "38px" }} justify="flex-start">
        {demoLink ? (
          <Button>
            <BiLinkAlt size="20px" />
            Live Demo
          </Button>
        ) : (
          <></>
        )}
        {githubLink ? (
          <div
            style={{ marginLeft: "16px", cursor: "pointer" }}
            onClick={() => null}
          >
            <SiGithub size="36px" />
          </div>
        ) : (
          <></>
        )}
      </Flex>
    </ProjectCardContainer>
  );
};
