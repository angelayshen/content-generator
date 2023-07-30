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
          <title>Story Generator</title>
        </Helmet>
        <NavBar user={user} setUser={setUser} />
        <div className='header link-container header-container'>
          <NavLink to='/' exact activeClassName='active-link'>Home</NavLink>
          <NavLink to='/stories' exact activeClassName='active-link'>All</NavLink>
          <NavLink to='/stories/limerick' activeClassName='active-link'>Limericks</NavLink>
          <NavLink to='/stories/nursery-rhyme' activeClassName='active-link'>Nursery Rhymes</NavLink>
          <NavLink to='/stories/short-story' activeClassName='active-link'>Short Stories</NavLink>
        </div>
          <Switch>
            <Route exact path="/">
              <StoryGenerator user={user}/>
            </Route>
            <Route exact path="/stories">
              <StoryList user={user} />
            </Route>
            <Route path="/stories/limerick">
              <StoryList user={user} contentType="limerick"/>
            </Route>
            <Route path="/stories/nursery-rhyme">
              <StoryList user={user} contentType="nursery rhyme (not a song)"/>
            </Route>
            <Route path="/stories/short-story">
              <StoryList user={user} contentType="short story"/>
            </Route>
          </Switch>
      </div>
    </Router>
  );
};

export default App;
