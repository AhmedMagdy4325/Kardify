import { Route, Routes } from "react-router-dom";

import Board from "./pages/Board";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import AppLayout from "./components/layout/AppLayout";
import HomeLayout from "./components/layout/HomeLayout";

function App() {
  return (
    <>
      {/*
     Defning Routes which have 2 provided layouts
     one for home and notfound page and another for the other pages 
     */}
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Board />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
