import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function StoryPage() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    fetch(`/stories/${id}`)
      .then((response) => {
        if (response.status === 404) {
          setStory(null);
          setLoading(false);
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data) { // Check if data exists
          setStory(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        // Handle any fetch error here
        setLoading(false);
      });
  }, [id]);
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {story ? (
        <>
          <h3>{story.title}</h3>
          <p className="generated-content-type">{story.content_type=='nursery rhyme (not a song)'? "nursery rhyme" : story.content_type}</p>
          <pre className="generated-content">{story.content}</pre>
          <img src={`data:image/png;base64,${story.image_base64}`} alt={`${story.title} image`} className="story-image" />
        </>
      ) : (
        <p>Oops, this story doesn't exist yet!</p>
      )}
      <p className="generated-content-type" style={{ color: 'white' }}>
        Want to generate your own story? &nbsp;
        <Link to="/">Login or sign up</Link>
      </p>
    </div>
  );  
}

export default StoryPage;
