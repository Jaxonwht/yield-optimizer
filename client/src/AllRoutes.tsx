import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";

const Home = React.lazy(() => import("./components/Home"));

const Main = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </React.Suspense>
  );
};
export default Main;
