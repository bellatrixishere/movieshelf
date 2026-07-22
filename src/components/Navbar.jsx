import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        🎬 MovieShelf
      </Link>

      <Link to="/movies/new" className="add-button">
        + Adicionar Filme
      </Link>
    </header>
  );
}

export default Navbar;