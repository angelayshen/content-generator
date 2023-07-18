import React, { useEffect, useState } from 'react';
import Story from './Story';

function Homepage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch("/stories")
      .then((r) => r.json())
      .then(setStories);
  }, []);

  return (
    <main>
      {stories.map((story) => (
        <Story key={story.id} story={story} />
      ))}
    </main>
  );
}

export default Homepage;