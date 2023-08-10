import React, { useState } from 'react';

function ImageGenerator({ onGenerate, storyId }) {

    const [imagePrompt, setImagePrompt] = useState("");
    const [imageBase64, setImageBase64] = useState("");
    const [error, setError] = useState("");
    const [generating, setGenerating] = useState(false);
    const [isImageGenerated, setIsImageGenerated] = useState(false);
    const [isImageSaved, setIsImageSaved] = useState(false);

  async function handleImageSubmit(event) {
    event.preventDefault();

    setGenerating(true);

    try {
      const response = await fetch('/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePrompt: imagePrompt })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.status}`);
      }

      const data = await response.json();
      setImageBase64(data.image_base64);
      onGenerate(data.image_base64); 
      setIsImageGenerated(true);
      setIsImageSaved(false);

    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveImage() {

    try {
      const saveResponse = await fetch(`/stories/${storyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image_base64: imageBase64
        }),
      });

      if (!saveResponse.ok) {
        throw new Error(`Failed to save story: ${saveResponse.status}`);
      }

      setIsImageSaved(true);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleImageSubmit}>
        <textarea type="text" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} style={{width: "270px"}} />
        <div style={{ display: 'flex' }}>
            <button type="submit">{isImageGenerated ? 'Regenerate Image' : 'Generate Image'}</button>
            {isImageGenerated && <button type="button" onClick={handleSaveImage}>Save Image</button>}
        </div>
      </form>
      {generating ? <em>Please hold, generating image...</em> : null}
      {error ? <p style={{color: "red"}}>{error}</p> : null}
      {isImageSaved && <p style={{ color: 'green' }}>Your image has been saved!</p>}
      {imageBase64 ? (
        <div>
          <img src={`data:image/png;base64,${imageBase64}`} alt={imagePrompt} />
        </div>
      ) : null}
    </div>
  );
}

export default ImageGenerator;