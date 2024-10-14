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
import { UpdateWatchPartyForm, UpdateWatchPartyPasswordForm } from "@/pages/ManageWatchPartyPage";

const API_BASE_URL = "http://localhost:8080";

export const register = async (formData: RegisterFormData) => {
  const response = await axios
    .post(`${API_BASE_URL}/account/api/registration/submit`, formData, {
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
      // Error handling code remains the same
      throw new Error(error.message);
    });

  return response;
};

export const login = async (formData: LoginFormData): Promise<User> => {
  const response = await axios
    .post(
      `${API_BASE_URL}/account/api/login/submit`,
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
      // Error handling code remains the same
      throw new Error(error.message);
    });
  const fullUserInfo = await getFullAccountInfo(response.data.id);
  return { ...response.data, ...fullUserInfo };
};

export const getFullAccountInfo = async (userId: number): Promise<Partial<User>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/payment/user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching full account information:", error);
    throw error;
  }
};

export const update = async (formData: UpdateFormData) => {
  const appContext = useAppContext();
  const user = appContext.user;
  const response = await axios
    .put(
      `${API_BASE_URL}/account/api/update`,
      {
        id: user?.id,
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
      // Error handling code remains the same
      throw new Error(error);
    });
};

export const deleteUser = async (id: number) => {
  const response = await axios
    .delete(`${API_BASE_URL}/account/api/delete/${id}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      
      throw new Error(error);
    });
};

export const getChatMessagesByRoomID = async (roomID: string) => {
  const data = await axios
    .get(`${API_BASE_URL}/api/messages/${roomID}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      throw new Error(error);
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
      ? `${API_BASE_URL}/api/series`
      : `${API_BASE_URL}/api/series?title=${title}`;
  return await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const fetchNewestSeries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/series/newest`);
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
    const response = await fetch(`${API_BASE_URL}/api/series/top-rated`);
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
      `${API_BASE_URL}/api/watch-party/create`,
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
    // Error handling code remains the same
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

export const updateWatchPartyPassword = async (
  formData: UpdateWatchPartyPasswordForm
): Promise<WatchPartyResponse> => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/watch-party/update-password",
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
      `${API_BASE_URL}/api/watch-party/get`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    // Error handling code remains the same
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
      `${API_BASE_URL}/api/poll/create`,
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
    // Error handling code remains the same
    throw error;
  }
};

export const getPollOptions = async (
  pollId: number
): Promise<PollOptionResponseData[]> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/poll/get-poll-options-by-poll`,
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
    // Error handling code remains the same
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
      `${API_BASE_URL}/api/image/upload`,
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
    // Error handling code remains the same
    throw error;
  }
};

export const getWatchpartyPoll = async (
  code: string,
  userId: number
): Promise<PollResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/poll/get-watchparty-poll-by-code`,
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
    // Error handling code remains the same
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
      `${API_BASE_URL}/api/vote/create`,
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
    // Error handling code remains the same
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
      `${API_BASE_URL}/api/vote/change`,
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
    throw error;
  }
};

export const createOrGetCustomer = async (email: string) => {
  console.log('Creating or getting customer for email:', email);
  try {
    const response = await axios.post(`${API_BASE_URL}/api/payment/create-or-get-customer`, { email }, {
      headers: { 
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log('Create or get customer response:', response.data);
    return response.data.customerId;
  } catch (error) {
    console.error('Error in createOrGetCustomer:', error);
    throw error;
  }
};

export const createSubscription = async (customerId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/payment/create-subscription`, { customerId }, {
      headers: { 
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log('Create subscription response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createSubscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/payment/cancel-subscription`, { subscriptionId }, {
      headers: { 
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log('Cancel subscription response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (email: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/payment/subscription/status?email=${email}`, {
      headers: { 
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log('Get subscription status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getSubscriptionStatus:', error);
    throw error;
  }
};
