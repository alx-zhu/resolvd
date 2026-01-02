/**
 * Simulates async API call with minimal delay
 */
export const simulateApiCall = <T>(data: T): Promise<T> => {
  return Promise.resolve(data);
};
