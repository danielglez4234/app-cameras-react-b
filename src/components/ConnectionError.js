import React             from 'react';

import connectErrorSrc   from '../img/connection_error.png';

const ConnectionError = () => {
  return(
<div className="container-cameras-box">
    <div className="rep_prub_cont">

      <img className="loading connection_error" src={ connectErrorSrc } alt="loading"/>
      <span className="message_connection_error error_kurento">Failed to connect to the websocket server...</span>

    </div>
</div>
  );
}


export default ConnectionError;
