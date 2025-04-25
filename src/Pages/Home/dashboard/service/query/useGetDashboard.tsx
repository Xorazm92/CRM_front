import { instance } from "@/config/AxiosInstance";
import { IGetDashboard } from "@/utils/interface/getDashboard.interface";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = (fullname: string, category: string) => {
  return useQuery({
    queryKey: ["dashboard", fullname, category],
    queryFn: () =>
      instance
        .get<IGetDashboard>("/statistics/dashboard", {
          params: { fullname, category },
        })
        .then((res) => res.data),
  });
};
