import React from "react";
import { renderToString } from "react-dom/server";
import Grants from "./src/pages/Grants.tsx";

try {
  const html = renderToString(React.createElement(Grants));
  console.log("Rendered successfully:", html.slice(0, 100));
} catch (err) {
  console.error("ERROR CAUGHT:");
  console.error(err);
}
