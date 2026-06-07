import { Link } from "react-router-dom";

function getExcerpt(content = "") {
  if (content.length <= 150) return content;
  return `${content.slice(0, 150).trim()}...`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-card__meta">
        <span>{post.email ?? "Email unavailable"}</span>
        {post.createdAt && <span>{formatDate(post.createdAt)}</span>}
      </div>
      <h2 className="post-card__title">
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="post-card__excerpt">{getExcerpt(post.content)}</p>
      <Link to={`/post/${post.id}`} className="post-card__link">
        Read essay
      </Link>
    </article>
  );
}
