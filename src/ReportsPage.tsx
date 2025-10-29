import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/v1/districts";

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
      const res = await fetch(API_BASE_URL);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load districts");
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

      const res = await fetch(`${API_BASE_URL}/${districtId}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to load blocks");

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

        {/* 🔹 Block Details */}
        {blockData && (
          <div className="mt-8 border-t pt-4">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">
              Block Details: {blockData.block_name}
            </h2>
            <div className="overflow-x-auto">
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