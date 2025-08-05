class AppleMusicService {
  private baseUrl = 'https://itunes.apple.com/search';
  private songCache: { [key: string]: any[] } = {};

  async searchBollywoodSongs(decade: string, limit: number = 50, excludeIds: Set<string> = new Set()): Promise<any[]> {
    // Check cache first
    const cacheKey = `${decade}_${limit}`;
    if (this.songCache[cacheKey] && this.songCache[cacheKey].length > 0) {
      const cachedSongs = this.songCache[cacheKey].filter(song => 
        !excludeIds.has(song.trackId.toString())
      );
      if (cachedSongs.length >= 10) {
        return cachedSongs;
      }
    }

    // Multiple search terms for better coverage
    const searchTerms: { [key: string]: string[] } = {
      '1980s': [
        'bollywood 1980s hindi songs',
        'hindi film songs 80s',
        'bollywood classics 1980',
        'hindi movie songs 80s'
      ],
      '1990s': [
        'bollywood 1990s hindi songs', 
        'hindi film songs 90s',
        'bollywood hits 1990',
        'hindi movie songs 90s'
      ],
      '2000s': [
        'bollywood 2000s hindi songs',
        'hindi film songs 2000',
        'bollywood hits 2000s',
        'hindi movie songs 2000'
      ],
      '2010s': [
        'bollywood 2010s hindi songs',
        'hindi film songs 2010',
        'bollywood hits 2010s',
        'hindi movie songs 2010'
      ]
    };

    const terms = searchTerms[decade] || searchTerms['2000s'];
    let allSongs: any[] = [];

    // Try multiple search terms to get more results
    for (const term of terms) {
      try {
        const response = await fetch(
          `${this.baseUrl}?term=${encodeURIComponent(term)}&media=music&entity=song&country=IN&limit=${limit}`
        );

        if (!response.ok) {
          console.warn(`Search failed for term: ${term}`);
          continue;
        }

        const data = await response.json();
        const songsWithPreview = data.results.filter((track: any) => 
          track.previewUrl && 
          track.trackName && 
          track.artistName &&
          track.kind === 'song' &&
          !excludeIds.has(track.trackId.toString())
        );
        
        allSongs = [...allSongs, ...songsWithPreview];
        
        // Continue searching to get more variety
        if (allSongs.length >= limit) break;
      } catch (error) {
        console.warn(`Error searching for ${term}:`, error);
        continue;
      }
    }

    // Remove duplicates based on trackId
    const uniqueSongs = allSongs.filter((song, index, self) => 
      index === self.findIndex(s => s.trackId === song.trackId)
    );

    // Cache the results
    this.songCache[cacheKey] = uniqueSongs;

    console.log(`Found ${uniqueSongs.length} unique songs for ${decade}`);
    return uniqueSongs;
  }

  async getRandomSongs(decade: string, count: number = 4, excludeIds: Set<string> = new Set()): Promise<any[]> {
    try {
      const songs = await this.searchBollywoodSongs(decade, 100, excludeIds);
      
      if (songs.length < count) {
        // Fallback to general Bollywood search if decade-specific search fails
        console.log(`Not enough songs for ${decade}, trying general search...`);
        const fallbackResponse = await fetch(
          `${this.baseUrl}?term=${encodeURIComponent('bollywood hindi songs')}&media=music&entity=song&country=IN&limit=100`
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackSongs = fallbackData.results.filter((track: any) => 
            track.previewUrl && 
            track.trackName && 
            track.artistName &&
            !excludeIds.has(track.trackId.toString())
          );
          
          if (fallbackSongs.length >= count) {
            const shuffled = fallbackSongs.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
          }
        }
        
        throw new Error(`Only found ${songs.length} songs, need at least ${count}`);
      }

      const shuffled = songs.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Error getting random songs:', error);
      throw error;
    }
  }

  clearCache() {
    this.songCache = {};
  }
}

export const appleMusicService = new AppleMusicService();