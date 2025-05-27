import axios from "axios"

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchData = async <T>(endpoint: string, token: string | null) => {
  console.log("Fetching data from endpoint:", endpoint);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axiosClient.get<T>(endpoint, { headers });
    console.log("Response", response.data);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      throw err.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};


export default axiosClient