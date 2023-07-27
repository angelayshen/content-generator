import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

function NavBar({ setUser }) {
  
    function handleLogout() {
        fetch("/logout", { method: "DELETE" }).then((r) => {
          if (r.ok) {
            setUser(null);
          }
        });
      }

    return ( 
    <button className="logout" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
    </button>
    );
}

export default NavBar;