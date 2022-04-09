import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import Pools from "./components/Pools";
import PoolList from "./components/pool_list/PoolList";

const Home = React.lazy(() => import("./components/Home"));

const Main = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/pool-lists" element={<PoolList />} />
      </Routes>
    </React.Suspense>
  );
};
export default Main;
