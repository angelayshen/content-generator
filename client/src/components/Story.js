import ReactMarkdown from "react-markdown";

function Story({ story }) {
  const { title, user_id, content} = story;

  return (
    <article>
      <h1>{title}</h1>
      <small>
        <p>
          <em>Written by {user_id}</em>
        </p>
      </small>
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

export default Story;