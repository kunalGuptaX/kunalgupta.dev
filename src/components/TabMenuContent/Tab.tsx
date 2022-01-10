import React from 'react'
import styled from 'styled-components'

interface Props {
    
}

const Tab = styled.div<{ selected: boolean }>`
    padding: 18px 36px;
    width: 100%;
    background-color: ${({ selected }) => selected ? "#1F1E1E" : "transparent"};
    box-sizing: border-box;
    border-left: 2px solid ${({ selected }) => selected ? "#FFFFFF" : "#1F1E1E"};
    font-family: "Inter";
    font-style: normal;
    font-weight: 200;
    font-size: 18px;
    line-height: 22px;
    color: #FFFFFF;
    cursor: pointer;
`

export default Tab
