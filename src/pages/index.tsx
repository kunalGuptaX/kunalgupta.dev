import type { NextPage } from "next";
import styled from "styled-components";
import { Button } from "../components/Button";
import Header from "../components/Header";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn } from "react-icons/fa";
import { SiUpwork, SiGithub } from "react-icons/si";
import TabMenuContent from "../components/TabMenuContent/TabMenuContent";
import { ExperienceCard } from "../components/ExperienceCard";
import { HorizontalBar } from "../components/HorizontalBar";
import { UppercaseTitle } from "../components/UppercaseTitle";
import { ProjectCard } from "../components/ProjectCard";
import { content } from "../content";
import Link from "next/link";

const HeroContainer = styled.div`
  background-color: #1a1a1a;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const HeroContent = styled.div`
  max-width: 1078px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomButtonContainer = styled.div`
  color: white;
  display: flex;
  margin-bottom: 84px;
`;

const CenterContentContainer = styled.div`
  font-family: "Inter";

  font-weight: 300;
  color: #ffffff;
  font-size: 18px;
  line-height: 24px;
  white-space: pre-wrap;
`;

const Name = styled.h1`
  background: linear-gradient(
    89.81deg,
    #9845e8 -1.72%,
    #33d2ff 54.05%,
    #dd5789 99.78%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: normal;
  font-weight: 500;
  font-size: 96px;
  line-height: 110px;
  margin: 28px 0;
  font-family: GT Walsheim Pro;
`;

const SecondarContentContainer = styled.div`
  background-color: #000000;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SecondaryContent = styled.div`
  max-width: 1078px;
  width: 100%;
  margin-top: 124px;
`;

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <HeroContainer>
        <HeroContent>
          <Header />
          <CenterContentContainer>
            {`Hey I'm`} <Name>{content.name}</Name>
            {content.aboutMe}
          </CenterContentContainer>
          <BottomButtonContainer>
            <a
              href={`mailto: ${content.email}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button>
                <MdEmail size="20px" />
                Send an email
              </Button>
            </a>
            <a href={content.linkedin} target="_blank" rel="noreferrer">
              <Button borderGradient="linear-gradient(135deg, #6964DE 2.88%, #FCA6E9 100%)">
                <FaLinkedinIn size="20px" />
                LinkedIn
              </Button>
            </a>
            <a href={content.upwork} target="_blank" rel="noreferrer">
              <Button borderGradient="linear-gradient(45.4deg, #F4426C 6.41%, #FBF2B1 98.99%)">
                <SiUpwork size="20px" />
                Upwork
              </Button>
            </a>
            <a href={content.github} target="_blank" rel="noreferrer">
              <Button borderGradient="linear-gradient(132.33deg, #D24074 -0.67%, #6518B4 102.54%)">
                <SiGithub size="20px" />
                Github
              </Button>
            </a>
          </BottomButtonContainer>
        </HeroContent>
      </HeroContainer>
      <SecondarContentContainer>
        <SecondaryContent>
          <TabMenuContent
            height={350}
            title="Experience"
            tabs={content.experiences.map((cont) => ({
              title: cont.title,
              id: cont.id,
              content: (
                <ExperienceCard
                  key={cont.id}
                  title={cont.content.title}
                  startMonth={cont.content.startMonth}
                  startYear={cont.content.startYear}
                  endMonth={cont.content.endMonth}
                  endYear={cont.content.endYear}
                  isPresentJob={cont.content.isPresentJob}
                  location={cont.content.location}
                  content={cont.content.content}
                />
              ),
            }))}
          />
          <HorizontalBar />
          <div>
            <UppercaseTitle>featured projects</UppercaseTitle>
            <ProjectsContainer>
              <ProjectCard
                imageSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk5UAuVcVZO2s03P-2-707_D6SjSqKH16AMv7HqEJ8Lr3C02_coQ4nWtpyVeP9y0nkjZI&usqp=CAU"
                description="Proxy provider website including authentication, dashboard and dynamic features"
                tags={["React", "redux"]}
                title="React"
                demoLink="rws"
                githubLink="test"
              />
            </ProjectsContainer>
          </div>
        </SecondaryContent>
      </SecondarContentContainer>
    </div>
  );
};

export default Home;
