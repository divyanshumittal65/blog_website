import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    api
      .get("/api/posts")
      .then((response) => setPosts(response.data))
      .catch(() => setError("Could not load posts. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page home page-enter">
      <section className="home__intro">
        <div>
          <p className="eyebrow">Blog project</p>
          <h1>Blog Website</h1>
          <p>
            A React frontend connected to your Express, MySQL, JWT blog API.
          </p>
        </div>
        <Link to={isLoggedIn ? "/create" : "/signup"} className="btn btn--primary">
          {isLoggedIn ? "Write a post" : "Start writing"}
        </Link>
      </section>

      {loading && (
        <section className="post-grid">
          {[1, 2, 3].map((item) => (
            <div key={item} className="post-card post-card--loading">
              <div />
              <div />
              <div />
            </div>
          ))}
        </section>
      )}

      {error && <p className="alert alert--error">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <section className="empty-state">
          <h2>No posts yet</h2>
          <p>Create the first post and it will appear here.</p>
          {isLoggedIn && (
            <Link to="/create" className="btn btn--primary">
              Write now
            </Link>
          )}
        </section>
      )}

      {!loading && posts.length > 0 && (
        <section className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </main>
  );
}
