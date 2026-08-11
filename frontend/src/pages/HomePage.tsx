import Container from "@mui/material/Container";
import * as React from "react";

import home from "/home.jpeg";

import theme from "../../theme";

const HomePage = () => {
  return (
    <Container
      sx={{
        minWidth: "100%",
        minHeight: "100vh",
        backgroundColor: theme.palette.colors.bg,
        backgroundImage: `url(${home})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "padding-box",
      }}
    ></Container>
  );
};

export default HomePage;
