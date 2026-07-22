import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import CreateMovie from "./pages/CreateMovie";
import MovieDetails from "./pages/MovieDetails";
import EditMovie from "./pages/EditMovie";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/new" element={<CreateMovie />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/edit/:id" element={<EditMovie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;