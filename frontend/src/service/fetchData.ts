import { ConflictError, UnAuthorizedError } from "../errors/http_errors";


export async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);

  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMsg = errorBody.error;
    const statusCode = response.status;

    switch (statusCode) {
      case 401:
        throw new UnAuthorizedError(errorMsg)

      case 409:
        throw new ConflictError(errorMsg)

      default:
        throw Error(`Request failed with status: ${statusCode}. Message: ${errorMsg}`);
    }

  }
}