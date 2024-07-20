import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

// const GIP


@Injectable({providedIn: 'root'})
export class GifsService {

    gifList:Gif[] = []

    private apiKey: string = 'I6AnQRTdWW8dEMAZfyXuEfaufJiyHr5o';
    private serviceUrl:string = 'https://api.giphy.com/v1/gifs';
    private _tagsHistory:string[] = [];

    constructor(private http : HttpClient) {
        this.getLocalStorage();
     }
    
    get tagsHistory(){
        return [...this._tagsHistory];
    }

    private organizeHistory(tag : string){

        tag = tag.toLowerCase();

        if(this._tagsHistory.includes(tag)){
            this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag);
        }

        this._tagsHistory.unshift(tag);

        this._tagsHistory = this.tagsHistory.splice(0,10);


        this.saveLocalStorage()
    }

    private saveLocalStorage():void{

        localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    }
    
    private getLocalStorage():void {
        if(!localStorage.getItem('history')) return;

        this._tagsHistory = JSON.parse(localStorage.getItem('history')!)

        if(this._tagsHistory.length > 0) {this.searchTag(this._tagsHistory[0])}
    }

    searchTag(tag : string):void {

        if(tag.length === 0) return;
        this.organizeHistory(tag);

        const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('q',tag)
        .set('limit',12)

        this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params})
        .subscribe( resp => {

            this.gifList = resp.data
              console.log(this.gifList)
            }
        )
    }
}