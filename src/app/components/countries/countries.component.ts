import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from '../../models/global-data';
import { DatewiseData } from '../../models/datewise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators'


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

 
  totalConfirmed = 0;
  totalDeaths = 0;
  totalActive = 0;
  totalRecovered = 0;
  datewiseData ;
  dataTable = []; 
  selectedCountryData : DatewiseData[];
  data : GlobalDataSummary[];
  countries : string [] =[];
 // selected : string = this.data[country ='India'];
  chart = {
    PieChart : "PieChart",
    LineChart : "LineChart",
    height : 500,
    myTitle : 'Statistics of number of COVID-19 cases',
    options : {
      animation :{
        duration : 100,
        erasing: 'out',
      },
      order :'confirmed',
    }
  }

  constructor(private service : DataServiceService) { }

  

  ngOnInit(): void {

    merge(
      this.service.getDatewiseData().pipe(
        map(result =>{ 
          this.datewiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map(result =>{
          this.data = result;
          this.data.forEach(cs =>{
            this.countries.push(cs.country)
          }) 
        })
      )
    ).subscribe({
      complete: ()=>{
        this.updateValues('US')
      }
    })
  }

  updateValues(country : string){

    //console.log(country)
    this.data.forEach(cs =>{
      if(cs.country == country){
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
        this.totalActive = cs.active;
      }
    })

    this.selectedCountryData= this.datewiseData[country]
    //console.log(this.selectedCountryData);
    this.updateChart()
    
  }

  updateChart(){
    this.dataTable = [];  
    //this.dataTable.push(['Cases', 'Date'])
    this.selectedCountryData.forEach(cs =>{
      this.dataTable.push([ cs.date, cs.cases])
    })  
    //console.log(this.dataTable);  
  }

}
