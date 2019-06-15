import React, { Component } from "react";
import {Alert,Button,Container,ImageBackground, AppRegistry, StyleSheet, Dimensions, View,Platform, ListView,TouchableOpacity,
  Image,Text,TouchableHighlight,NetInfo,ActivityIndicator  } from "react-native";
  import MapView, { AnimatedRegion, Animated } from 'react-native-maps';

import { TabNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import LoadingSpinner from './loadingSpinner';
import Constant from './Constant';

const deviceHeight = Dimensions.get("window").height;
const renuka = require("./renuka.png");
const loginbtn = require("./loginbtn.jpg");
const Constants = Constant.getConstants();
class LocationA extends Component 
{
  constructor(props) 
  {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      lastlatitude: 75,
      lastlongitude: -75,
      lastPosition: null,      
      address: 'NOT IN OFFICE',
      attendence: '0',
      lasttimestamp: null,
      phoneNumber: '',
      error:null,
      connection_Status : "",
      spinner: false, // will be true when ajax request is running
    };
  }



  componentDidMount() 
  {
    
    this.checkconnection(); 
   }




checkconnection()
   {
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    that.setState({
      //Setting the value of the date time
      date:
        date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
    });



       NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange
    );   
    NetInfo.isConnected.fetch().done((isConnected) => {

      if(isConnected == true)
      {
        this.setState({connection_Status : "Online"})
      }
      else
      {
        this.setState({connection_Status : "Offline"})
      }

    });

     setTimeout(function () 
    {       
    this.checkconnection(); 
      
    }.bind(this), 10000
    );

     this._handleConnectivityChange();
   }


 componentWillUnmount()
   {

    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange

    );



  }


    _handleConnectivityChange = (isConnected) => {

    if(isConnected == true)
      {
        this.setState({connection_Status : "Online"})
        this.checklogindata();
      }
      else
      {
        this.setState({connection_Status : "Offline"})
       
      }
  };



checklogindata() 
   { 
      navigator.geolocation.watchPosition(
       (lastposition) => {
         const lastPosition = JSON.stringify(lastposition);
            this.setState({ lastPosition });

            if (lastposition.coords.latitude>='22.71' && lastposition.coords.latitude<='22.72'
              && lastposition.coords.longitude>='75.87'&& lastposition.coords.longitude<='75.88') 
            {
                const appName = DeviceInfo.getApplicationName();
                const brand = DeviceInfo.getBrand();
                const buildNumber = DeviceInfo.getBuildNumber();
                const carrier = DeviceInfo.getCarrier();
                const deviceId = DeviceInfo.getDeviceId();
                const phoneNumber = DeviceInfo.getPhoneNumber();
                const uniqueId = DeviceInfo.getUniqueID();

                 const  address='YOU ARE IN OFFICE'
                 const  attendence='1'
                 this.setState({ address });
                 this.setState({ attendence });
                 this.setState({ brand });
                 this.setState({ buildNumber });
                 this.setState({ deviceId });
                 this.setState({ phoneNumber });
                 this.setState({ uniqueId });
            }
            
         this.setState({
           lastlatitude: lastposition.coords.latitude,
           lastlongitude: lastposition.coords.longitude,
           lasttimestamp: lastposition.timestamp,
           error: null,
         });
       },
       (error) => this.setState({ error: error.message }),
       { enableHighAccuracy: false, timeout: 200, maximumAge: 10 },
     );
}





getInitialState() {
  return {
    coordinate: new AnimatedRegion({
      latitude: lastposition.coords.latitude,
      longitude: lastposition.coords.longitude,
    }),
  };
}


componentWillReceiveProps(nextProps) {
  const duration = 500

  if (this.props.coordinate !== nextProps.coordinate) {
    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(
          nextProps.coordinate,
          duration
        );
      }
    } else {
      this.state.coordinate.timing({
        ...nextProps.coordinate,
        duration
      }).start();
    }
  }
}






  Login = async () =>   
  {
    
    this.setState({ spinner:true });
    if (this.state.attendence=='1' &&  this.state.deviceId!='' &&  this.state.connection_Status=='Online') 
  {
    
    var details = {
    'deviceid': this.state.deviceId,
    'devicename': this.state.brand,
    'uniqueId': this.state.uniqueId,
    'latitude':this.state.lastlatitude,
    'longitude':this.state.lastlongitude,
    'mytimestamp':this.state.lasttimestamp
  };

var formBody = [];
for (var property in details) {
  var encodedKey = encodeURIComponent(property);
  var encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");

fetch(Constants.service_url+'Production/Login', 
{
  method: 'POST',
   headers: {
   'x-api-key': 'MYSECRETRENUKAAPIKEY',
   'Accept': 'application/json',
   'Content-Type': 'application/x-www-form-urlencoded'
 },
 body: formBody
 }) 
 .then((response) => response.json())
        .then((responseData) => {
            console.log("Response:",responseData);
                 var ticketList = responseData;
                
                 if (ticketList.code =='200')
                   {
                     this.setState({ spinner:false }); 
                    alert("Login Successfully");                    
                   }

                  else
                    {
                      this.setState({ spinner:false }); 
                      alert('Try Again');
                    }
            
         }).catch((error) => 
            {
               alert('Database Connection Problem');
               this.setState({ spinner:false }); 
            })
        .done(); 

        }
        else
        {
           alert('You are not  in office try again');
           this.setState({ spinner:'' });
        } 

  };






  Logout = async () =>   
  {
    
    this.setState({ spinner:true });
    if (this.state.attendence=='1' &&  this.state.deviceId!='' && this.state.connection_Status=='Online') 
  {    
    var details = {
    'deviceid': this.state.deviceId,
    'devicename': this.state.brand,
    'uniqueId': this.state.uniqueId,
    'latitude':this.state.lastlatitude,
    'longitude':this.state.lastlongitude,
    'mytimestamp':this.state.lasttimestamp
  };

var formBody = [];
for (var property in details) {
  var encodedKey = encodeURIComponent(property);
  var encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");

fetch(Constants.service_url+'Production/Logout', 
{
  method: 'POST',
   headers: {
   'x-api-key': 'MYSECRETRENUKAAPIKEY',
   'Accept': 'application/json',
   'Content-Type': 'application/x-www-form-urlencoded'
 },
 body: formBody
 }) 
 .then((response) => response.json())
        .then((responseData) => {
            console.log("Response:",responseData);
                 var ticketList = responseData;
                
                 if (ticketList.code =='200')
                   {
                     this.setState({ spinner:false }); 
                    alert("Logout Successfully");                    
                   }

                  else
                    {
                      this.setState({ spinner:false }); 
                      alert('Try Again');
                    }
            
         }).catch((error) => 
            {
               alert('Database Connection Problem');
               this.setState({ spinner:false }); 
            })
        .done(); 

        }
        else
        {
           alert('You are not  in office try again');
           this.setState({ spinner:'' });
        } 

  };







  render() 
  {    
    return (   



      <View style={styles.container}>

      <MapView
       followsUserLocation={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}        
        style={styles.map}
        region={{
        latitude:this.state.lastlatitude,
        longitude:this.state.lastlongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
        }}
        showsUserLocation={true}
      />

        

       <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
            />

             <View
            style={{
              alignItems: "center",
              marginTop: 10,
              backgroundColor: "transparent"
            }}
          >
            <TouchableHighlight  
            visible={this.state.spinner}
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={this.Login.bind(this)}
            >
            <Text style={styles.loginText}>SIGN IN</Text>
            </TouchableHighlight>
          </View>


            <View
            style={{
              alignItems: "center",
              backgroundColor: "transparent"
            }}
          >
            <TouchableHighlight  
            visible={this.state.spinner}
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={this.Logout.bind(this)}
            >
            <Text style={styles.loginText}>SIGN OUT</Text>
            </TouchableHighlight>
          </View>



        <View style={styles.logoContainer}>
            
        </View>
          {/*<View
            style={{
              alignItems: "center",
              marginBottom: 40,
              backgroundColor: "transparent"
            }}
          >
 
           <Text style={{color:'#FF4500',fontSize: 25, textAlign: 'center', marginBottom: 20}}>
           {this.state.address} </Text>          
            <Text style={styles.text}>You are { this.state.connection_Status }</Text>
           
           <View style={{ marginTop: 8 }} />  
            <Text style={styles.text}> Location
            {this.state.lastlatitude}
            {this.state.lastlongitude}
            </Text>
            <View style={{ marginTop: 8 }} />            
            <Text style={styles.text}>Your Id: {this.state.deviceId}</Text>
            <View style={{ marginTop: 8 }} />
            <Text style={styles.text}>Mobile: {this.state.uniqueId}</Text>
            <View style={{ marginTop: 8 }} />
          </View>*/}



             <View
            style={{
              alignItems: "center",
              marginTop: 20,
              backgroundColor: "transparent"
            }}
          >
            <TouchableHighlight  
            visible={this.state.spinner}
            style={[styles.buttonContainer, styles.loginButton2]}
            >
            <Text style={styles.loginText}>{this.state.address} ({this.state.date}) ({ this.state.connection_Status })</Text>
            </TouchableHighlight>
          </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({

spinnerTextStyle:  {
    color: '#e26b21'
       },

container: {
    flex: 1,
    backgroundColor: '#e3d7d0',
  },
  icon:{
    width:100,
    height:100,
  },
  title:{
    fontSize:24,
    textAlign: 'center',
    marginTop:10,
    color: "#5F6D7A"
  },
  description: {
    marginTop:10,
    textAlign: 'center',
    color: "#A9A9A9",
    fontSize:16,
    margin:20,
  },
  buttonContainer: {
    height:50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
    marginBottom:10,
    width:350,
    borderRadius:5,
  },
  loginButton: {
    backgroundColor: "#ffffff",
  }, 
  loginButton2: {
    backgroundColor: "#D9FFFFFF",
  },
  buttonText: {
    color: "#030202",
    fontSize:35,
    fontWeight:'bold',
  },
   imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 20
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 40 : 50,
    top: Platform.OS === "android" ? 35 : 60,
    width: 250,
    height: 100
  },
  text: {
    color: "#D8D8D8",
    bottom: 6,
    marginTop: 5
  },
   map: {
        ...StyleSheet.absoluteFillObject,
      },
});

export default LocationA;