import React, { Component }  from 'react';
import axios                 from 'axios';
// import md5                   from 'md5';

import loadingSrc            from '../img/loading.svg';
import Cookies               from 'universal-cookie';

const {REACT_APP_SERVICES_IP} = process.env;
const cookies = new Cookies();

class HandleAddCamera extends Component {

  constructor() {
    super();
    this.state = {
      loadingCreate: true,
      connectionError: false
    };
  }


  addCamera = () => {
    const userID      = cookies.get('userID');
    const queryParams = new URLSearchParams(window.location.search);
    const id          = queryParams.get('idCamera');
    const order       = queryParams.get('order');
    const cameraType  = queryParams.get('cameraType');
    const name        = queryParams.get('nameCamera');
    const description = queryParams.get('descriptionCamera');
    const panoramic   = queryParams.get('select');


    const interiorGTC = queryParams.get('interiorGTC');
    const exteriorGTC = queryParams.get('exteriorGTC');
    const offices     = queryParams.get('offices');
    const dome        = queryParams.get('dome');
    const corridor    = queryParams.get('corridor');
    const others      = queryParams.get('others');

    var setgroup      = [];
    if (interiorGTC)  {setgroup.push(interiorGTC);}
    if (exteriorGTC)  {setgroup.push(exteriorGTC);}
    if (offices)      {setgroup.push(offices);}
    if (dome)         {setgroup.push(dome);}
    if (corridor)     {setgroup.push(corridor);}
    if (others)       {setgroup.push(others);}


    //----------------------------------------------------------------

    const recordImagesStatus = queryParams.get('recordImages');
    var recordStatus;
      if (recordImagesStatus === 'on') {
        recordStatus         = true;
      }else {
        recordStatus         = false;
      }

    const processImageStatus = queryParams.get('processImages');
    var processStatus;
      if (processImageStatus === 'on') {
        processStatus        = true;
      }else {
        processStatus        = false;
      }


    // var urlpath;
    // const regexhttps         = /^https:\/\/+/;
    // const regexhttp          = /^http:\/\/+/;

    var url                  = queryParams.get('urlCamera');
    // const credentialsCheck   = queryParams.get('credentialsCheck');

    const user             = queryParams.get('userCamera');
    const pwd              = queryParams.get('pwdCamera');
          // const encryptPwd = md5(pwd);
    // var staticOrStream;
    // if (cameraType === "Stream") {
    //   staticOrStream = "Camera"
    // }else {
    //   staticOrStream = "Static"
    // }

    const options = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session-id': userID
    };

    console.log("-----USERID---->" + userID);

    const createBodyEntities = {
      "id": id,
      "type": "Camera",
      "cameraType": cameraType,
      "order": order,
      "panoramic": panoramic,
      "name": name,
      "group": setgroup,
      "url": url,
      "user": user,
      "password": pwd,
      "kurentoConfig": {
        "recorder": recordStatus,
        "carDetection": processStatus
      },
      "description": description
    };

    console.log(createBodyEntities);

    axios.post(`http://${REACT_APP_SERVICES_IP}:8443/cameras`, createBodyEntities, { headers: options	})
      .then(response => {
        this.setState({ //save the current state of the data
          loadingCreate: false
        });
      })
      .catch(error => {

        this.setState({ //save the current state of the data
          connectionError: true
        });
        console.log('Error fetching and parsing data on the ORION context brocker', error);
      });
  }


  componentDidMount() {
    this.addCamera();
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
                        <span className="message-text"><strong>Success:</strong> Camera created correctly</span>
                        <a href="/">
                          <i className="fa fa-times fa-2x exit-button "></i>
                        </a>
                      </div>;
    // const success = <p>The camera <b>{this.state.showId}</b> was created successfully.. go to <a href="/">Home</a></p>
    return (
      <div className="rep_prub_form">

      { (this.state.connectionError) ? error :
        (this.state.loadingCreate) ? <img className="loading connection_error" src={ loadingSrc } alt="loading"/> : success }
      </div>
    );
  }
}

export default HandleAddCamera;
