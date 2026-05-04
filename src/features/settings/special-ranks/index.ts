export { specialRanksService } from "./api/specialRanksService";
export { 
  useSpecialRanks, 
  useSpecialRankById,
  useCreateSpecialRank, 
  useUpdateSpecialRank, 
  useDeleteSpecialRank,
  useSetActiveSpecialRank,
  SPECIAL_RANKS_QUERY_KEYS 
} from "./hooks/useSpecialRanks";
export type {
  SpecialRank,
  SpecialRanksResult,
  GetSpecialRanksResponse,
  SpecialRankResponse,
} from "./model/types";
