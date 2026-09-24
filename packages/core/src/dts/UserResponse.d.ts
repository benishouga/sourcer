import { MatchResponse } from './MatchResponse';

export interface UserResponse {
  account?: string;
  name?: string;
  source?: string;
  members?: string[];
  matches?: MatchResponse[];
  wins?: number;
  losses?: number;
  updated?: Date | string;
}
