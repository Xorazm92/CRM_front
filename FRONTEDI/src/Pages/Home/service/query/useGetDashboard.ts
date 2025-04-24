import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDashboard = async ({ token, category }: { token: string; category: string }) => {
  const res = await axios.get("/statistics/dashboard", {
    params: { category },
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  return res.data;
};

export function useGetDashboard(token: string, category: string) {
  return useQuery({
    queryKey: ["dashboard", token, category],
    queryFn: () => fetchDashboard({ token, category }),
  });
}
