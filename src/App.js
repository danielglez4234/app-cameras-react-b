import React, { Component } from 'react';
import kurentoUtils         from 'kurento-utils';
import { Provider }         from './components/context';
import axios                from 'axios';
import * as $               from 'jquery';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import loadingSrc          from './img/loading.svg';
import apiNotResponding    from './img/apiNotResponding.png';
// import './css/style.css';

import Test from './components/Test';

import Nav                 from './components/Nav';
import ContainerVideo      from './components/ContainerVideo';
import PageNotFound        from './components/PageNotFound';
import ConnectionError     from './components/ConnectionError';
import UpdateCamera        from './components/UpdateCamera';
import CreateCamera        from './components/CreateCamera';
import HandleAddCamera     from './components/HandleAddCamera';
import HandleUpdateCamera  from './components/HandleUpdateCamera';
import HandleDeleteCamera  from './components/HandleDeleteCamera';
// import AccumulateNotifications from './components/AccumulateNotifications';

const {REACT_APP_SERVICES_IP, REACT_APP_TURN_USERNAME, REACT_APP_TURN_PASSWORD} = process.env;

var connection  = new WebSocket(`ws://${REACT_APP_SERVICES_IP}:8443/kurento`);
const mapKms    = new Map();

class App extends Component {

  constructor() {
    super();
    this.state = {
      connection: connection,
      idCam: [],
      idCamTest: ['test', 'test'],
      loading: true,
      connectionError: false,
      apiRestConnectioError: false,
      data: {
          count: 0,
          kms : [],
          stun : {
            "urls" : `stun:${REACT_APP_SERVICES_IP}:3478`
          },
          turn : {
            "urls" : `turn:${REACT_APP_SERVICES_IP}:3478`,
            "username" : REACT_APP_TURN_USERNAME,
            "credential" : REACT_APP_TURN_PASSWORD
          }
      }
    };
  }


  componentDidMount() {
    const _this = this;
    // console.log(this.state.data.stun);
    console.log("Starting connection to WebSocket Server")
    var start_vis = this;
    this.state.connection.onmessage = function(event){

      // console.info('Received message: ' + event);
      var parsedMessage = JSON.parse(event.data);

      switch (parsedMessage.id) {
      case 'sdpAnswer':
        start_vis.startVisualice(parsedMessage);
        break;
      case 'error':
        //onError("Error message from server: " + parsedMessage.message);
        break;
      case 'stop':
        //stop();
        break;
      case 'iceCandidate':
        mapKms.get(parsedMessage.idCam).addIceCandidate(parsedMessage.candidate, function (error) {
              if (error) {
              console.error("Error adding candidate: " + error);
              return;
              }
          });
          break;
      default:
        //onError('Unrecognized message', parsedMessage);
      }
    }

    this.state.connection.onopen = function(event) {
      _this.connect();
      console.log("Successfully connected to the websocket server...")
    }
    this.state.connection.onerror = function(event) {
      _this.setState({ //save the current state of the data
        connectionError: true
      });
      console.log("Failed to connect to the websocket server...");
    }

  }




  sendMessage = (message) => {
    var jsonMessage = JSON.stringify(message);
    if (this.state.connection == null) {
      console.log('Connection is null');
    } else {
      this.state.connection.send(jsonMessage);
    }
  }




  connect = () => {
    var _this = this;

    axios.get(`http://${REACT_APP_SERVICES_IP}:8443/cameras`)
    .then(response => {

      this.setState({ //save the current state of the data
        idCam: response.data,
        loading: false

      });
      console.log(response.data[0]);

      var checkExists= setInterval(function () {

        if (_this.state.idCam.length > 0) {
          var videoReady = true;
          for (var i = 0; i < _this.state.idCam.length; i++) {
            if (!videoReady || !$(_this.state.idCam[i].id)) {
              videoReady = false;
            }
          }
          if (videoReady) {

            var idCameras = _this.state.idCam;


              for (var x = 0; x < idCameras.length; x++) {

                // console.log(idCameras[i]);
                const camera = idCameras[x];

                const options = {
                  remoteVideo:     document.getElementById(camera.id),
                  onicecandidate:  _this.onIceCandidate,
                  configuration :  { iceServers: [_this.state.data.stun, _this.state.data.turn]}
                }

                mapKms.set(camera.id , new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,  function (error) {

                  if(error) {
                    return console.error(error);
                  }



                  this.generateOffer (function (error, offerSdp) {
                    if (error) return console.error (error);

                    var message = {
                      id : 'sdpOffer',
                      idCam : camera.id,
                      sdpOffer : offerSdp
                    }
                    _this.sendMessage(message);
                  });
                })
              );
            }

            clearInterval(checkExists);
      }
    }

  }, 1000);
    })
    .catch(error => {
      console.log('Error fetching and parsing data', error);
      this.setState({ //save the current state of the data
        apiRestConnectioError: true
      });
    });


  }


  onIceCandidate = (candidate) => {
    var message = {
      id: 'onIceCandidate',
      candidate: candidate
    };
    this.sendMessage(message);
  }


  startVisualice = (message) => {
    console.log("SDP answer received from server. Processing ...");
    mapKms.get(message.idCam).processAnswer (message.sdpAnswer, function (error) {
      if (error) return console.error (error);
    });
  }



  componentWillUnmount(){
    if (this.state.connection != null) {
      this.state.connection.close();
      console.log("Disconnected...");
    }
  }



  render() {

    return (

      <Provider value={{
        idCam:                 this.state.idCam,
        idCamTest:             this.state.idCamTest,
        loading:               this.state.loading,
        connectionError:       this.state.connectionError,
        apiRestConnectioError: this.state.apiRestConnectioError
      }}>
      <BrowserRouter>
        <Nav />

          <Switch>

            <Route exact path="/"  render={() => // if loading is true h3 is displayed, else the gallery is shown
              (this.state.connectionError) ? <ConnectionError /> :
              (this.state.apiRestConnectioError) ?
              <div className="container-cameras-box">
                <div className="rep_prub_cont"><img className="loading connection_error" src={ apiNotResponding } alt="loading"/>
                  <span className="message_connection_error api_error">APi REST server is not responding...</span>
                </div>
              </div> :
              (this.state.loading) ?
              <div className="container-cameras-box">
                <div className="rep_prub_cont">
                  <img className="loading connection_error" src={ loadingSrc } alt="loading"/>
                </div>
              </div> :
              <ContainerVideo />
            } />

            <Route path="/list"           render={() =>
              (this.state.connectionError) ? <ConnectionError /> :
              (this.state.apiRestConnectioError) ?
              <div className="container-cameras-box">
                <div className="rep_prub_cont"><img className="loading connection_error" src={ apiNotResponding } alt="loading"/>
                  <span className="message_connection_error api_error">APi REST server is not responding...</span>
                </div>
              </div> :
              (this.state.loading) ?
              <div className="container-cameras-box">
                <div className="rep_prub_cont">
                  <img className="loading connection_error" src={ loadingSrc } alt="loading"/>
                </div>
              </div> :
              <ContainerVideo />
            } />

            <Route path="/create"         render={() => <CreateCamera /> } />
            <Route path="/add"            render={() => <HandleAddCamera /> } />
            <Route path="/update"         render={() => <UpdateCamera /> } />
            <Route path="/selectedCamera" render={() => <HandleUpdateCamera /> } />
            <Route path="/delete"         render={() => <HandleDeleteCamera /> } />


            <Route component={PageNotFound} /> {/*only appears when no route matches*/}

          </Switch>

      </BrowserRouter>
    </Provider>
    );
  }
}

export default App;
