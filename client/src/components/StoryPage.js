import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function StoryPage() {
  const [story, setStory] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetch(`/stories/${id}`)
      .then((response) => response.json())
      .then((data) => setStory(data));
  }, [id]); // Include id as a dependency

  return (
    <div>
      {story ? (
        <>
          <h3>{story.title}</h3>
          <pre className="generated-content">{story.content}</pre>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StoryPage;
