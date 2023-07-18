import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import StoryGenerator from './StoryGenerator';
import Homepage from './Homepage';

function NavBar() {
  return ( 
    <Router>
    <div className='header'>
      <Link to='/'>Homepage</Link>
      <Link to='/generate'>Generate</Link>
    </div>
    <Switch>
        <Route path="/generate">
            <StoryGenerator />
        </Route>
        <Route path="/">
            <Homepage />
        </Route>
    </Switch>
    </Router>
  );
}

export default NavBar;