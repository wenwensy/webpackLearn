//react18 版本 与 react 17略有不同

import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDom.creactRoot(document.getElementById("app"))

root.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
 );