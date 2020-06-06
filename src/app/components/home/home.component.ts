import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from '../../models/global-data';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalDeaths = 0;
  totalActive = 0;
  totalRecovered = 0; 
  dataTable = []; 
  globalData : GlobalDataSummary[] ;
  chart = {
    PieChart : "PieChart",
    ColumnChart : "ColumnChart",
    LineChart : "LineChart",
    height1 : 500,
    height2 : 400,
    options : {
      animation :{
        duration : 100,
        erasing: 'out',
      },
      is3D : true,
      order :'confirmed',
    }
  }
  
  constructor( private dataService : DataServiceService) { }

  initChart(casetype : string){

    this.dataTable = [];     
    
    this.globalData.forEach(cs =>{
      let value: number;
      if(casetype == 'confirmed')
        if(cs.confirmed > 50000)
          value = cs.confirmed

      if(casetype == 'active')
        if(cs.active > 0)
          value = cs.active

      if(casetype == 'recovered')
        if(cs.recovered > 0)
          value = cs.recovered

      if(casetype == 'deaths')
        if(cs.deaths > 500)
          value = cs.deaths

      this.dataTable.push([
            cs.country, value
      ])
    })
    //console.log(this.dataTable);    

  }

  ngOnInit(): void {

    this.dataService.getGlobalData()
    .subscribe(
      {
        next : (result) =>{
          //console.log(result);
          this.globalData = result;
          result.forEach(cs =>{
            if(!Number.isNaN(cs.confirmed)){
              this.totalActive +=cs.active;
              this.totalConfirmed +=cs.confirmed;
              this.totalDeaths +=cs.deaths;
              this.totalRecovered +=cs.recovered;
            }
          })

          this.initChart('confirmed');
        }

      }
    )

    
  }

  updateChart(input : HTMLInputElement){
    //console.log(input.value);
    this.initChart(input.value);

  }

}
