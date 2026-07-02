import React from "react";
import Grants from "./src/pages/Grants.tsx";

try {
  const element = Grants();
  console.log("Rendered successfully:", !!element);
} catch (err) {
  console.error("ERROR CAUGHT:");
  console.error(err);
}
