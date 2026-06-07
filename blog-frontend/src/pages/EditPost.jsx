import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useToast } from "../ToastContext";

export default function EditPost() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addToast } = useToast();
  const wordCount = useMemo(
    () => form.content.trim().split(/\s+/).filter(Boolean).length,
    [form.content],
  );

  useEffect(() => {
    api
      .get(`/api/posts/${id}`)
      .then((response) => {
        setForm({
          title: response.data.title ?? "",
          content: response.data.content ?? "",
        });
      })
      .catch(() => setError("Could not load this post."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.patch(`/api/posts/${id}`, form);
      addToast("Post updated.", "success");
      navigate(`/post/${id}`);
    } catch (requestError) {
      addToast(requestError.response?.data?.message || "Could not update post.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="page status-page">Loading post...</main>;
  }

  if (error) {
    return (
      <main className="page status-page">
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <Link to="/" className="btn btn--secondary">
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="editor-page page-enter">
      <form className="editor" onSubmit={handleSubmit}>
        <div className="editor__header">
          <div>
            <p className="eyebrow">Edit post</p>
            <h1>Refine your draft.</h1>
          </div>
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
        <input
          className="editor__title"
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="editor__content"
          name="content"
          placeholder="Start writing..."
          value={form.content}
          onChange={handleChange}
          required
        />
        <div className="editor__meta">{wordCount} words</div>
      </form>
    </main>
  );
}
