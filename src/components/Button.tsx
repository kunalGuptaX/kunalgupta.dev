import styled from "styled-components";

export const Button = styled.button<{ borderGradient?: string }>`
  cursor: pointer;
  user-select: none;
  padding: 16px 26px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 300;
  line-height: 24px;
  font-size: 16px;
  color: white;
  border: 2px solid transparent;
  border-image-source: ${({ borderGradient }) =>
    borderGradient ||
    `linear-gradient(
    51.06deg,
    #9358f7 0.87%,
    #9259f7 7.31%,
    #8e5df6 13.75%,
    #8862f5 20.19%,
    #806bf4 26.63%,
    #7575f2 33.07%,
    #6882f0 39.51%,
    #5990ee 45.95%,
    #4a9feb 52.39%,
    #3bade9 58.84%,
    #2ebae7 65.28%,
    #23c4e5 71.72%,
    #1bcde4 78.16%,
    #15d2e3 84.6%,
    #11d6e2 91.04%,
    #10d7e2 97.48%
  )`};
  border-image-slice: 20;
  border-radius: 4px;
  background-origin: border-box;
  background-clip: content-box, border-box;
  background-color: transparent;

  & > svg {
    margin-right: 8px;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;

  &:hover {
    opacity: 0.8;
    box-shadow: 0 0 9px 0 rgba(157, 96, 212, 0.5);
  }
  @media (max-width: ${382}px) {
    padding: 8px 20px;
    font-size: 14px;
  }
`;
