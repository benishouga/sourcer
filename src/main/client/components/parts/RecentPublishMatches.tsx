import * as React from 'react';
import { useRecentMatches } from '../hooks/api-hooks';
import Matches from './Matches';

export default function() {
  const recentMatches = useRecentMatches();
  return <Matches matches={recentMatches} arrowUserLink={false} />;
}
