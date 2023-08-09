import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import NavBar from './Navbar';
import Login from './Login';
import StoryGenerator from './StoryGenerator';
import StoryList from './StoryList';
import StoryPage from './StoryPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // auto-login feature
    fetch("/check_session", {
      credentials: 'include'
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  return (
    <Router>
      <div>
        <Helmet>
          <title>Story Generator</title>
        </Helmet>
        <NavBar user={user} setUser={setUser} />
        {user && (
          <div className='header link-container header-container'>
            <NavLink to='/' exact activeClassName='active-link'>Home</NavLink>
            <NavLink to='/stories' exact activeClassName='active-link'>All</NavLink>
            <NavLink to='/stories/limerick' activeClassName='active-link'>Limericks</NavLink>
            <NavLink to='/stories/nursery-rhyme' activeClassName='active-link'>Nursery Rhymes</NavLink>
            <NavLink to='/stories/short-story' activeClassName='active-link'>Short Stories</NavLink>
          </div>
        )}
        <Switch>
          <Route exact path="/">
            {user ? <StoryGenerator user={user}/> : <Login onLogin={setUser} />}
          </Route>
          <Route exact path="/stories">
            {user ? <StoryList user={user} /> : <Login onLogin={setUser} />}
          </Route>
          <Route path="/stories/limerick">
            {user ? <StoryList user={user} contentType="limerick"/> : <Login onLogin={setUser} />}
          </Route>
          <Route path="/stories/nursery-rhyme">
            {user ? <StoryList user={user} contentType="nursery rhyme (not a song)"/> : <Login onLogin={setUser} />}
          </Route>
          <Route path="/stories/short-story">
            {user ? <StoryList user={user} contentType="short story"/> : <Login onLogin={setUser} />}
          </Route>
          <Route exact path="/stories/:id">
            <StoryPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;