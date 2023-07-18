import OPENAI_API_KEY from './keys.js';
import Story from './Story.js';
import React, { useState } from 'react';

function StoryGenerator() {
  const [prompt, setPrompt] = useState('');

  function handleInputChange(event) {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // call your API endpoint to generate the story
    async function generateStory(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: "user", content: `Write a story about the following: ${prompt}`}],
            max_tokens: 20
          })
        })
      
        // Throw error message if POST request fails
        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }

        // Print poem
        const data = await response.json();
        const content = data.choices[0].message.content;
        console.log(content)

        // Save poem to database
        const saveResponse = await fetch('/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: prompt,
            content: content,
            user_id: 3
          }),
        });
    
        if (!saveResponse.ok) {
          throw new Error(`Failed to save story: ${saveResponse.status}`);
        }
      }
      generateStory(prompt)
    }

  return (
    <div>
      <h1>Story Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input type="text" value={prompt} onChange={handleInputChange} />
        </label>
        <button type="submit">Generate</button>
      </form>
    </div>
  );
};





export default StoryGenerator;
