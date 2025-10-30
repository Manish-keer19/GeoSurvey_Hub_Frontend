import axiosInstance from "./axiosInstance";

class AuthService {
  public async login(data: any) {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async signup(data: any) {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

 
}

export const authService = new AuthService();
