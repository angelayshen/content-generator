import React, { useState } from 'react';

function StoryGenerator({ user }) {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [isStoryGenerated, setIsStoryGenerated] = useState(false);
  const [storyType, setStoryType] = useState("limerick");

  function handleInputChange(event) {
    setPrompt(event.target.value);
    setError("");
  }

  function handleStoryTypeChange(event) {
    setStoryType(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

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

      // Save poem to database
      const saveResponse = await fetch('/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: prompt,
          content: data.content,
          content_type: storyType,
          user_id: user.id
        }),
      });
  
      if (!saveResponse.ok) {
        throw new Error(`Failed to save story: ${saveResponse.status}`);
      } 

    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  } 

  return (
    <div className={`story-generator-background ${isStoryGenerated ? 'story-generated' : ''}`}>
      <form onSubmit={handleSubmit}>
          <label>Write a &nbsp;
            {/* Add a dropdown menu to select story type */}
            <select value={storyType} onChange={handleStoryTypeChange}>
              <option value="limerick">limerick</option>
              <option value="nursery rhyme (not a song)">nursery rhyme</option>
              {/* <option value="ode">ode</option>
              <option value="sonnet">sonnet</option> */}
              <option value="short story">short story</option>
            </select> &nbsp;
           about...</label>
          {/* Add text box to capture user prompt */}
          <textarea type="text" value={prompt} onChange={handleInputChange} style={{width: "270px"}}/>
        <button type="submit">Generate</button>
      </form>
      {/* Add loading message so user knows content is being generated */}
        {error && <p style={{color: "red"}}>{error}</p>}
        {generating ? <em>Please hold, generating content...</em> : <pre className="generated-content">{story}</pre>}
    </div>
  );
};

export default StoryGenerator;