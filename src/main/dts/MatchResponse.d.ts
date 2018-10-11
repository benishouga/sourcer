import { UserResponse } from './UserResponse';
export interface MatchResponse {
  _id?: string;
  winner?: UserResponse;
  players?: UserResponse[];
  dump?: string;
  created?: Date | string;
}
