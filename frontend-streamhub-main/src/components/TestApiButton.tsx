import React from "react";
import axios from "axios";
import { Button } from "./shadcn/ui/button";

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <Button onClick={test}>test api</Button>;
};

export default TestApiButton;
