
import { User } from '../models/user';
import env from '../utils/validateEnv'
import { fetchData } from "./fetchData";

const API_URI = env.REACT_APP_REST_API + "/users";


export const getLoggedInUser = async (): Promise<User> => {
  const res = await fetchData(API_URI, { method: "GET", credentials: "include" });
  return res.json();
}


export interface SignUpCredentials {
  username: string,
  email: string,
  password: string,
}

export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
  const res = await fetchData(`${API_URI}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include"
  })

  return res.json()
}

export interface LoginCredentials {
  username: string,
  password: string,
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const res = await fetchData(`${API_URI}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include"
  })

  return res.json()
}

export const logout = async () => {
  await fetchData(`${API_URI}/logout`, { method: "POST" })
}