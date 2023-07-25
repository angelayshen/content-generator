import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import NavBar from './Navbar';
import Login from './Login';
import StoryGenerator from './StoryGenerator';
import StoryList from './StoryList';
import { Helmet } from 'react-helmet';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // auto-login feature
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <Router>
      <div>
        <Helmet>
          <title>Limerick Generator</title>
        </Helmet>
        <NavBar user={user} setUser={setUser} />
        <div className='header link-container'>
          <NavLink to='/' exact activeClassName='active-link'>Home</NavLink>
          <NavLink to='/generate' activeClassName='active-link'>Generate</NavLink>
          <NavLink to='/generate' activeClassName='active-link'>Limerick</NavLink>
          <NavLink to='/generate' activeClassName='active-link'>Nursery Rhyme</NavLink>
          <NavLink to='/generate' activeClassName='active-link'>Ode</NavLink>
          <NavLink to='/generate' activeClassName='active-link'>Sonnet</NavLink>
          <NavLink to='/generate' activeClassName='active-link'>Short Story</NavLink>
        </div>
        <Switch>
          <Route path="/generate">
            <StoryGenerator user={user}/>
          </Route>
          <Route path="/">
            <StoryList user={user} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
