import OPENAI_API_KEY from './keys.js';
import React, { useState } from 'react';

function StoryGenerator({ user }) {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  function handleInputChange(event) {
    setPrompt(event.target.value);
    setError("");
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // Implement prompt validation on the client side
    if (prompt.length < 10) {
      setError("Prompt must be at least 10 characters long");
      return;
    }

    setGenerating(true);

    try {
      // Call OpenAI API to generate the content
      async function generateStory(prompt) {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{role: "user", content: `Write a limerick about the following: ${prompt}`}],
              max_tokens: 400
            })
          })
        
          // Throw error message if POST request fails
          if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
          }

          const data = await response.json();
          const content = data.choices[0].message.content;

          setStory(content);

          // Save poem to database
          const saveResponse = await fetch('/stories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: prompt,
              content: content,
              user_id: user.id
            }),
          });
      
          if (!saveResponse.ok) {
            throw new Error(`Failed to save story: ${saveResponse.status}`);
          } 
      }
      await generateStory(prompt) 

    } catch(e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
          Enter a prompt below to generate your limerick:
          <textarea type="text" value={prompt} onChange={handleInputChange} style={{width: "500px", height: "25px"}}/>
        <button type="submit">Generate</button>
      </form>
        {error && <p style={{color: "red"}}>{error}</p>}
        {generating ? <em>Generating content...</em> : <pre className="generated-content">{story}</pre>}
    </div>
  );
};

export default StoryGenerator;
