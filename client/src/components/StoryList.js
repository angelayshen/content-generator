import React, { useEffect, useState } from 'react';
import StoryItem from './StoryItem';

function StoryList({ user, contentType, onlyFavorites = false }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch(`/users/${user.id}/stories`)
      .then((r) => r.json())
      .then((storiesData) => {
        let filteredStories = storiesData;

        if (contentType) {
          // Filter stories based on content type
          filteredStories = filteredStories.filter((story) => story.content_type === contentType);
        }

        if (onlyFavorites) {
          // Filter stories based on favorite status
          filteredStories = filteredStories.filter((story) => story.is_favorite === true);
        }

        setStories(filteredStories);
      });
  }, [user.id, contentType, onlyFavorites]); // Fetch stories when user id or content type or only favorites changes

  function handleDelete(id) {
    setStories((currentStories) => currentStories.filter((story) => story.id !== id));
  };

  function handleUpdate(updatedStory) {
    setStories((currentStories) => currentStories.map((story) => story.id === updatedStory.id ? updatedStory : story));
  };

  return (
    <div className="grid-container">
      {[...stories].reverse().map(story => (
        <div className="story-card" key={story.id}>
          <StoryItem story={story} contentType={contentType} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
      ))}
    </div>
  );
}

export default StoryList;
