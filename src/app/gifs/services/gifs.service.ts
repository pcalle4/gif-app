import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';


// {
//   'spiderman': [gif1, gif2,gif3],
//   'ironman': [gif1, gif2,gif3],
//   'hulk': [gif1, gif2,gif3],
// }
// Record<string, Gif[]>


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private http = inject(HttpClient)

  trendingGifs = signal<Gif[]>([])
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>({})
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

  constructor() { 
    this.loadTrendingGifs();
  }

  loadTrendingGifs(){

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`,{
      params:{
        api_key: environment.giphyApiKey,
        limit:20,
      }
    }).subscribe((resp) => {
      // console.log('hace la peticion')
      // console.log({resp})
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      //console.log(gifs);
      this.trendingGifsLoading.set(false);
      this.trendingGifs.set(gifs);
    })
  }

  searchGifs(query: string){
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`,{
      params:{
        api_key: environment.giphyApiKey,
        limit:20,
        q: query
      }
     }).pipe(
      map(({data})=> data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap((items)=>{
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()]:items
        }))
      })
     );
  }

  getHistoryGifs(query: string){
    return this.searchHistory()[query] ?? [];
  }

}
