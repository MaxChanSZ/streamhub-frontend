import { LoginFormData } from "../pages/LoginPage";
import { RegisterFormData } from "../pages/RegisterPage";
import {
  PollOptionResponseData,
  PollResponseData,
  WatchPartyFormData,
  WatchPartyResponseData,
} from "@/pages/CreateWatchPartyPage";
import axios from "axios";
import { User } from "@/utils/types";
import { UpdateFormData } from "../pages/UpdateProfilePage";
import { useAppContext } from "../contexts/AppContext";
import { PollRequestData } from "@/components/PollForm";
import { PollResponse } from "@/pages/WatchPartyPage";
import { WatchPartyResponse } from "@/pages/PollResultPage";
import { UpdateWatchPartyForm } from "@/pages/ManageWatchPartyPage";

export const register = async (formData: RegisterFormData) => {
  const response = await axios
    .post("http://localhost:8080/account/api/registration/submit", formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log("returning data from apiclient");
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

  return response;
};

export const login = async (formData: LoginFormData): Promise<User> => {
  const response = await axios
    .post(
      "http://localhost:8080/account/api/login/submit",
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

export const getChatMessagesByRoomID = async (roomID: string) => {
  const data = await axios
    .get(`http://localhost:8080/api/messages/${roomID}`)
    .then((response) => {
      console.log(response.data);
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
      }
    });
  if (data === null || data === undefined) {
    console.log("data is null or undefined");
    return [];
  } else {
    return data;
  }
};

export const searchSeries = async (title: string) => {
  const url =
    title == null
      ? "http://localhost:8080/api/series"
      : `http://localhost:8080/api/series?title=${title}`;
  return await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const fetchNewestSeries = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/series/newest");
    if (!response.ok) {
      throw new Error("Failed to fetch newest series");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching series:", error);
    throw error;
  }
};

export const fetchTopRatedSeries = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/series/top-rated");
    if (!response.ok) {
      throw new Error("Failed to fetch top-rated series");
    }
    const data = await response.json();
    const shuffledSeries = data.sort(() => 0.5 - Math.random());
    return shuffledSeries.slice(0, 5);
  } catch (error) {
    console.error("Error fetching series:", error);
    throw error;
  }
};

export const createWatchParty = async (
  formData: WatchPartyFormData
): Promise<WatchPartyResponseData> => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/watch-party/create",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const updateWatchParty = async (
  formData: UpdateWatchPartyForm
): Promise<WatchPartyResponse> => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/watch-party/update",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const fetchWatchParties = async (): Promise<WatchPartyResponse[]> => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/watch-party/get",
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const fetchWatchPartiesWithPoll = async (): Promise<WatchPartyResponse[]> => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/watch-party/get/with-poll",
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const createPoll = async (
  pollData: PollRequestData
): Promise<PollResponseData> => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/poll/create",
      pollData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const getPollOptions = async (
  pollId: number
): Promise<PollOptionResponseData[]> => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/poll/get-poll-options-by-poll",
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
          pollId,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const uploadImage = async (
  image: File,
  fileName: string,
  directory: string
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("fileName", fileName);
    formData.append("directory", directory);
    const response = await axios.post(
      "http://localhost:8080/api/image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const getWatchpartyPoll = async (
  code: string,
  userId: number
): Promise<PollResponse> => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/poll/get-watchparty-poll-by-code",
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
          code,
          userId
        }
      }
    );
    console.log(response.data);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const addVote = async (
  pollId: number,
  pollOptionId: number,
  accountId: number
): Promise<any> => {

  try {
    const response = await axios.post(
      "http://localhost:8080/api/vote/create",
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
          pollId,
          pollOptionId,
          accountId
        }
      }
    );
    console.log(response.data);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};

export const changeVote = async (
  pollId: number,
  newPollOptionId: number,
  accountId: number
): Promise<any> => {

  try {
    const response = await axios.post(
      "http://localhost:8080/api/vote/change",
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
          pollId,
          newPollOptionId,
          accountId
        }
      }
    );
    console.log(response.data);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    } else {
      console.log("Unexpected error:", error);
    }
    throw error;
  }
};