import { Button } from "@/components/shadcn/ui/button";
import CarouselPage from "./CarouselPage";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const goToTestPage = () => {
    navigate("/test");
  };

  return (
    <div className="flex flex-col text-white">
      <Button variant="destructive" onClick={goToTestPage}>
        Go to test page
      </Button>
      <br />
      <CarouselPage />
    </div>
  );
};

export default HomePage;
