import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col text-white">
      <p>This is Home Page.</p>
      <br />
      <Link to={`/watch/one-piece`}>Click to route to Series Page</Link>
      <Link to={`/watch/one-piece/123`}>Click to route to Watch Page</Link>
      <Link to={`/watch-party/one-piece/456`}>
        Click to route to Watch Party Page
      </Link>
      <Link to={`/hahaha`}>Click to route to Error Page</Link>
    </div>
  );
};

export default HomePage;
