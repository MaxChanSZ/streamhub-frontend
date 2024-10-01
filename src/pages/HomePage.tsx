import { Button } from "@/components/shadcn/ui/button";
import CarouselPage from "./CarouselPage";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const goToTestPage = () => {
    navigate("/test");
  };

  return (
    <div className="text-white justify-center items-center">
      <CarouselPage />
    </div>
  );
};

export default HomePage;
