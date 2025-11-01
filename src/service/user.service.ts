// import axiosInstance from "./axiosInstance";

// class UserService {
  
//   public async getAllDistrict() {
//     try {
//       const res = await axiosInstance.get("/districts");
//       return res.data;
//     } catch (error: any) {
//       throw error;
//     }
//   }
//   public async getAllBlockByDistrict(districtId:number) {
//     try {
//       const res = await axiosInstance.get(`/districts/${districtId}`);
//       return res.data;
//     } catch (error: any) {
//       throw error;
//     }
//   }





  
 
// }

// export const userService = new UserService();





// src/services/user.service.ts
import axiosInstance from "./axiosInstance";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface District {
  district_id: number;
  district_name: string;
}

interface BlockMeta {
  bolck_Id: number;
  block_name: string;
  Block_Type: "R" | "U";
}

interface DistrictMetaResponse {
  district_id: number;
  district_name: string;
  blocks: BlockMeta[];
}

interface BlockFull {
  bolck_Id: number;
  block_name: string;
  Block_Type: "R" | "U";
  [key: string]: any;
}

interface DistrictReport {
  district_id: number;
  district_name: string;
  type: "ALL" | "R" | "U";
  blockCount: number;
  aggregated: Record<string, number>;
}

class UserService {
  // 1. Get all districts
  public async getAllDistrict(token: string): Promise<ApiResponse<District[]>> {
    console.log("Token in getAllDistrict:", token);
    try {
      const res = await axiosInstance.get<ApiResponse<District[]>>("/districts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 2. Get district + block metadata (lightweight – for dropdowns)
  public async getDistrictMeta(districtId: number, token: string): Promise<ApiResponse<DistrictMetaResponse>> {
    try {
      const res = await axiosInstance.get<ApiResponse<DistrictMetaResponse>>(`/districts/${districtId}/meta`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 3. Get full block data (for Block Report)
  public async getBlockById(blockId: number, token: string): Promise<ApiResponse<BlockFull>> {
    try {
      const res = await axiosInstance.get<ApiResponse<BlockFull>>(`/districts/block/${blockId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 4. Get aggregated district report (for District Report)
  public async getDistrictReport(
    districtId: number,
    token: string,
    type: "ALL" | "R" | "U" = "ALL"
  ): Promise<ApiResponse<DistrictReport>> {
    try {
      const res = await axiosInstance.get<ApiResponse<DistrictReport>>(
        `/districts/${districtId}/report`,
        { 
          params: { type },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // (Optional) Keep old method for backward compatibility
  public async getAllBlockByDistrict(districtId: number, token: string): Promise<ApiResponse<any>> {
    try {
      const res = await axiosInstance.get(`/districts/${districtId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getCombinedBlockReport(
    blockName: string,
    districtId: number,
    token: string
  ): Promise<ApiResponse<any>> {
    try {
      const res = await axiosInstance.post(`/districts/combined-by-name`, {
        blockName,
        districtId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
}


export const userService = new UserService();