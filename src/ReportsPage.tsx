import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/v1'; // Update to your Express server URL

interface Block {
  id: number;
  name: string;
  totalData: number;
  blockPercentage: number;
  surveyData: number;
  surveyPercentage: number;
  districtId: number;
}

interface District {
  id: number;
  name: string;
  type: 'RURAL' | 'URBAN';
  serialNo?: number | null;
}

const BlockReport: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [blockData, setBlockData] = useState<Block | null>(null);
  const [selectedType, setSelectedType] = useState<'ALL' | 'RURAL' | 'URBAN'>('ALL');
  const [loading, setLoading] = useState<string | null>(null); // 'districts' or 'blocks' or null
  const [error, setError] = useState<string | null>(null);

  // Fetch districts based on type filter
  const fetchDistricts = async (typeFilter: string | null = null) => {
    try {
      setLoading('districts');
      setError(null);
      let url = `${API_BASE_URL}/user/districts`;
      if (typeFilter && typeFilter !== 'ALL') {
        url += `?type=${typeFilter}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();
      setDistricts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch districts');
    } finally {
      setLoading(null);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchDistricts(selectedType === 'ALL' ? null : selectedType);
  }, [selectedType]);

  // Fetch blocks when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      const fetchBlocks = async () => {
        try {
          setLoading('blocks');
          setError(null);
          setBlocks([]); // Clear previous blocks
          const response = await fetch(`${API_BASE_URL}/user/blocks/district/${selectedDistrict}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const { data } = await response.json();
          setBlocks(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch blocks');
        } finally {
          setLoading(null);
        }
      };

      fetchBlocks();
    } else {
      setBlocks([]);
      setSelectedBlock(null);
      setBlockData(null);
    }
  }, [selectedDistrict]);

  // Set block data when block is selected
  useEffect(() => {
    if (selectedBlock) {
      const foundBlock = blocks.find(b => b.id === selectedBlock);
      if (foundBlock) {
        setBlockData(foundBlock);
      }
    } else {
      setBlockData(null);
    }
  }, [selectedBlock, blocks]);

  const handleTypeChange = (newType: 'ALL' | 'RURAL' | 'URBAN') => {
    setSelectedType(newType);
    setSelectedDistrict(null); // Reset district selection
    setSelectedBlock(null);
    setBlockData(null);
    setBlocks([]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = parseInt(e.target.value) || null;
    setSelectedDistrict(districtId);
    setSelectedBlock(null); // Reset block selection
    setBlockData(null);
  };

  const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const blockId = parseInt(e.target.value) || null;
    setSelectedBlock(blockId);
  };

  if (loading === 'districts') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading districts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Block Report</h2>
      
      {/* Type Filter Radio Buttons */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <label className="block text-sm font-medium text-gray-700 mb-3">Filter by District Type:</label>
        <div className="flex space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-indigo-600"
              checked={selectedType === 'ALL'}
              onChange={() => handleTypeChange('ALL')}
            />
            <span className="ml-2 text-sm text-gray-700">All</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-indigo-600"
              checked={selectedType === 'RURAL'}
              onChange={() => handleTypeChange('RURAL')}
            />
            <span className="ml-2 text-sm text-gray-700">Rural</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-indigo-600"
              checked={selectedType === 'URBAN'}
              onChange={() => handleTypeChange('URBAN')}
            />
            <span className="ml-2 text-sm text-gray-700">Urban</span>
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Showing {districts.length} district{districts.length !== 1 ? 's' : ''} ({selectedType !== 'ALL' ? selectedType.toLowerCase() : 'all types'}).
        </p>
      </div>

      {/* District Dropdown */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select District:
        </label>
        <select
          id="district-select"
          value={selectedDistrict || ''}
          onChange={handleDistrictChange}
          disabled={districts.length === 0}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">-- Choose a District --</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.serialNo ? `${district.serialNo}. ` : ''}{district.name} ({district.type})
            </option>
          ))}
        </select>
        {districts.length === 0 && !loading && (
          <p className="mt-2 text-sm text-gray-500">No districts found for the selected filter.</p>
        )}
      </div>

      {/* Block Dropdown - Shows only if district selected */}
      {selectedDistrict && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <label htmlFor="block-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Block:
          </label>
          <select
            id="block-select"
            value={selectedBlock || ''}
            onChange={handleBlockChange}
            disabled={loading === 'blocks' || blocks.length === 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Choose a Block --</option>
            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.name}
              </option>
            ))}
          </select>
          {loading === 'blocks' && (
            <p className="mt-2 text-sm text-indigo-600 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading blocks...
            </p>
          )}
          {blocks.length === 0 && selectedDistrict && !loading && (
            <p className="mt-2 text-sm text-gray-500">No blocks found for this district.</p>
          )}
        </div>
      )}

      {/* Block Details - Shows when block selected */}
      {blockData && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600">
            <h3 className="text-xl font-semibold text-white">Block Details: {blockData.name}</h3>
          </div>
          <div className="px-6 py-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Data</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blockData.totalData.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Block Percentage</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blockData.blockPercentage.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Survey Data</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blockData.surveyData.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Survey Percentage</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blockData.surveyPercentage.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {districts.length === 0 && selectedType !== 'ALL' && (
        <p className="text-center text-gray-500 text-lg">No {selectedType.toLowerCase()} districts found.</p>
      )}
    </div>
  );
};

const DistrictReport: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">District Report</h2>
      <p className="text-gray-500">Under development. Select a district to view detailed district-level data.</p>
    </div>
  </div>
);

const VidhanSabhaReport: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Vidhan Sabha Report</h2>
      <p className="text-gray-500">Under development. Select a Vidhan Sabha constituency to view data.</p>
    </div>
  </div>
);

const LokSabhaReport: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Lok Sabha Report</h2>
      <p className="text-gray-500">Under development. Select a Lok Sabha constituency to view data.</p>
    </div>
  </div>
);

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'block' | 'district' | 'vidhan-sabha' | 'lok-sabha'>('block');

  const renderContent = () => {
    switch (activeTab) {
      case 'block':
        return <BlockReport />;
      case 'district':
        return <DistrictReport />;
      case 'vidhan-sabha':
        return <VidhanSabhaReport />;
      case 'lok-sabha':
        return <LokSabhaReport />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Reports Dashboard</h1>
        
        {/* Tabs */}
        <div className="mb-8">
          <nav className="-mx-px flex divide-x divide-gray-200 rounded-lg shadow-sm ring-1 ring-gray-200" role="tablist">
            <button
              type="button"
              onClick={() => setActiveTab('block')}
              className={`w-full rounded-l-lg py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'block'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Block Report
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('district')}
              className={`w-full py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'district'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              District Report
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vidhan-sabha')}
              className={`w-full py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'vidhan-sabha'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vidhan Sabha Report
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lok-sabha')}
              className={`w-full rounded-r-lg py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'lok-sabha'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Lok Sabha Report
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;