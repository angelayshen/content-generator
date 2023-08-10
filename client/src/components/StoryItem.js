import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart, faEdit, faTrashAlt, faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'
import ImageGenerator from './ImageGenerator';

function StoryItem({ story, onDelete, onUpdate, contentType }) {
  const { id, title, content, content_type, image_base64, is_favorite } = story;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [newContentType, setNewContentType] = useState(content_type);
  const [newImageBase64, setNewImageBase64] = useState(image_base64);
  const [isFavorite, setIsFavorite] = useState(is_favorite);
  const [isShared, setIsShared] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);

  // Handle delete request
  function handleDelete() {
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
  function handleFavorite(event) {
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
  function handleUpdate(event) {
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
        image_base64: newImageBase64,
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

  // Only show image prompt if user is editing
  useEffect(() => {
    if (!isEditing) {
      setShowImagePrompt(false);
    }
  }, [isEditing]);  

  // Handle image generation
  function handleImageGeneration(imageBase64) {
    setNewImageBase64(imageBase64);
  }

  if (isEditing) {
    return (
      <article>
        <form onSubmit={handleUpdate}>
          <textarea className="edit-textarea" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          {/* <textarea className="edit-textarea" value={newContentType} onChange={(e) => setNewContentType(e.target.value)} /> */}
          <textarea className="edit-textarea" style={{height: "250px"}} value={newContent} onChange={(e) => setNewContent(e.target.value)} />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
        {showImagePrompt && (
          <ImageGenerator onGenerate={handleImageGeneration} storyId={id} />
        )}
        {story.image_base64 !== null ? (
            <div className="image-container">
              <img src={`data:image/png;base64,${newImageBase64}`} alt={`${title} image`} className="story-image" />
              <button type="button" className="delete-image-button" onClick={(e) => { e.preventDefault(); setNewImageBase64(null); }}>
                <FontAwesomeIcon icon={faTrashAlt} color="white" /> &nbsp; Delete image
              </button>
            </div>
          ) : !showImagePrompt ? (
            <button type="button" onClick={() => setShowImagePrompt(true)}>Add Image (Optional)</button>
        ) : null}
      </article>
    );
  }

  // Handle share request
  function handleShare() {
    const url = `${window.location.origin}/stories/${id}`
  
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).then(() => setIsShared(true))
      .catch(console.error);
    } else {
      // Fallback to copy to clipboard if web share API is not supported
      navigator.clipboard.writeText(url).then(() => {
        setIsShared(true);
      }).catch(console.error);
    }
  };  

  return (
    <article>
      <h3>{title}</h3>
      {/* Only show content type if contentType prop is not passed down */}
      {contentType ? null : <p className="generated-content-type">
        {content_type}
      </p>}
      <pre className="generated-content">
        {content}
      </pre>
      <p>
        {image_base64 && <img src={`data:image/png;base64,${image_base64}`} alt={`${title} image`} className="story-image" />}
      </p>
      <button onClick={handleFavorite}>
        <FontAwesomeIcon icon={isFavorite ? solidHeart : regularHeart} color={isFavorite ? "red" : "black"} />
      </button>
      <button onClick={() => setIsEditing(true)}>
          <FontAwesomeIcon icon={faEdit} />
      </button>
      <button onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      <button onClick={handleShare}>
        <FontAwesomeIcon icon={faShareAlt} />
      </button>
      {isShared && <p style={{ color: 'green' }}>
        Story link has been copied!
      </p>}
    </article>
  );
}

export default StoryItem;