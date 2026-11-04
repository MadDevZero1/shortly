export interface User { id: string; email: string; name?: string }
export interface ShortLink { id?: string; shortCode: string; shortUrl: string; longUrl: string; createdAt?: string; totalClicks?: string }
export interface LinkList { items: ShortLink[]; total: string; page: number; limit: number }
export interface Summary { totalUrls: string; totalClicks: string }
export interface Stats extends ShortLink { totalClicks: string; timezone: string; clicksPerDay: {date:string;clicks:string}[]; topReferrers:{referrer:string;clicks:string}[]; recentClicks:{clickedAt:string;referrer:string}[] }
