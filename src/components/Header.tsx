import React from 'react'
import styled from 'styled-components'

interface Props {
    
}

const Container = styled.div`
    padding: 40px 0;
    background-color: transparent;
    font-size: 24px;
    font-weight: 300;
    color: #FFFFFF;
    width: 1078px;
`

const Header = (props: Props) => {
    return (
        <Container>
            DR.
        </Container>
    )
}

export default Header
