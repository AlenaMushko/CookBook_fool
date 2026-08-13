import { router } from "@routing/router";
import React from "react";
import { RouterProvider } from "react-router-dom";

import { Loader } from "./shared/index";

const App: React.FC = () => {
  return (
    <>
      <Loader />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
