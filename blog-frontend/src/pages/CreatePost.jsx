import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useToast } from "../ToastContext";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const wordCount = useMemo(
    () => form.content.trim().split(/\s+/).filter(Boolean).length,
    [form.content],
  );

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/posts", form);
      addToast("Post created.", "success");
      navigate(response.data.postId ? `/post/${response.data.postId}` : "/");
    } catch (error) {
      addToast(error.response?.data?.message || "Could not create post.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="editor-page page-enter">
      <form className="editor" onSubmit={handleSubmit}>
        <div className="editor__header">
          <div>
            <p className="eyebrow">New post</p>
            <h1>Write something worth saving.</h1>
          </div>
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish"}
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
