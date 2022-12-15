export type StatsType = {
  id: number
  name: string
  views?: number
  likes?: number
  dislikes?: number
  favoriteStars?: number
}

export interface IStats {
  topViews: Array<StatsType>
  topLikes: Array<StatsType>
  topDislikes: Array<StatsType>
  topFavoriteStars: Array<StatsType>
}
