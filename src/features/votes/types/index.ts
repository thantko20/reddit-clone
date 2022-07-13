export type VotesOrigin = 'THREAD' | 'COMMENT';

export interface Votes {
  upvotes: string[];
  downvotes: string[];
  type: VotesOrigin;
  referId: string;
  id: string;
}
