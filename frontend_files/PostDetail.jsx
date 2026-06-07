import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import './PostDetail.css';

function getReadTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = isLoggedIn && post && (
    post.userId === user?.id ||
    post.email === user?.email
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/posts/${id}`);
      addToast('Post deleted.', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed.', 'error');
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <main className="post-detail page-enter">
        <div className="post-detail__loading">
          <div className="post-detail__loading-bar" />
          <div className="post-detail__loading-bar post-detail__loading-bar--short" />
          <div className="post-detail__loading-bar" />
          <div className="post-detail__loading-bar" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="post-detail page-enter">
        <div className="post-detail__error">
          <h2>Not found</h2>
          <p>{error || 'This post does not exist.'}</p>
          <Link to="/" className="post-detail__back">← Back to Inkwell</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="post-detail page-enter">
      {/* Back nav */}
      <div className="post-detail__nav">
        <Link to="/" className="post-detail__back-link">← All essays</Link>
        {isOwner && (
          <div className="post-detail__owner-actions">
            <Link to={`/edit/${id}`} className="post-detail__action-btn post-detail__action-btn--edit">
              Edit
            </Link>
            <button
              className="post-detail__action-btn post-detail__action-btn--delete"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Article */}
      <article className="post-detail__article">
        <header className="post-detail__header">
          <div className="post-detail__meta">
            <div className="post-detail__avatar">
              {(post.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="post-detail__meta-info">
              <span className="post-detail__author">
                {post.email?.split('@')[0] ?? 'Anonymous'}
              </span>
              <span className="post-detail__meta-sep">·</span>
              <span className="post-detail__read-time">{getReadTime(post.content)}</span>
              {post.createdAt && (
                <>
                  <span className="post-detail__meta-sep">·</span>
                  <span className="post-detail__date">{formatDate(post.createdAt)}</span>
                </>
              )}
            </div>
          </div>

          <h1 className="post-detail__title">{post.title}</h1>

          <div className="post-detail__rule" />
        </header>

        <div className="post-detail__content">
          {post.content.split('\n').map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          )}
        </div>

        <footer className="post-detail__footer">
          <div className="post-detail__footer-sig">
            <span className="post-detail__footer-logo">✒</span>
            <span>Published on Inkwell</span>
          </div>
          <Link to="/" className="post-detail__footer-link">Browse more essays →</Link>
        </footer>
      </article>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="post-detail__modal-bg" onClick={() => !deleting && setShowConfirm(false)}>
          <div className="post-detail__modal" onClick={e => e.stopPropagation()}>
            <h3 className="post-detail__modal-title">Delete this post?</h3>
            <p className="post-detail__modal-body">
              This action is permanent. Once deleted, your essay cannot be recovered.
            </p>
            <div className="post-detail__modal-actions">
              <button
                className="post-detail__modal-btn post-detail__modal-btn--cancel"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Keep it
              </button>
              <button
                className="post-detail__modal-btn post-detail__modal-btn--confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
