import React, { Component } from 'react';

class App extends Component {
    state={
        dataArray:[]
    }
    componentDidMount(){
        this.getTrainInfo();
    }
    getTrainInfo=()=>{

        fetch('https://api-v3.mbta.com/predictions?filter[stop]=South+Station,North+Station&filter[direction_id]=0&include=vehicle&sort=departure_time')
            .then(response=>response.json())
            .then(res=>{
                let array=[];
                (res.data).forEach(dat=>{
                    let data={};
                    data.departureTime=dat.attributes.departure_time;
                    //data.trackNo=dat.relationships.vehicle.data.id;
                    data.boardingStaus=dat.attributes.status;
                    let trainID=dat.relationships.route.data.id;
                    data.destination=this.getDestination(trainID);
                    array.push(data);
                    //this.setState({data:array})
                    //console.log(this.state.data[0]);
                })
                this.setState({dataArray:array});
                //return array;
            })


    }

    getDestination=(trainID)=>{
        //let destination;
        fetch('https://api-v3.mbta.com/routes/'+trainID)
            .then(response=>response.json())
            .then(res=>{return res.data.attributes.direction_destinations[0];})
        //console.log(destination);
        //console.log(res.data.attributes.direction_destinations[0]);
        //return destination;
    }

    render() {
        //let data=this.state.data;
        //console.log(this.state.data[0].departureTime);
        return (
            <div className="App">
                <h1>Train info</h1>
                {/*<h1>{this.state.data[0].departureTime}</h1>*/}
                {/*<h2>DepartureTime   Destination    Train#    Status</h2>*/}
                {/*<h2>{new Date(data[0].departureTime).toLocaleString('en-US',{hour:'numeric',minute:'numeric', hour12:true})}*/}
                {/*{data[0].boardingStaus}*/}
                {/*</h2>*/}

            </div>
        );
    }
}

export default App;
