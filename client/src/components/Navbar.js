function NavBar({ setUser }) {
  
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