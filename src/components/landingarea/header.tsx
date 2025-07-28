import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ padding: '0.3rem', backgroundColor: '#282c34', color: 'white' }}>
      <h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Tasky App
        </Link>
      </h1>
    </header>
  );
};

export default Header;
