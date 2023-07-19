import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import NavBar from './Navbar';
import Login from './Login';
import StoryGenerator from './StoryGenerator';
import StoryList from './StoryList';

function App() {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   // auto-login feature
  //   fetch("/check_session").then((r) => {
  //     if (r.ok) {
  //       r.json().then((user) => setUser(user));
  //     }
  //   });
  // }, []);

  // if (!user) return <Login onLogin={setUser} />;

  return (
    <div>
    <NavBar user={user} setUser={setUser} />
    <Router>
      <div className='header'>
        <Link to='/'>Stories</Link>
        <Link to='/generate'>Generate</Link>
      </div>
        <Switch>
          <Route path="/generate">
              <StoryGenerator />
          </Route>
          <Route path="/">
              <StoryList user={user} />
          </Route>
        </Switch>
    </Router>
    </div>
  );
};

export default App;
