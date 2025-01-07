// Filename - components/FooterStyles.js

import styled from "styled-components";

export const Box = styled.footer`
    background: black;
    color: white;
    text-align: center;
    padding: 10px 0;
    position: relative;
    bottom: 0;
    width: 100%;
    height: 60px;
`;

export const FooterText = styled.p`
    margin: 0;
    font-size: 14px;
    color: #fff;

    & span {
        font-weight: bold;
        color: #32cd32; /* Verde */
    }
`;
