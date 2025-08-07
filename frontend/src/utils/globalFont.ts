import { createGlobalStyle } from "styled-components";
import pinkfongWoff2 from "@/assets/fonts/PinkfongBabyShark.woff2";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pinkfong Baby Shark';
    src: url(${pinkfongWoff2}) format('woff2'),
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'Pinkfong Baby Shark', sans-serif;
  }
`;

export default GlobalStyle;
