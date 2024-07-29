import { Link } from "react-router-dom";

import { Button } from "@/components/shadcn/ui/button";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col p-2 border-none">
        <h1 className="text-white text-3xl my-4">Home Page</h1>
        <ul>
          <li>
            <Button variant="secondary" asChild>
              <Link to={`/watch/one-piece`}>Series Page</Link>
            </Button>
          </li>
          <li>
            <Button variant="secondary" asChild>
              <Link to={`/watch-party/one-piece/456`}>Watch Party Page</Link>
            </Button>
          </li>
          <li>
            <Button variant="destructive" asChild>
              <Link to={`/hahaha`}>Error Page</Link>
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HomePage;
