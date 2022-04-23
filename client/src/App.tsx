import React from "react";
import { Link } from "react-router-dom";
import AllRoutes from "./AllRoutes";
import axios from "axios";

// TODO: update production base url
axios.defaults.baseURL =
  process.env.NODE_ENV === "production" ? "/api/" : "http://localhost:5000";
function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/home">Home</Link>
          <br />
          <Link to="/pools">Pools</Link>
          <br />
          <Link to="/pool-lists">Pool Lists</Link>
          <br />
          <Link to="/optimizer">Optimizer</Link>
        </li>
      </ul>
      <hr />
      <AllRoutes />
    </div>
  );
}

export default App;
