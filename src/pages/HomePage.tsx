import CarouselPage from "./CarouselPage";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-white justify-center items-center">
      <CarouselPage />
    </div>
  );
};

export default HomePage;
