import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import StoryGenerator from './StoryGenerator';
import StoryList from './StoryList';

function NavBar({ user, setUser }) {
  
    function handleLogout() {
        fetch("/logout", { method: "DELETE" }).then((r) => {
          if (r.ok) {
            setUser(null);
          }
        });
      }

    return ( 
    <button className="button" onClick={handleLogout}>
        Logout
    </button>
    );
}

export default NavBar;