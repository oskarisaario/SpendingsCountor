export interface IError extends Error {
  message: string,
  statusCode: string
}

export const errorHandler = (statusCode: string, message: string) => {
  const error = new Error() as IError;
  error.statusCode = statusCode;
  error.message = message;
  return error;
};