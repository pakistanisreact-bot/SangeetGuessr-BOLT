class AppleMusicService {
  private baseUrl = 'https://itunes.apple.com/search';
  private usedSongs = new Set<string>();

  // Clear used songs when starting a new game/category
  clearUsedSongs() {
    this.usedSongs.clear();
  }

  async searchBollywoodSongs(decade: string, limit: number = 50): Promise<any[]> {
    // Multiple search terms for better coverage
    const searchTerms: { [key: string]: string[] } = {
      'pre-2000s': [
        'bollywood 90s hindi songs classic',
        'hindi film songs 80s 90s',
        'bollywood classics retro hindi',
        'old bollywood songs hindi',
        'vintage bollywood music hindi',
        'bollywood golden era songs'
      ],
      'post-2000s': [
        'bollywood 2000s 2010s hindi songs',
        'modern bollywood hindi music',
        'new bollywood songs hindi',
        'contemporary bollywood hits',
        'bollywood 21st century hindi',
        'latest bollywood music hindi'
      ]
    };

    const terms = searchTerms[decade] || searchTerms['post-2000s'];
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
          track.kind === 'song'
        );
        
        allSongs = [...allSongs, ...songsWithPreview];
        
        // If we have enough songs, break early
        if (allSongs.length >= 20) break;
      } catch (error) {
        console.warn(`Error searching for ${term}:`, error);
        continue;
      }
    }

    // Remove duplicates based on trackId
    const uniqueSongs = allSongs.filter((song, index, self) => {
      const isFirstOccurrence = index === self.findIndex(s => s.trackId === song.trackId);
      const notUsedBefore = !this.usedSongs.has(song.trackId.toString());
      return isFirstOccurrence && notUsedBefore;
    });

    // Mark these songs as used
    uniqueSongs.forEach(song => {
      this.usedSongs.add(song.trackId.toString());
    });

    console.log(`Found ${uniqueSongs.length} unique songs for ${decade}`);
    return uniqueSongs;
  }

  async getRandomSongs(decade: string, count: number = 4): Promise<any[]> {
    try {
      const songs = await this.searchBollywoodSongs(decade, 100);
      
      if (songs.length < count) {
        // Fallback to general Bollywood search if decade-specific search fails
        console.log(`Not enough songs for ${decade}, trying general search...`);
        const fallbackResponse = await fetch(
          `${this.baseUrl}?term=${encodeURIComponent('bollywood hindi songs')}&media=music&entity=song&country=IN&limit=100`
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackSongs = fallbackData.results.filter((track: any) => 
            track.previewUrl && track.trackName && track.artistName
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
}

export const appleMusicService = new AppleMusicService();