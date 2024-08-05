import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  /**
   * Sets a timeout to automatically close the toast after 5 seconds.
   * The timeout is cleared when the component unmounts.
   *
   * @returns {void}
   */
  useEffect(() => {
    /**
     * The timer that will automatically close the toast after 5 seconds.
     * @type {NodeJS.Timeout}
     */
    const timer = setTimeout(() => {
      // Call the onClose function to close the toast
      onClose();
    }, 5000);

    // Clear the timer when the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const styles =
    type === "SUCCESS"
      ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md";
  return (
    <div className={styles}>
      <div className="flex justify-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};
