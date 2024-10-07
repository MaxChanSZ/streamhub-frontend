import ReactDOMRun from "../routes/ReactDOMRun";
import LandingPage from "@/pages/LandingPage";
import { useAppContext } from "@/contexts/AppContext";

const App = () => {
  const { isLoggedIn: login, setIsLoggedIn: setLogin } = useAppContext();
  if (login) {
    return (
      <div>
        <ReactDOMRun />
      </div>
    );
  } else {
    return <LandingPage login={login} setLogin={setLogin}/>;
  }
};

export default App;

// login={login} setLogin={setLogin}
