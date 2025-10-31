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
  public async getAllDistrict(): Promise<ApiResponse<District[]>> {
    const res = await axiosInstance.get<ApiResponse<District[]>>("/districts");
    return res.data;
  }

  // 2. Get district + block metadata (lightweight – for dropdowns)
  public async getDistrictMeta(districtId: number): Promise<ApiResponse<DistrictMetaResponse>> {
    const res = await axiosInstance.get<ApiResponse<DistrictMetaResponse>>(`/districts/${districtId}/meta`);
    return res.data;
  }

  // 3. Get full block data (for Block Report)
  public async getBlockById(blockId: number): Promise<ApiResponse<BlockFull>> {
    const res = await axiosInstance.get<ApiResponse<BlockFull>>(`/districts/block/${blockId}`);
    return res.data;
  }

  // 4. Get aggregated district report (for District Report)
  public async getDistrictReport(
    districtId: number,
    type: "ALL" | "R" | "U" = "ALL"
  ): Promise<ApiResponse<DistrictReport>> {
    const res = await axiosInstance.get<ApiResponse<DistrictReport>>(
      `/districts/${districtId}/report`,
      { params: { type } }
    );
    return res.data;
  }

  // (Optional) Keep old method for backward compatibility
  public async getAllBlockByDistrict(districtId: number): Promise<ApiResponse<any>> {
    const res = await axiosInstance.get(`/districts/${districtId}`);
    return res.data;
  }



  public async getCombinedBlockReport(
    blockName: string,
    districtId: number
  ): Promise<ApiResponse<any>> {
    const res = await axiosInstance.post(`/districts/combined-by-name`, {
      blockName,
      districtId,
    });
    return res.data;
  }
}


export const userService = new UserService();