export const isWindowNull = (): boolean => {
  return typeof window === "undefined";
};

export const tryCatch = async <T>(promise: Promise<T>) => {
  try {
    const response: T = await promise;
    return { response, error: null };
  } catch (error) {
    if (error instanceof Error) {
      // Logging the actual error message if it's an instance of Error
      console.error("tryCatch error occurred:", error.message);
      return { error: error.message, response: null }; // Return error message
    }
    // Handle cases where the error isn't an instance of Error (for unknown error types)
    console.error("tryCatch unknown error occurred:", error);
    return { error: "An unknown error occurred", response: null };
  }
};
