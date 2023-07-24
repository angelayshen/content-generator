import React, { useEffect, useState } from 'react';
import StoryItem from './StoryItem';

function StoryList({ user }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch(`/users/${user.id}/stories`)
      .then((r) => r.json())
      .then(setStories);
  }, []);

  function handleDelete(id) {
    setStories((currentStories) => currentStories.filter((story) => story.id !== id));
  };

  function handleUpdate(updatedStory) {
    setStories((currentStories) => currentStories.map((story) => story.id === updatedStory.id ? updatedStory : story));
  };

  return (
    <div className="grid-container">
      {stories.map(story => (
        <div className="story-card" key={story.id}>
          <StoryItem story={story} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
      ))}
    </div>
  );
}

export default StoryList;
