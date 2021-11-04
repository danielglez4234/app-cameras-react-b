import React from 'react';

const PageNotFound = () => {
  return(
    <div className="PageNotFound_cont">
    <div className="error-header-box">
      <p className="error_header-title"> Error </p>
      <p className="error_header-icon"> ︾ </p>
    </div>
    <h1 className="error_title"> Oops! the page you are trying to enter cannot be found. </h1>
      <div className="error-status-box">
        <p className="error_icon_message"> Not found </p>
        <p className="error_icon_status"> 404 </p>
      </div>
      <div className="error-status-icon-box">
        <p className="error_icon"> (╯°□°)╯︵ ┻┻ </p>
      </div>
      <div className="error-status-box-GoHome">
        <a href="/">
          <p className="error_icon_message-GoHome"> Go Home ‣</p>
        </a>
      </div>
    </div>
  );
}


export default PageNotFound;
