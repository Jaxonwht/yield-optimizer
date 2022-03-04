import React from "react";
import { Link } from "react-router-dom";
import AllRoutes from "./AllRoutes";

function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
      </ul>
      <hr />
      <AllRoutes />
    </div>
  );
}

export default App;
