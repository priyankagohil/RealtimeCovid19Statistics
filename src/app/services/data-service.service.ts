import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { GlobalDataSummary } from '../models/global-data';
import { DatewiseData } from '../models/datewise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private datewiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-11-2020.csv' ;
  // private baseUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/' ;
  // private globalDataUrl = ``;
  // private extension = '.csv';
  // month;
  // day;
  // year;

  getdate(date: number){
    if(date < 10){
      return '0'+date;
    }
    return date;
  }
  
  constructor(private http : HttpClient) {
    // let now = new Date();
    // this.month = now.getMonth() + 1;
    // this.year = now.getFullYear();
    // this.day = now.getDate();

    //   this.globalDataUrl = `${this.baseUrl}${this.getdate(this.month)}-${this.getdate(this.day)}-${this.year}${this.extension}`;
      
      //console.log(this.globalDataUrl);

   }

  getDatewiseData(){
    return this.http.get(this.datewiseDataUrl, {responseType: 'text'})
    .pipe(map(result => {
        // let data: any = [];
        let rows = result.split('\n');
        //console.log(rows);
        let mainData = {};        
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);        
        dates.splice(0,4);
        //console.log(dates); 
        rows.splice(0,1);
        rows.forEach(row =>{
          let cols = row.split(/,(?=\S)/);
          let country = cols[1];
          cols.splice(0,4);
          //console.log(country , cols);
          mainData[country] = [];
          cols.forEach((value , index) =>{
            let dw : DatewiseData = {
              cases : +value,
              country: country,
              date : new Date(Date.parse(dates[index]))
            }
            mainData[country].push(dw)

          })          
        })
        //console.log(mainData);      

        return mainData;
      }))

  }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType : 'text'}).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0,1);
        rows.forEach(row =>{
          let cols = row.split(/,(?=\S)/);
          
          let cs= {
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10],
          };
          let temp : GlobalDataSummary =raw[cs.country];
          if (temp){
            temp.confirmed = cs.confirmed + temp.confirmed ;
            temp.deaths = cs.deaths + temp.deaths ;
            temp.recovered = cs.recovered + temp.recovered ;
            temp.active = cs.active + temp.active ;

            raw[cs.country] = temp;
          }
          else{
            raw[cs.country] = cs;
          }
        })
        //console.log(raw);
        
        return <GlobalDataSummary[]>Object.values(raw);
      }
      ),
      // catchError(( err:HttpErrorResponse )=>{
      //   if( err.status == 404 ){
      //     let now = new Date()
      //     now.setDate(now.getDate() - 1);
      //     this.month = now.getMonth();
      //     this.day = now.getDate();
      //     this.year = now.getFullYear();
      //     this.globalDataUrl = `${this.baseUrl}${this.getdate(this.month)}-${this.getdate(this.day)}-${this.year}${this.extension}`;
      //     return this.getGlobalData();
      //     // console.log(this.globalDataUrl)
      //   }
      // })
    )}
}
