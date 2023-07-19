import ReactMarkdown from "react-markdown";
import React, { useState } from 'react';

function StoryItem({ story, user, onDelete, onUpdate }) {
  const { id, title, user_id, content} = story;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);

  // Handle delete request
  const handleDelete = () => {
    fetch(`/stories/${id}`, {
      method: 'DELETE',
    })
    .then(r => {
      if(r.ok) {
        onDelete(id);
      }
    });
  }

  // Handle update request
  const handleUpdate = (event) => {
    event.preventDefault();
    fetch(`/stories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
      }),
    })
    .then((r) => r.json())
    .then((updatedStory) => {
      if (updatedStory.id) {
        setIsEditing(false);
        // Update the story in the parent component
        onUpdate(updatedStory);
      }
    });
  };


  if (isEditing) {
    return (
      <article>
        <form onSubmit={handleUpdate}>
          <textarea value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{width: "500px", height: "25px"}} />
          <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} style={{width: "500px", height: "300px"}} />
          <button type="submit">Save Changes</button>
        </form>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </article>
    );
  }

  return (
    <article>
      <h1>{title}</h1>
      <small>
        {/* <p>
          <em>Written by {user.username}</em>
        </p> */}
      </small>
      <ReactMarkdown>{content}</ReactMarkdown>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </article>
  );
}

export default StoryItem;

