import React, { Component }  from 'react';
import axios                 from 'axios';
import Cookies               from 'universal-cookie';

import loadingSrc            from '../img/loading.svg';

const {REACT_APP_SERVICES_IP} = process.env;
const cookies = new Cookies();

class HandleDeleteCamera extends Component {

  constructor() {
    super();
    this.state = {
      loadingDelete: true,
      loadingDeleteServer: true,
      connectionError: false,
      connectionErrorServer: false
    };
  }

  handleDelete= () => {

    const _this         = this;
    const userID        = cookies.get('userID');
    const queryParams   = new URLSearchParams(window.location.search);

    const idCamera      = queryParams.get('id');
    const typeCam       = "Camera";

    const options = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session-id': userID
    };


    axios.delete(`http://${REACT_APP_SERVICES_IP}:8443/cameras/${idCamera}`, { headers: options	})
      .then(response => {
        setTimeout(function(){
        _this.setState({ //save the current state of the data
          loadingDelete: false
        });
      }, 1000);
        console.log('Camera deleted on sever successfully....');
      })
      .catch(error => {
        _this.setState({ //save the current state of the data
          connectionErrorServer: true
        });
        console.log('Error fetching and parsing data on the ORION context brocker', error);
      });


}


  componentDidMount() {
    this.handleDelete();
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
                        <span className="message-text"><strong>Success:</strong> Camera deleted correctly</span>
                        <a href="/">
                          <i className="fa fa-times fa-2x exit-button "></i>
                        </a>
                      </div>;
    return (
      <div className="rep_prub_form">

      { (this.state.connectionError) ? error :
        (this.state.loadingDelete) ? <img className="loading connection_error" src={ loadingSrc } alt="loading"/> : success }

      </div>
    );
  }
}

export default HandleDeleteCamera;
