import React, { useState } from 'react';
import ImageGenerator from './ImageGenerator';

function StoryGenerator({ user }) {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [isStoryGenerated, setIsStoryGenerated] = useState(false);
  const [storyType, setStoryType] = useState("limerick");
  const [isStorySaved, setIsStorySaved] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [storyId, setStoryId] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (prompt.length < 10) {
      setError("Prompt must be at least 10 characters long");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch('/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyType, prompt })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate story: ${response.status}`);
      }

      const data = await response.json();
      setStory(data.content);
      setIsStoryGenerated(true);
      setIsStorySaved(false);

    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  }

  function handleInputChange(event) {
    setPrompt(event.target.value);
    setError("");
  }

  function handleStoryTypeChange(event) {
    setStoryType(event.target.value);
  }

  async function handleSave() {
    try {
      const saveResponse = await fetch('/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: prompt,
          content: story,
          content_type: storyType,
          user_id: user.id,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error(`Failed to save story: ${saveResponse.status}`);
      }

      const data = await saveResponse.json();
      setStoryId(data.id)
      setIsStorySaved(true);
    } catch (error) {
      setError(error.message);
    }
  }

  function handleImageGeneration(base64Image) {
    setImageBase64(base64Image);
  }

  return (
    <div className={`story-generator-background ${isStoryGenerated ? 'story-generated' : ''}`}>
      <form onSubmit={handleSubmit}>
          <label>Write a &nbsp;
            <select value={storyType} onChange={handleStoryTypeChange}>
              <option value="limerick">limerick</option>
              <option value="nursery rhyme (not a song)">nursery rhyme</option>
              <option value="short story">short story</option>
            </select> &nbsp;
           about...</label>
          <textarea type="text" value={prompt} onChange={handleInputChange} style={{width: "270px"}}/>
        <div style={{ display: 'flex' }}>
          <button type="submit">{isStoryGenerated ? 'Regenerate Text' : 'Generate'}</button>
          {isStoryGenerated && <button type="button" onClick={handleSave}>Save Text</button>}
        </div>
      </form>
      {error && <p style={{color: "red"}}>{error}</p>}
      {isStorySaved && <p style={{ color: 'green' }}>Your {storyType} has been saved!</p>}
      {generating ? <em>Please hold, generating content...</em> : <pre className="generated-content">{story}</pre>}
      {isStorySaved && !showImagePrompt && (
        <button type="button" onClick={() => setShowImagePrompt(true)}>Add Image (Optional)</button>
      )}
      {showImagePrompt && (
        <ImageGenerator onGenerate={handleImageGeneration} storyId={storyId} />
      )}
    </div>
  );  
};

export default StoryGenerator;