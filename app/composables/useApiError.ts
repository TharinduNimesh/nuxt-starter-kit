type ErrorOptions = {
  title?: string;
  fallback?: string;
  duration?: number;
};

export function useApiError() {
  const toast = useToast();

  const handle = (error: any, options: ErrorOptions = {}) => {
    const {
      title = "Error",
      fallback = "Something went wrong",
      duration = 5000,
    } = options;

    let description = fallback;

    if (error?.statusCode === 401) {
      description = "Please sign in to continue";
    } else if (error?.statusCode === 403) {
      description = "You don't have permission to perform this action";
    } else if (error?.statusCode === 404) {
      description = "The requested resource was not found";
    } else if (error?.statusCode === 429) {
      description = "Too many requests. Please try again later";
    } else if (error?.message) {
      description = error.message;
    }

    toast.add({
      title,
      description,
      color: "red",
      timeout: duration,
    });

    return description;
  };

  return {
    handle,
  };
}
