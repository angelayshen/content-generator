import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'

function Search({ searchTerm, setSearchTerm, showOnlyFavorites, setShowOnlyFavorites }) {
    return (
        <div>
            <button onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}>
                {showOnlyFavorites ? 
                    <span><FontAwesomeIcon icon={regularHeart} />&nbsp; Show All</span> : 
                    <span><FontAwesomeIcon icon={solidHeart} color='red' />&nbsp; Only Show Favorites</span>
                }
            </button>
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
