import axios from "axios";
import { Button } from "./shadcn/ui/button";
import { toast } from "./shadcn/ui/use-toast";

const TestApiButton = () => {
  const test = () => {
    axios
      .post("http://localhost:8080/account/api/accounttest", {
        username: "test",
        password: "test",
        email: "test",
      })
      .then((response) => {
        console.log(response);
        toast({
          title: "Success",
          description: `Status: ${response.status} | Message: ${response.data.message} `,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Button onClick={test} variant="ghost" className="text-white">
      test api
    </Button>
  );
};

export default TestApiButton;
