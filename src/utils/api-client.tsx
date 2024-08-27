import { LoginFormData } from "../pages/LoginPage";
import { RegisterFormData } from "../pages/RegisterPage";
import axios from "axios";
import { User } from "@/utils/types";
import { UpdateFormData } from "../pages/UpdateProfilePage";
import { useAppContext } from "../contexts/AppContext";

export const register = async (formData: RegisterFormData) => {
  const response = await axios
    .post("http://localhost:8080/account/registration/submit", formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw new Error(error.message);
    });
};

export const login = async (formData: LoginFormData): Promise<User> => {
  const response = await axios
    .post(
      "http://localhost:8080/account/login/submit",
      {
        username: formData.username,
        password: formData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw new Error(error.message);
    });
  return response.data;
};

export const update = async (formData: UpdateFormData) => {
  const appContext = useAppContext();
  const user = appContext.user;
  const response = await axios
    .put(
      "http://localhost:8080/account/api/update",
      {
        id: user?.id, // get ID from app-state
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw new Error(error);
    });
};

export const deleteUser = async (id: number) => {
  const response = await axios
    .delete(`http://localhost:8080/account/api/delete/${id}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw new Error(error);
    });
};

export const fetchNewestSeries = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/series/newest');
    if (!response.ok) {
      throw new Error('Failed to fetch newest series');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
};

export const fetchTopRatedSeries = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/series/top-rated');
    if (!response.ok) {
      throw new Error('Failed to fetch top-rated series');
    }
    const data = await response.json();
    const shuffledSeries = data.sort(() => 0.5 - Math.random());
    return shuffledSeries.slice(0, 5);
  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
};