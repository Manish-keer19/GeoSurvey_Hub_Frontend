import axiosInstance from "./axiosInstance";

class UserService {
  
  public async getAllDistrict() {
    try {
      const res = await axiosInstance.get("/districts");
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
  public async getAllBlockByDistrict(districtId:number) {
    try {
      const res = await axiosInstance.get(`/districts/${districtId}`);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }





  
 
}

export const userService = new UserService();
