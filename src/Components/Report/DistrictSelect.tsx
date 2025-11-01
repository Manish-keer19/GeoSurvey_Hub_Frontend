import React from "react";
import { userService } from "../../service/user.service";
import { Spinner } from "./LoaderComponents";
import { ErrorMessage } from "./ErrorComponents";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

interface Props {
  selected: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
}

export const DistrictSelect: React.FC<Props> = ({ selected, onChange, disabled }) => {

    // const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  const [districts, setDistricts] = React.useState<{ district_id: number; district_name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDistricts = async () => {
    if(!token){
      toast.error("token not found");
    }
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getAllDistrict(token);
      if (res.success) {
        setDistricts(res.data);
      } else {
        setError("Failed to load districts");
      }
    } catch (err) {
      setError("Network error while loading districts");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDistricts();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-3 border rounded-lg bg-gray-50 flex items-center justify-center space-x-2">
        <Spinner size="sm" />
        <span className="text-gray-500 text-sm">Loading districts...</span>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDistricts} />;
  }

  return (
    <select
      className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      value={selected || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
    >
      <option value="">-- Select District --</option>
      {districts.map((d) => (
        <option key={d.district_id} value={d.district_id}>
          {d.district_name}
        </option>
      ))}
    </select>
  );
};