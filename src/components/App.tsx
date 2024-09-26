import ReactDOMRun from "../routes/ReactDOMRun";
import LandingPage from "@/pages/LandingPage";
import { useAppContext } from "@/contexts/AppContext";

const App = () => {
  const { isLoggedIn: login, setIsLoggedIn: setLogin } = useAppContext();
  if (login) {
    return (
      <div>
        <ReactDOMRun login={login} setLogin={setLogin} />
      </div>
    );
  } else {
    return <LandingPage login={} setLogin={setLogin} />;
  }
};

export default App;
