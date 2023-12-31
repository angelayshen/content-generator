import React, { useEffect, useState } from 'react';
import StoryItem from './StoryItem';
import Search from './Search';

function StoryList({ user, contentType, onlyFavorites = false }) {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    fetch(`/users/${user.id}/stories`)
      .then((r) => r.json())
      .then((storiesData) => {
        let filteredStories = storiesData;

        if (contentType) {
          // Filter stories based on content type
          filteredStories = filteredStories.filter((story) => story.content_type === contentType);
        }

        if (showOnlyFavorites) {
          // Filter stories based on favorite status
          filteredStories = filteredStories.filter((story) => story.is_favorite === true);
        }

        setStories(filteredStories);
      });
  }, [user.id, contentType, showOnlyFavorites]); // Fetch stories when user id or content type or show only favorites changes


  // Reset searchTerm when switching pages
  useEffect(() => {
    setSearchTerm("");
  }, [contentType, showOnlyFavorites]);


  function handleDelete(id) {
    setStories((currentStories) => currentStories.filter((story) => story.id !== id));
  };

  function handleUpdate(updatedStory) {
    setStories((currentStories) => currentStories.map((story) => story.id === updatedStory.id ? updatedStory : story));
  };

  return (
    <div className='stories-background'>
      {/* Render Search component only on the "All" page, i.e. contentType is not defined */}
        {!contentType && (
            <div>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} showOnlyFavorites={showOnlyFavorites} setShowOnlyFavorites={setShowOnlyFavorites}/>
            </div>
          )}
      <div className="grid-container">
        {[...stories]
          .filter((story) => {
            return (
              story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              story.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
          .reverse()
          .map((story) => (
            <div className="story-card" key={story.id}>
              <StoryItem story={story} contentType={contentType} onDelete={handleDelete} onUpdate={handleUpdate} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default StoryList;
