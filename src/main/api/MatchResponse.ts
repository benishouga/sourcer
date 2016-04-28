interface MatchResponse {
  _id?: string;
  winner?: UserResponse;
  contestants?: UserResponse[];
  created?: Date | string;
}
