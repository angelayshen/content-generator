import React, { useState } from 'react';

function ImageGenerator({ onGenerate }) {
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleImageSubmit(event) {
    event.preventDefault();

    setGenerating(true);

    try {
      const response = await fetch('/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePrompt: imagePrompt }) // Note the change here
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.status}`);
      }

      const data = await response.json();
      setImageBase64(data.image_base64);
      onGenerate(data.image_base64); // Callback to parent component

    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleImageSubmit}>
        <textarea type="text" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} style={{width: "270px"}} />
        <button type="submit">Generate Image</button>
      </form>
      {generating ? <em>Please hold, generating image...</em> : null}
      {error ? <p style={{color: "red"}}>{error}</p> : null}
      {imageBase64 ? <img src={`data:image/png;base64,${imageBase64}`} alt="Generated visual" /> : null}
    </div>
  );
}

export default ImageGenerator;