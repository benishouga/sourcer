interface MatchResponse {
  _id?: string;
  winner?: UserResponse;
  players?: UserResponse[];
  created?: Date | string;
}
