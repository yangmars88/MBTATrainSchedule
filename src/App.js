import React, { Component } from 'react';
import './App.css';
       class App extends Component {

            state={
                   dataArray:[]
               };

         getTrainInfo=(station)=>{
                 let arr=[];
             fetch('https://api-v3.mbta.com/predictions?filter[stop]='+station+'&filter[direction_id]=0&include=vehicle&sort=departure_time')
                 .then(response=>response.json())
                 .then(res=> {
                    let changes= res.data.map(dat => {
                        let data={};
                         data.station=station;
                         data.departureTime = dat.attributes.departure_time || 'N/A';
                         data.trackNo= dat.relationships.vehicle.data? dat.relationships.vehicle.data.id : 'N/A';
                         data.boardingStaus = dat.attributes.status || 'N/A';
                         data.trainID = dat.relationships.route.data? dat.relationships.route.data.id : 'N/A';
                         arr.push(data);
                         return 'https://api-v3.mbta.com/routes/' + data.trainID
                     });
                     //console.log(changes); //an array of  urls
                     let requests=changes.map(change=>{return fetch(change).then(response=>response.json()).then(res=> res.data)});  //.then(response=>response.json()).then(res=> res.data)
                     //console.log(requests);
                     Promise.all(requests)
                         .then(responses=>responses.forEach((response,index)=>{
                             //console.log(response);  //returns Objects: res.data[0], res.data[1],...
                             let destination=response.attributes.direction_destinations[0] || 'N/A';
                             arr[index].destination=destination;

                         }))
                         .then(()=>{   //console.log(arr);
                         this.setState({dataArray:arr});
                          })
                 })
         };


         render() {
             let data=this.state.dataArray;
             //console.log(data);
             //console.log(data.length);

           return (
             <div className="App">
                 <h1 className="header">South Station/North Station Train info</h1>
                 <button id="south" onClick={()=>{this.getTrainInfo('South+Station')}}>South Station</button>
                 <button id="north" onClick={()=>{this.getTrainInfo('North+Station')}}>North Station</button>
                 <ul className="myList">
                     <li className="title">
                         <span><strong>DepartureStation</strong></span>
                         <span><strong>DepartureTime</strong></span>
                         <span><strong>Destination</strong> </span>
                         <span><strong>Status</strong></span>
                         <span><strong>Train#</strong></span>
                     </li>
                     <br/>
                     {
                         data.length<=0? <strong>Please Select Station</strong>:
                             data.map(dat=>(
                                 <li key={dat.departureTime+dat.trackNo+dat.destination}>
                                     <span>{dat.station}</span>
                                     <span>{new Date(dat.departureTime).toLocaleString('en-US',{hour:'numeric',minute:'numeric', hour12:true})}</span>
                                     <span>{dat.destination}</span>
                                     <span>{dat.boardingStaus}</span>
                                     <span>{dat.trackNo}</span>

                                 </li>
                             ))
                     }
                 </ul>
             </div>
           );
         }
       }

export default App;
