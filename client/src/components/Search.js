function Search({ searchTerm, setSearchTerm }) {
    return (
        <div className="grid-container">
          <form>
            <input
              className="search-bar"
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      );      
}

export default Search;