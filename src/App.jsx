import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import GMSApplication from './components/GMSApplication';
import EmojiApplication from './components/EmojiApp';
import About from './components/About';
import Home from './components/Home';
import AutoQuiz from './components/AutoQuiz';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import LoadingSpinner from './components/LoadingSpinner';
import { withRouter } from 'react-router-dom';
import './App.css'; // Import your CSS file for styling

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  return (
    <div className="App">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Router>
          <div className="picture-background">
            <Navbar expand="lg">
              <Container>
                <Navbar.Brand as={Link} to="/home">
                  Growth Mindset Applications
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link as={Link} to="/home">
                      Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/about">
                      About
                    </Nav.Link>
                    <NavDropdown title="Applications" id="basic-nav-dropdown">
                      <NavDropdown.Item as={Link} to="/emoji">
                        Emojifier
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/gms">
                        Growth Mindset
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#quiz">
                        Quiz Generator (Upcoming)
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <Switch>
            <Route exact path="/home" component={withRouter(Home)} />
            <Route exact path="/about" component={About} />
            <Route exact path="/emoji" component={EmojiApplication} /> {/* Add this line */}
            <Route exact path="/gms" component={GMSApplication} /> {/* Add this line */}
            <Route path="/quiz" component={AutoQuiz} />
            </Switch>
          </div>
        </Router>
      )}
        <span></span>
      </div>
  );
};

export default App;