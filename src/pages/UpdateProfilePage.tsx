import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/shadcn/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { toast } from "@/components/shadcn/ui/use-toast";
import * as apiClient from "@/utils/api-client";
import { useAppContext } from "@/contexts/AppContext";
import DeleteAccountButton from "@/components/DeleteAccountButton";

export type UpdateFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const UpdateProfilePage = () => {
  const inputFieldFormat = "border rounded w-full py-2 px-3.5 my-2 text-black text-lg";
  const errorTextFormat = "text-red-500";
  const { register, watch, handleSubmit, formState: { errors } } = useForm<UpdateFormData>();
  const { setIsLoggedIn, setUser, user } = useAppContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation(apiClient.update, {
    onSuccess: () => {
      toast({
        title: "Update success",
        description: "Redirecting to landing page, please login",
      });
      console.log("Update success");
      setIsLoggedIn(false);
      setUser(null);
      navigate("start");
    },
    onError: (error: Error) => {
      console.log("Update error:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    },
  });

  const onFormSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  // Subscription related code
  const { data: subscriptionStatus, refetch } = useQuery(
    ["subscriptionStatus", user?.email],
    () => apiClient.getSubscriptionStatus(user?.email || ""),
    {
      enabled: !!user?.email,
    }
  );

  const subscriptionMutation = useMutation(
    (customerId: string) => apiClient.createSubscription(customerId),
    {
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error: Error) => {
        console.log("Subscription error:", error);
        toast({
          title: "Subscription failed",
          description: "There was an error creating your subscription",
          variant: "destructive",
        });
        setIsLoading(false);
      },
    }
  );

  const cancelSubscriptionMutation = useMutation(
    (subscriptionId: string) => apiClient.cancelSubscription(subscriptionId),
    {
      onSuccess: () => {
        toast({
          title: "Subscription canceled",
          description: "Your subscription has been canceled",
        });
        refetch(); // Refresh subscription status
      },
      onError: (error: Error) => {
        console.log("Cancel subscription error:", error);
        toast({
          title: "Cancel subscription failed",
          description: "There was an error canceling your subscription",
          variant: "destructive",
        });
      },
    }
  );

  const handleSubscribe = async () => {
    setIsLoading(true);
    if (user?.email) {
      try {
        const customerId = await apiClient.createOrGetCustomer(user.email);
        subscriptionMutation.mutate(customerId);
      } catch (error) {
        console.error("Error creating customer or subscription:", error);
        toast({
          title: "Subscription failed",
          description: "There was an error processing your subscription",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "User email is not available",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    if (subscriptionStatus?.status === "active" && subscriptionStatus.subscriptionId) {
      cancelSubscriptionMutation.mutate(subscriptionStatus.subscriptionId);
    } else {
      toast({
        title: "Error",
        description: "Unable to cancel subscription. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Account Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-white">Personal Information</h2>
          <form onSubmit={onFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 font-medium text-white">Username</label>
              <input
                id="username"
                className={inputFieldFormat}
                {...register("username")}
                placeholder="Enter your username"
              />
              {errors.username && <span className={errorTextFormat}>{errors.username.message}</span>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-white">Email Address</label>
              <input
                id="email"
                className={inputFieldFormat}
                {...register("email")}
                type="email"
                placeholder="Enter your email"
              />
              {errors.email && <span className={errorTextFormat}>{errors.email.message}</span>}
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium text-white">New Password</label>
              <input
                id="password"
                className={inputFieldFormat}
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must have at least one uppercase letter",
                    hasNumber: (value) =>
                      /\d/.test(value) ||
                      "Password must have at least one number",
                    hasSymbol: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      "Password must have at least one symbol",
                  },
                })}
                type="password"
                placeholder="Enter new password"
              />
              {errors.password && <span className={errorTextFormat}>{errors.password.message}</span>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 font-medium text-white">Confirm New Password</label>
              <input
                id="confirmPassword"
                className={inputFieldFormat}
                {...register("confirmPassword", {
                  validate: (value) => {
                    if (!value) {
                      return "Please confirm your password";
                    } else if (watch("password") !== value) {
                      return "Your passwords do not match";
                    }
                  },
                })}
                type="password"
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <span className={errorTextFormat}>{errors.confirmPassword.message}</span>}
            </div>
            <Button type="submit" variant="secondary" className="w-full">Update Profile</Button>
          </form>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-white">Subscription Management</h2>
          <div className="bg-gray-700 p-6 rounded-lg">
            {subscriptionStatus?.status === "active" ? (
              <div>
                <p className="text-lg mb-4 text-white">You have an active subscription.</p>
                <Button onClick={handleCancelSubscription} variant="destructive" className="w-full">
                  Cancel Subscription
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-4 text-white">Upgrade to our premium plan for just $4.99 USD!</p>
                <Button onClick={handleSubscribe} disabled={isLoading} className="w-full">
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12 flex justify-center"> 
        <DeleteAccountButton />
      </div>
    </div>
  );
};

export default UpdateProfilePage;



