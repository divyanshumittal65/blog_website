import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";

function getReadTime(content = "") {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/posts/${id}`)
      .then((response) => setPost(response.data))
      .catch(() => setError("Post not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = isLoggedIn && post && (post.userId === user?.id || post.email === user?.email);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await api.delete(`/api/posts/${id}`);
      addToast("Post deleted.", "success");
      navigate("/");
    } catch (requestError) {
      addToast(requestError.response?.data?.message || "Delete failed.", "error");
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <main className="page status-page">Loading post...</main>;
  }

  if (error || !post) {
    return (
      <main className="page status-page">
        <h1>Not found</h1>
        <p>{error || "This post does not exist."}</p>
        <Link to="/" className="btn btn--secondary">
          Back to Blog Website
        </Link>
      </main>
    );
  }

  return (
    <main className="post-detail page-enter">
      <div className="post-detail__nav">
        <Link to="/" className="post-detail__back-link">
          All posts
        </Link>
        {isOwner && (
          <div className="post-detail__owner-actions">
            <Link to={`/edit/${id}`} className="btn btn--secondary">
              Edit
            </Link>
            <button className="btn btn--danger" onClick={() => setShowConfirm(true)} type="button">
              Delete
            </button>
          </div>
        )}
      </div>

      <article className="post-detail__article">
        <header className="post-detail__header">
          <div className="post-detail__meta">
            <span>{post.email ?? "Email unavailable"}</span>
            <span>|</span>
            <span>{getReadTime(post.content)}</span>
            {post.createdAt && (
              <>
                <span>|</span>
                <span>{formatDate(post.createdAt)}</span>
              </>
            )}
          </div>
          <h1 className="post-detail__title">{post.title}</h1>
        </header>

        <div className="post-detail__content">
          {post.content.split("\n").map((paragraph, index) =>
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />,
          )}
        </div>
      </article>

      {showConfirm && (
        <div className="modal-bg" onClick={() => !deleting && setShowConfirm(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2>Delete this post?</h2>
            <p>This action is permanent. Once deleted, your post cannot be recovered.</p>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                type="button"
              >
                Keep it
              </button>
              <button className="btn btn--danger" onClick={handleDelete} disabled={deleting} type="button">
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
