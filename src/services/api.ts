import axios from "axios";

export type Provider = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { city: string };
  company: { name: string; catchPhrase: string };
};

const API_URL = "https://jsonplaceholder.typicode.com/users";

export async function fetchProviders(): Promise<Provider[]> {
  const response = await axios.get<Provider[]>(API_URL, { timeout: 10000 });
  return response.data;
}
