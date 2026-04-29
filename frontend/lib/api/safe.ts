import { apiClient } from "@/lib/api/client";

export type SafeAccountPreparationResponse = {
  ownerAddress: string;
  safeAddress: string | null;
  status: "unprepared" | "prepared";
};

export async function getSafePreparation(
  ownerAddress: string
): Promise<SafeAccountPreparationResponse> {
  return apiClient<SafeAccountPreparationResponse>({
    path: `/api/v1/safe/preparation?owner_address=${ownerAddress}`,
    method: "GET"
  });
}
