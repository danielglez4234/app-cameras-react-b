import React, { Component }  from 'react';
import axios from 'axios';
// import md5 from 'md5';
// import * as $ from 'jquery';

import loadingSrc from '../img/loading.svg';

const {REACT_APP_SERVICES_IP} = process.env;

class HandleUpdateCamera extends Component {

  constructor() {
    super();
    this.state = {
      loadingUpdate: true,
      connectionError: false
    };
  }

  handleUpdate = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id          = queryParams.get('idCamera');
    const name        = queryParams.get('nameCamera');
    const cameraType  = queryParams.get('cameraType');
    const description = queryParams.get('descriptionCamera');
    const panoramic   = queryParams.get('select');


    const interiorGTC = queryParams.get('Interior-GTC');
    const exteriorGTC = queryParams.get('Exterior-GTC');
    const offices     = queryParams.get('Offices');
    const dome        = queryParams.get('Dome');
    const corridor    = queryParams.get('Corridor');
    const others      = queryParams.get('Others');

    var setgroup      = [];
    if (interiorGTC)  {setgroup.push(interiorGTC);}
    if (exteriorGTC)  {setgroup.push(exteriorGTC);}
    if (offices)      {setgroup.push(offices);}
    if (dome)         {setgroup.push(dome);}
    if (corridor)     {setgroup.push(corridor);}
    if (others)       {setgroup.push(others);}




    const recordImagesStatus = queryParams.get('recordImages');
    var recordStatus;
      if (recordImagesStatus === 'on') {
        recordStatus = true;
      }else {
        recordStatus = false;
      }

    const processImageStatus = queryParams.get('processImages');
    var processStatus;
      if (processImageStatus === 'on') {
        processStatus  = true;
      }else {
        processStatus  = false;
      }


    // var urlpath;
    // const regexhttps        = /^https:\/\/+/;
    // const regexhttp         = /^http:\/\/+/;

    var url                 = queryParams.get('urlCamera');
    // const credentialsCheck  = queryParams.get('credentialsCheck');
    const user              = queryParams.get('userCamera');
    const pwd               = queryParams.get('pwdCamera');

      var password;
      if (pwd) {
        password = {
                    "type": "String",
                    "value" : pwd
                   };
      }
        // const encryptPwd = md5(pwd);


    const options = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const updateBody = {
      "name": {
        "type": "String",
        "value": name
      },
      "cameraType": {
        "type":    "String",
        "value":   cameraType
      },
      "panoramic":{
        "type": "String",
        "value": panoramic
      },
      "group":{
        "type": "String",
        "value": setgroup
      },
      "url": {
        "type": "String",
        "value": url
      },
      "user": {
        "type": "String",
        "value" :user,
      },
      password,
      "kurentoConfig": {
        "type": "Boolean",
        "value": {
          "recorder":     recordStatus,
          "carDetection": processStatus
        },
      },
      "description": {
        "type": "String",
        "value": description
      }
    };
    axios.patch(`http://${REACT_APP_SERVICES_IP}:1026/v2/entities/${id}/attrs?options=append`, updateBody, { headers: options	})
      .then(response => {
        this.setState({ //save the current state of the data
          loadingUpdate: false
        });
        console.log('Camera updated successfully....');
      })
      .catch(error => {
        this.setState({ //save the current state of the data
          connectionError: true
        });
        console.log('Error fetching and parsing data on the ORION context brocker', error);
      });
  }


  componentDidMount() {
    this.handleUpdate();
  }


  render() {
    const error = <div className="message-box message-box-error">
                    <i className="fa fa-ban fa-2x"></i>
                    <span className="message-text"><strong>Error:</strong> Internal Server Error</span>
                    <a href="/">
                      <i className="fa fa-times fa-2x exit-button "></i>
                    </a>
                  </div>;
    const success = <div className="message-box message-box-success">
                        <i className="fa fa-check fa-2x"></i>
                        <span className="message-text"><strong>Success:</strong> Camera updated correctly</span>
                        <a href="/">
                          <i className="fa fa-times fa-2x exit-button "></i>
                        </a>
                      </div>;
    return (
      <div className="rep_prub_form">

      { (this.state.connectionError) ? error :
        (this.state.loadingUpdate) ? <img className="loading connection_error" src={ loadingSrc } alt="loading"/> : success }

      </div>
    );
  }
}

export default HandleUpdateCamera;
