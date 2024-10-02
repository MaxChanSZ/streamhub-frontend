import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#08081d] text-white">
      <h1 className="text-6xl font-bold ">404</h1>
      <p className="text-xl">Oops! Page not found.</p>
      <p className="text-md text-gray-500 mb-8">
        The requested URL was not found.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;
