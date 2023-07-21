import React, { useEffect, useState } from 'react';
import StoryItem from './StoryItem';

function StoryList({ user }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch(`/users/${user.id}/stories`)
      .then((r) => r.json())
      .then(setStories);
  }, []);

  const handleDelete = (id) => {
    setStories((currentStories) => currentStories.filter((story) => story.id !== id));
  };

  const handleUpdate = (updatedStory) => {
    setStories((currentStories) => currentStories.map((story) => story.id === updatedStory.id ? updatedStory : story));
  };

  return (
    <main>
      {stories.map((story) => (
        <StoryItem key={story.id} story={story} user={user} onDelete={handleDelete} onUpdate={handleUpdate} />
      ))}
    </main>
  );
}

export default StoryList;
