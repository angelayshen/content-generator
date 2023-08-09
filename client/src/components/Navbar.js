import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

function NavBar({ user, setUser }) {
  
  function handleLogout() {
      fetch("/logout", { method: "DELETE" }).then((r) => {
        if (r.ok) {
          setUser(null);
        }
      });
    }

  return (
      user ? (
          <button className="logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
      ) : null
  );
}

export default NavBar;