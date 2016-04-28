interface UserResponse {
  account?: string;
  name?: string;
  source?: string;
  members?: string[];
  matches?: MatchResponse[];
  updated?: Date | string;
}
