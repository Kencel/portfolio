export interface CpContest {
  name: string;
  url: string;
  date: string; // ISO yyyy-mm-dd
  ratingAfter: number;
  delta: number;
  performance: number;
  rank: number;
}

export interface RatingBand { lo: number; hi: number; color: string; label: string }
export interface Bucket { lo: number; count: number }

export interface PlatformStats {
  rating: number;
  peakRating: number;
  rankLabel: string; // "Specialist" / "Brown"
  solved: number;
  contests: CpContest[]; // chronological, rated only
  buckets: Bucket[];     // solved-by-difficulty histogram
}

export interface CpStats { cf: PlatformStats | null; atcoder: PlatformStats | null }
