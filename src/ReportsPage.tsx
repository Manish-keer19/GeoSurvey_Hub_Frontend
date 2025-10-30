// import React, { useEffect, useState } from "react";
// import { userService } from "./service/user.service";

// interface Block {
//   bolck_Id: number;
//   block_name: string;
//   Block_Type: "R" | "U";
//   [key: string]: number | string | null | undefined;
// }

// interface District {
//   district_id: number;
//   district_name: string;
//   districtblockmap?: {
//     block_vd: Block;
//   }[];
// }

// const ReportsPage: React.FC = () => {
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [allBlocks, setAllBlocks] = useState<Block[]>([]); // Store all blocks for the district
//   const [blocks, setBlocks] = useState<Block[]>([]); // Filtered blocks
//   const [selectedType, setSelectedType] = useState<"ALL" | "R" | "U">("ALL");
//   const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [blockData, setBlockData] = useState<Block | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // 🟢 Fetch all districts (no type filter initially)
//   const fetchDistricts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const json = await userService.getAllDistrict();
  
//       setDistricts(json.data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🟢 On mount, fetch all districts
//   useEffect(() => {
//     fetchDistricts();
//   }, []);

//   // 🟢 Filter blocks based on selected type
//   useEffect(() => {
//     if (selectedDistrict && allBlocks.length > 0) {
//       if (selectedType === "ALL") {
//         setBlocks(allBlocks);
//       } else {
//         setBlocks(allBlocks.filter((b) => b.Block_Type === selectedType));
//       }
//       setBlockData(null); // Reset block data on type change
//     }
//   }, [selectedType, allBlocks, selectedDistrict]);

//   // 🟢 When district selected → load its blocks
//   const handleDistrictChange = async (districtId: number) => {
//     try {
//       setSelectedDistrict(districtId);
//       setLoading(true);
//       setError(null);
//       setSelectedType("ALL"); // Reset to ALL on district change
//       setAllBlocks([]);
//       setBlocks([]);

//       const json = await userService.getAllBlockByDistrict(districtId);
//       if (!json.success) throw new Error(json.message || "Failed to load blocks");
//       const fetchedBlocks = json.data.districtblockmap.map(
//         (db: any) => db.block_vd
//       ) as Block[];

//       setAllBlocks(fetchedBlocks);
//       // Initial filter will be handled by useEffect
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🟢 Handle block selection
//   const handleBlockSelect = (blockId: number) => {
//     const found = blocks.find((b) => b.bolck_Id === blockId);
//     setBlockData(found || null);
//   };

//   // 🟢 Compute summary for a block or district
//   const computeSummary = (data: Block | Block[]) => {
//     let decimalSum = 0;
//     let decimalCount = 0;
//     let percSum = 0;
//     let percCount = 0;

//     const blocksToProcess = Array.isArray(data) ? data : [data];

//     blocksToProcess.forEach((block) => {
//       Object.entries(block).forEach(([key, value]) => {
//         if (key.startsWith("c") && key !== "c84" && value !== null && value !== undefined) {
//           const val = Number(value);
//           if (!isNaN(val)) {
//             if (val % 1 !== 0) {
//               // Float: percentage
//               if (val >= 0 && val <= 100) { // Ensure it's a valid percentage
//                 console.log("% value:", val);
//                 percSum += val;
//                 percCount++;
//               }
//             } else {
//               // console.log("Decimal value:", val);
//               // Integer: decimal/value
//               decimalSum += val;
//               decimalCount++;
//             }
//           }
//         }
//       });
//     });

//     return { decimalSum, decimalCount, percSum, percCount };
//   };

//   // 🟢 Get district summary
//   // const districtSummary = selectedDistrict && allBlocks.length > 0 ? computeSummary(allBlocks) : null;

//   // 🟢 Get block summary
//   const blockSummary = blockData ? computeSummary(blockData) : null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-6">
//       <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
//         <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
//           District & Block Report
//         </h1>

//         {/* 🔹 District Dropdown (First) */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-2">
//             Select District:
//           </label>
//           <select
//             className="w-full p-2 border rounded-md"
//             value={selectedDistrict || ""}
//             onChange={(e) => handleDistrictChange(Number(e.target.value))}
//           >
//             <option value="">-- Choose a District --</option>
//             {districts.map((d) => (
//               <option key={d.district_id} value={d.district_id}>
//                 {d.district_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 🔹 Type Filter (After District Selection) */}
//         {selectedDistrict && (
//           <div className="mb-8">
//             <label className="block text-sm font-medium mb-2 text-center">
//               Select Block Type:
//             </label>
//             <div className="flex justify-center gap-4">
//               {["ALL", "R", "U"].map((type) => (
//                 <label key={type} className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="type"
//                     className="rounded"
//                     checked={selectedType === type}
//                     onChange={() => setSelectedType(type as "ALL" | "R" | "U")}
//                   />
//                   <span className="capitalize text-sm">
//                     {type === "R" ? "Rural" : type === "U" ? "Urban" : "All"}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* 🔹 Block Dropdown (After Type Selection) */}
//         {selectedDistrict && blocks.length > 0 && (
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-2">
//               Select Block:
//             </label>
//             <select
//               className="w-full p-2 border rounded-md"
//               onChange={(e) => handleBlockSelect(Number(e.target.value))}
//             >
//               <option value="">-- Choose a Block --</option>
//               {blocks.map((b) => (
//                 <option key={b.bolck_Id} value={b.bolck_Id}>
//                   {b.block_name} ({b.Block_Type})
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* 🔹 District Summary */}
//         {/* {districtSummary && (
//           <div className="mb-8 border-t pt-4">
//             <h2 className="text-xl font-semibold mb-4 text-green-600">
//               District Summary: {districts.find(d => d.district_id === selectedDistrict)?.district_name}
//             </h2>
//             <div className="p-4 bg-blue-50 border rounded-md">
//               <div className="space-y-2 text-sm">
//                 <p className="text-gray-800">
//                   <strong>Total Decimal Value:</strong> {districtSummary.decimalSum.toLocaleString()} (from {districtSummary.decimalCount} values)
//                 </p>
//                 <p className="text-gray-800">
//                   <strong>Total Percentage:</strong> {districtSummary.percSum.toFixed(2)}% (from {districtSummary.percCount} columns)
//                 </p>
//               </div>
//             </div>
//           </div>
//         )} */}

//         {/* 🔹 Block Details */}
//         {blockData && (
//           <div className="mt-8 border-t pt-4">
//             <h2 className="text-xl font-semibold mb-4 text-indigo-600">
//               Block Details: {blockData.block_name}
//             </h2>
//             <div className="overflow-x-auto mb-6">
//               <table className="min-w-full border border-gray-200">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
//                       Attribute
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
//                       Value
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(blockData)
//                     .filter(([k]) => k.startsWith("c"))
//                     .sort(
//                       ([a], [b]) => parseInt(a.slice(1)) - parseInt(b.slice(1))
//                     )
//                     .map(([key, value]) => (
//                       <tr key={key} className="border-t">
//                         <td className="px-4 py-2 text-sm text-gray-600">
//                           {key}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-800">
//                           {value ?? "N/A"}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* 🔹 Block Summary Section */}
//             {blockSummary && (
//               <div className="p-4 bg-gray-50 border rounded-md">
//                 <h3 className="text-lg font-semibold mb-3 text-indigo-600">Block Summary</h3>
//                 <div className="space-y-2 text-sm">
//                   <p className="text-gray-800">
//                     <strong>Total Decimal Value:</strong> {blockSummary.decimalSum.toLocaleString()} (from {blockSummary.decimalCount} columns)
//                   </p>
//                   <p className="text-gray-800">
//                     <strong>Total Percentage:</strong> {blockSummary.percSum.toFixed(2)}% (from {blockSummary.percCount} columns)
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* 🟡 Loading / Error */}
//         {loading && (
//           <div className="text-center mt-6 text-indigo-500">Loading...</div>
//         )}
//         {error && (
//           <div className="text-center mt-6 text-red-500">Error: {error}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReportsPage;











import React, { useEffect, useState } from "react";
import { userService } from "./service/user.service";

interface Block {
  bolck_Id: number;
  block_name: string;
  Block_Type: "R" | "U";
  [key: string]: number | string | null | undefined;
}

interface District {
  district_id: number;
  district_name: string;
  districtblockmap?: {
    block_vd: Block;
  }[];
}

const ReportsPage: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [allBlocks, setAllBlocks] = useState<Block[]>([]); // Store all blocks for the district
  const [blocks, setBlocks] = useState<Block[]>([]); // Filtered blocks
  const [selectedType, setSelectedType] = useState<"ALL" | "R" | "U">("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [blockData, setBlockData] = useState<Block | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🟢 Fetch all districts (no type filter initially)
  const fetchDistricts = async () => {
    try {
      setLoading(true);
      setError(null);
      const json = await userService.getAllDistrict();
  
      setDistricts(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 On mount, fetch all districts
  useEffect(() => {
    fetchDistricts();
  }, []);

  // 🟢 Filter blocks based on selected type
  useEffect(() => {
    if (selectedDistrict && allBlocks.length > 0) {
      if (selectedType === "ALL") {
        setBlocks(allBlocks);
      } else {
        setBlocks(allBlocks.filter((b) => b.Block_Type === selectedType));
      }
      setBlockData(null); // Reset block data on type change
    }
  }, [selectedType, allBlocks, selectedDistrict]);

  // 🟢 When district selected → load its blocks
  const handleDistrictChange = async (districtId: number) => {
    try {
      setSelectedDistrict(districtId);
      setLoading(true);
      setError(null);
      setSelectedType("ALL"); // Reset to ALL on district change
      setAllBlocks([]);
      setBlocks([]);

      const json = await userService.getAllBlockByDistrict(districtId);
      if (!json.success) throw new Error(json.message || "Failed to load blocks");
      const fetchedBlocks = json.data.districtblockmap.map(
        (db: any) => db.block_vd
      ) as Block[];

      setAllBlocks(fetchedBlocks);
      // Initial filter will be handled by useEffect
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Handle block selection
  const handleBlockSelect = (blockId: number) => {
    const found = blocks.find((b) => b.bolck_Id === blockId);
    setBlockData(found || null);
  };

  // 🟢 Compute summary for a block or district
  const computeSummary = (data: Block | Block[]) => {
    let decimalSum = 0;
    let decimalCount = 0;
    let percSum = 0;
    let percCount = 0;

    const blocksToProcess = Array.isArray(data) ? data : [data];

    blocksToProcess.forEach((block) => {
      Object.entries(block).forEach(([key, value]) => {
        if (key.startsWith("c") && key !== "c84" && value !== null && value !== undefined) {
          const val = Number(value);
          if (!isNaN(val)) {
            if (val % 1 !== 0) {
              // Float: percentage
              if (val >= 0 && val <= 100) { // Ensure it's a valid percentage
                console.log("% value:", val);
                percSum += val;
                percCount++;
              }
            } else {
              // console.log("Decimal value:", val);
              // Integer: decimal/value
              decimalSum += val;
              decimalCount++;
            }
          }
        }
      });
    });

    return { decimalSum, decimalCount, percSum, percCount };
  };

  // 🟢 Get district summary
  // const districtSummary = selectedDistrict && allBlocks.length > 0 ? computeSummary(allBlocks) : null;

  // 🟢 Get block summary
  const blockSummary = blockData ? computeSummary(blockData) : null;

  // 🟢 Compute block type counts for ALL selection
  const ruralCount = allBlocks.filter((b) => b.Block_Type === "R").length;
  const urbanCount = allBlocks.filter((b) => b.Block_Type === "U").length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          District & Block Report
        </h1>

        {/* 🔹 District Dropdown (First) */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select District:
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedDistrict || ""}
            onChange={(e) => handleDistrictChange(Number(e.target.value))}
          >
            <option value="">-- Choose a District --</option>
            {districts.map((d) => (
              <option key={d.district_id} value={d.district_id}>
                {d.district_name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Type Filter (After District Selection) */}
        {selectedDistrict && (
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-center">
              Select Block Type:
            </label>
            <div className="flex justify-center gap-4">
              {["ALL", "R", "U"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    className="rounded"
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type as "ALL" | "R" | "U")}
                  />
                  <span className="capitalize text-sm">
                    {type === "R" ? "Rural" : type === "U" ? "Urban" : "All"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 🔹 Block Type Distribution (When ALL is selected) */}
        {selectedDistrict && selectedType === "ALL" && allBlocks.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border rounded-md">
            <h3 className="text-lg font-medium mb-3 text-indigo-600">
              District Block Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-800 font-semibold">Total Blocks</p>
                <p className="text-2xl text-indigo-600">{allBlocks.length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-semibold">Rural Blocks</p>
                <p className="text-2xl text-green-600">{ruralCount}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-semibold">Urban Blocks</p>
                <p className="text-2xl text-purple-600">{urbanCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Block Dropdown (After Type Selection) */}
        {selectedDistrict && blocks.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Block:
            </label>
            <select
              className="w-full p-2 border rounded-md"
              onChange={(e) => handleBlockSelect(Number(e.target.value))}
            >
              <option value="">-- Choose a Block --</option>
              {blocks.map((b) => (
                <option key={b.bolck_Id} value={b.bolck_Id}>
                  {b.block_name} ({b.Block_Type})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🔹 District Summary */}
        {/* {districtSummary && (
          <div className="mb-8 border-t pt-4">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              District Summary: {districts.find(d => d.district_id === selectedDistrict)?.district_name}
            </h2>
            <div className="p-4 bg-blue-50 border rounded-md">
              <div className="space-y-2 text-sm">
                <p className="text-gray-800">
                  <strong>Total Decimal Value:</strong> {districtSummary.decimalSum.toLocaleString()} (from {districtSummary.decimalCount} values)
                </p>
                <p className="text-gray-800">
                  <strong>Total Percentage:</strong> {districtSummary.percSum.toFixed(2)}% (from {districtSummary.percCount} columns)
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* 🔹 Block Details */}
        {blockData && (
          <div className="mt-8 border-t pt-4">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">
              Block Details: {blockData.block_name}
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Attribute
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(blockData)
                    .filter(([k]) => k.startsWith("c"))
                    .sort(
                      ([a], [b]) => parseInt(a.slice(1)) - parseInt(b.slice(1))
                    )
                    .map(([key, value]) => (
                      <tr key={key} className="border-t">
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {key}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {value ?? "N/A"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* 🔹 Block Summary Section */}
            {blockSummary && (
              <div className="p-4 bg-gray-50 border rounded-md">
                <h3 className="text-lg font-semibold mb-3 text-indigo-600">Block Summary</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-800">
                    <strong>Total Decimal Value:</strong> {blockSummary.decimalSum.toLocaleString()} (from {blockSummary.decimalCount} columns)
                  </p>
                  <p className="text-gray-800">
                    <strong>Total Percentage:</strong> {blockSummary.percSum.toFixed(2)}% (from {blockSummary.percCount} columns)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🟡 Loading / Error */}
        {loading && (
          <div className="text-center mt-6 text-indigo-500">Loading...</div>
        )}
        {error && (
          <div className="text-center mt-6 text-red-500">Error: {error}</div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;