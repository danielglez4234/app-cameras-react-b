import React, { Component } from 'react';
import kurentoUtils         from 'kurento-utils';
import { Provider }         from './components/context';
import axios                from 'axios';
import * as $               from 'jquery';

import { uuid }              from 'uuidv4';
import Cookies               from 'universal-cookie';

import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import loadingSrc          from './img/loading.svg';
import loadingLogIn        from './img/loading-login.svg';
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
const cookies   = new Cookies();

class App extends Component {

  constructor() {
    super();
    this.state = {
      loggedIn: false,
      sessionAlive: false,
      connection: connection,
      idCam: [],
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


  resetSessionId = () => {
    cookies.set('userID', "", { path: '/' });
  }


  componentDidMount() {
    if (cookies.get('userID') === "" || cookies.get('userID') === undefined) {
      this.setState({ loggedIn: false });
    }else {
      this.setState({ loggedIn: true });
    }


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
      _this.resetSessionId();
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

  /*
   * Get connection to /cameras
   */
  connect = () => {
    var _this = this;

    console.log("----Sesion Id----> " + cookies.get('userID'))

      axios.get(`http://${REACT_APP_SERVICES_IP}:8443/cameras`,{ headers: {'session-id': cookies.get('userID')} })
      .then(response => {

        let sessionAlive = response.headers['session-alive'];

        if (sessionAlive !== 'null') {
          this.setState({
            loggedIn: true,
            sessionAlive: true
          });
        }else {
          this.resetSessionId();
          this.setState({
            loggedIn: false,
            sessionAlive: false
          });
        }

        this.setState({
          idCam: response.data,
          loading: false,
          sessionAlive: sessionAlive
        });


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
        this.resetSessionId();
        this.setState({ //save the current state of the data
          apiRestConnectioError: true
        });
      });
  }

  /*
   * Stablish on IceCandidate
   */
  onIceCandidate = (candidate) => {
    var message = {
      id: 'onIceCandidate',
      candidate: candidate
    };
    this.sendMessage(message);
  }

  /*
   * Get the id of the camera to startVisualice
   */
  startVisualice = (message) => {
    console.log("SDP answer received from server. Processing ...");
    mapKms.get(message.idCam).processAnswer (message.sdpAnswer, function (error) {
      if (error) return console.error (error);
    });
  }

  /*
   * Disconnect when the componet is Unmount
   */
  componentWillUnmount(){
    if (this.state.connection != null) {
      this.state.connection.close();
      console.log("Disconnected...");
    }
  }

/*----------------------------------------------------------------------------------------------------------------------------------*/

/*
 * Hide the Login PopUp when clicked outside
 */
  handleHideLogInArea = () => {
    $('.logIn-cont').fadeOut(100);
    $('.logIn-AreaClose').fadeOut(100);
    $('.userName').val("");
    $('.password').val("");
    $('.contein_error_message').remove();
  }


  /*
   * Check for administrator credentials - post with the user data to /users/login
   */
  checkOnSubmitLogIn = () =>{
    const user     = $('.userName').val();
    const password = $('.password').val();

    if (user === "" || password === "") {
      this.handleErrorMessages(true, 'logIn-cont', 'Error: The username or password can not be empty');

    }else {
      $('.loading-logIn').removeClass('display-none');
      $('.contein_error_message').remove();

      cookies.set('userID', uuid(), { path: '/' });
      let userID = cookies.get('userID');

      let body = {
        username: user,
        password: password
      }

      const options = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'session-id': userID
      };

      axios.post(`http://${REACT_APP_SERVICES_IP}:8443/users/login`, body, { headers: options })
      .then(response => {

        this.setState({ //save the current state of the data
          loggedIn: response.data,
          loading: true,
        });

        console.log(JSON.stringify(response));
        this.connect();

        $('.loading-logIn').addClass('display-none');

        if (response.data)
        {
          $('.logIn-cont').fadeOut(100);
          $('.logIn-AreaClose').fadeOut(100);
          this.handleErrorMessages(false);
        }
        else
        {
          this.resetSessionId();
          this.handleErrorMessages(true, 'logIn-cont', 'Error: The username or password are incorrect');
        }
      })
      .catch(error => {
        this.resetSessionId();
        $('.loading-logIn').addClass('display-none');
        this.handleErrorMessages(true, 'logIn-cont', 'Error: The Sever is not responding');
        console.log("ERROR:" + error);
      });
    }

  }

  /*
   * LogOut function - it reset the sessionID to " ", and resets the connection with no user credenditials
   */
  logOut = () => {
    this.resetSessionId();
    this.connect();
    console.log("--- LOGOUT ---");
  }

  /*
   * Handle Error messages
   */
  handleErrorMessages = (view, appendTo, message) => {
    let errorMessage = $("<div class='contein_error_message margin-top-15px'><div class='error_message'>" + message + "</div></div>");
    if (view) {
      $("." + appendTo).remove(errorMessage);
      $("." + appendTo).append(errorMessage);
    }else {
      $("." + appendTo).hide(errorMessage);
    }
  };


  render() {

    return (

      <Provider value={{
        logOut:                this.logOut,
        loggedIn:              this.state.loggedIn,
        idCam:                 this.state.idCam,
        loading:               this.state.loading,
        connectionError:       this.state.connectionError,
        apiRestConnectioError: this.state.apiRestConnectioError
      }}>
      <BrowserRouter>
        <div className="container-box">
          <Nav />
            <Switch>
              <Route exact path="/"  render={() =>
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

              <Route path="/list" render={() =>
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
                {
                  (this.state.loggedIn) ?
                    <div className="display-flex-grow">
                      <Route path="/create"         render={() => <CreateCamera /> } />
                      <Route path="/update"         render={() => <UpdateCamera /> } />
                      <Route path="/add"            render={() => <HandleAddCamera /> } />
                      <Route path="/selectedCamera" render={() => <HandleUpdateCamera /> } />
                      <Route path="/delete"         render={() => <HandleDeleteCamera /> } />
                    </div>
                  : ""
                }
              <Route component={PageNotFound} /> {/*only appears when no route matches*/}

            </Switch>
        </div>
        </BrowserRouter>

        <div className="logIn-cont display-none">
          <p className="text-logIn">This LogIn is only for administrators</p>
          <input type="text" className="inputs-logIn userName" placeholder="User"/>
          <input type="password" className="inputs-logIn password" placeholder="Password"/>
          <button onClick={() => { this.checkOnSubmitLogIn() }} className="button-form-logIn">Log In</button>

          <img className="loading-logIn display-none" src={ loadingLogIn } alt="loading..." />
        </div>
        <div onClick={() => { this.handleHideLogInArea() }}className="logIn-AreaClose display-none"></div>

    </Provider>
    );
  }
}

export default App;
