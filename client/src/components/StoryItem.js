import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'

function StoryItem({ story, onDelete, onUpdate, contentType }) {
  const { id, title, content, content_type, is_favorite } = story;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [newContentType, setNewContentType] = useState(content_type);
  const [isFavorite, setIsFavorite] = useState(is_favorite);

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

    // Handle favorite request
    const handleFavorite = (event) => {
      event.preventDefault();
      fetch(`/stories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_favorite: !isFavorite,
        }),
      })
      .then((r) => r.json())
      .then((updatedStory) => {
        if (updatedStory.id) {
          setIsFavorite(!isFavorite);
        }
      });
    };  

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
        content_type: newContentType,
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
          <textarea className="edit-textarea" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          {/* <textarea className="edit-textarea" value={newContentType} onChange={(e) => setNewContentType(e.target.value)} /> */}
          <textarea className="edit-textarea" style={{height: "250px"}} value={newContent} onChange={(e) => setNewContent(e.target.value)} />
          <button type="submit">Save Changes</button>
        </form>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </article>
    );
  }

  return (
    <article>
      <h3>{title}</h3>
      {/* Only show content type if contentType prop is not passed down */}
      {contentType ? null : <p className="generated-content-type">{content_type}</p>}
      <pre className="generated-content">{content}</pre>
      <button onClick={handleFavorite}>
        <FontAwesomeIcon icon={isFavorite ? solidHeart : regularHeart} color={isFavorite ? "red" : "black"} />
      </button>
      <button onClick={() => setIsEditing(true)}>
          <FontAwesomeIcon icon={faEdit} />
      </button>
      <button onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </article>
  );
}

export default StoryItem;