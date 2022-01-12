import React, { Component }  from 'react';
import axios                 from 'axios';
import * as $                from 'jquery';

import loadingSrc            from '../img/loading-video.svg';
import loading2Src           from '../img/loading-strows.svg';
import idIcon                from '../img/id.png';
import nameIcon              from '../img/name.png';
import groupIcon             from '../img/group.png';
import urlIcon               from '../img/url.png';
import userIcon              from '../img/user.png';
import pwdIcon               from '../img/pwd.png';
import arrowDown             from '../img/arrowDown.png';
import closeGroupIcon        from '../img/closeGroup.png';

import updateMark            from '../img/updateMark.png';

const {REACT_APP_SERVICES_IP} = process.env;

class UpdateCamera extends Component {

  constructor() {
    super();
    this.state = {
      loadingUpdate: true,
      idNotFound: false,
      camera: [],
      credentials: ""
    };
  }

  componentDidMount() {
    const _this = this;
    const queryParams   = new URLSearchParams(window.location.search);
    const idCamera      = queryParams.get('idCam');

    this.getCameraById(idCamera);
    setTimeout(function(){ _this.IfStaticIsChecked(); }, 100);

  }

  getCameraById = (id) =>{
    const options = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    axios.get(`http://${REACT_APP_SERVICES_IP}:8443/cameras/${id}`,  { headers: options	})
      .then(response => {
        this.setState({ //save the current state of the data
          camera: response.data,
          loadingUpdate: false
        });
        this.dropDownMenuGroup();
      })
      .catch(error => {
        this.setState({ //save the current state of the data
          idNotFound: true
        });
        console.log('Error fetching and parsing data on the ORION context brocker', error);
      });
  }

  dropDownMenuGroup = () => {

    $('.toRotateTheArrow').on('click', function() {
      $('.iconInput-arrowDown').toggleClass('rotate-arrow-groups');
    });

    $(".dropdown dt div").on('click', function() {
      $(".dropdown dd ul").slideToggle('fast');
    });

    $(".dropdown dd ul li a").on('click', function() {
      $(".dropdown dd ul").hide();
    });

    $(document).bind('click', function(e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdown")){
        $(".dropdown dd ul").hide();
        $('.iconInput-arrowDown').removeClass('rotate-arrow-groups');
      }
    });

    const allinputsGroup  = $('.mutliSelect input[type="checkbox"]');
    var titleChecked;

    for (var i = 0; i < allinputsGroup.length; i++) {

      if (allinputsGroup.eq(i).is(':checked')){
        titleChecked      = allinputsGroup.eq(i).val();
        var html          = "<div class='group-options-box group-options-box" + titleChecked + "'><span class='span-checked' title=" + titleChecked + ">" + titleChecked + "</span><img src=" + closeGroupIcon + " alt='close group' class='iconSpan-select iconSpan-select"+ titleChecked + "' /></div>";

        $('.multiSel').append(html);
      }
      $('.iconSpan-select' + titleChecked).on('click', function() {

        var titleCheck = $(this).closest('div').find('.span-checked').html();
          $("#" + titleCheck).prop("checked", false);
          $('.group-options-box'+ titleCheck).remove();
      });
    }

    $('.mutliSelect input[type="checkbox"]').on('click', function() {

      var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
        title = $(this).val();

      if ($(this).is(':checked')) {
        var html = "<div class='group-options-box group-options-box" + title + "'><span class='span-checked' title=" + title + ">" + title + "</span><img src=" + closeGroupIcon + " alt='close group' class='iconSpan-select iconSpan-select"+ title + "' /></div>";
        $('.multiSel').append(html);

      } else {
        $('.group-options-box'+ title).remove();

      }

      $('.iconSpan-select' + title).on('click', function() {
        var titleSpan = $(this).closest('div').find('.span-checked').html();
          $("#" + titleSpan).prop("checked", false);
          $('.group-options-box'+ titleSpan).remove();

      });
    });
  }

  staticChecked = () => {
    if ($("#static").is(':checked')) {
      $(".kurentoprocess").removeClass("displayInlineBlock cont-input").addClass("display-none");
      console.log("asda")
    }else {
      $(".kurentoprocess").removeClass("display-none").addClass("cont-input displayInlineBlock");
    }
  }

  IfStaticIsChecked = () => {
    if ($("#static").is(':checked')) {
      $(".panoramicInput").removeClass("display-none-expand").addClass("displayInlineBlock");
      $(".kurentoprocess").removeClass("displayInlineBlock cont-input").addClass("display-none");
      if ($("#panoramic").is(':checked')) {
        $(".select-panoramic").removeClass("display-none-expand");
      }
    }else {
      $(".panoramicInput").removeClass("displayInlineBlock").addClass("display-none-expand");
      $(".kurentoprocess").removeClass("display-none").addClass("cont-input displayInlineBlock");
      $(".select-panoramic").addClass("display-none-expand");
      $('.select-panoramic option:eq(3)').prop('selected', true);
    }
  }

  streamCheckedHidePanoramic = () => {
    if ($("#static").is(':checked')) {
      $(".panoramicInput").removeClass("display-none-expand").addClass("displayInlineBlock");

      if ($("#panoramic").is(':checked')) {
        $(".select-panoramic").removeClass("display-none-expand");
      }
    }else {
      $(".panoramicInput").removeClass("displayInlineBlock").addClass("display-none-expand");

      $(".select-panoramic").addClass("display-none-expand");
      $('.select-panoramic option:eq(3)').prop('selected', true);
    }
  }

  panoramicChecked = () => {
    if ($("#panoramic").is(':checked')) {
      $(".select-panoramic").removeClass("display-none-expand");

    }else {
      $(".select-panoramic").addClass("display-none-expand");
      $('.select-panoramic option:eq(3)').prop('selected', true);
    }
  }



  resetDropDownMenuGroup = () =>{
    $('.group-options-box').remove();
    this.dropDownMenuGroup();
  }

  panoramicChecked = () => {
    if ($("#panoramic").is(':checked')) {
      $(".select-panoramic").removeClass("display-none-expand");

    }else {
      $(".select-panoramic").addClass("display-none-expand");
    }
  }

  render(){
    const _this = this;
    const error = <div className="message-box message-box-error">
                    <i className="fa fa-ban fa-2x"></i>
                    <span className="message-text"><strong>Error:</strong> Internal Server Error - This id cannot be found</span>
                    <a href="/">
                      <i className="fa fa-times fa-2x exit-button "></i>
                    </a>
                  </div>;
    var staticCamera;
    var stream;
    if (!this.state.loadingUpdate) {

      if (this.state.camera.cameraType === "static") {
        staticCamera = true;
        stream = false;
      }else {
        staticCamera = false;
        stream = true;
      }

      var selectedPanoramic;
      setTimeout(function(){
      if (_this.state.camera.panoramic === 'Expand-Full') {
        selectedPanoramic = true;
        $('.select-panoramic option:eq(1)').prop('selected', true);
      }else if (_this.state.camera.panoramic === 'Expand-half') {
        selectedPanoramic = true;
        $('.select-panoramic option:eq(2)').prop('selected', true);
      }else {
        selectedPanoramic = false;
        $('.select-panoramic option:eq(3)').prop('selected', true);
      }
      }, 200);

      var goups       = this.state.camera.group;
      var allGroups   = ["Interior-GTC", "Exterior-GTC","Offices","Dome","Corridor","Others"];
      var reultGroup  = [];
      var liGroups;

      for (var x = 0; x < allGroups.length; x++) {
      liGroups = <li>
                    <label htmlFor={allGroups[x]} className="label-input-select" >{allGroups[x]}</label>
                    <input defaultChecked={goups.includes(allGroups[x])} id={allGroups[x]} name={allGroups[x]} type="checkbox" value={allGroups[x]} />
                 </li>;
       reultGroup.push(liGroups);
      }
    }

  return(
      <div className="rep_prub_form">
      {
        (this.state.idNotFound) ? error :
          <div className="update_container">
            <div id="title_container" className="mark_title_update mark_title_create">
              <h4 className="title_update_cameras"> Update Camera </h4>
              <img src={ updateMark } alt="update mark" className="icon-updateMark" />
           </div>
            <form className="formCameras" action="/selectedCamera" method="get">
            {
              (this.state.loadingUpdate) ? <div className="cont-view-order"><img className="loadingOrder" src={ loading2Src } alt="loading"/></div> :
              <div className="cont-view-order"><input id="countCamera" name="order" className="input-orderCamera" defaultValue={ this.state.camera.order } /></div>
            }
      <div className="formInputsfields">

      {
      (this.state.loadingUpdate) ? <img className="loadingUpdate" src={ loadingSrc } alt="loading"/> :

      <div>
        <div className="conts-inputs-id-cameraName">
          <div className="id_disabled"></div>
          <div className="cont-input cont-input-idCam">
            <label htmlFor="idCamera" className="label-input">
              <img src={ idIcon } alt="id-camera" className="iconInput iconInput-idcam" />
              <span className="input-label-span input-label-idCam">Id-Camera</span>
            </label>
            <input defaultValue={this.state.camera.id} id="idCamera" name="idCamera" className="input-form input-form-id-camera" placeholder="Id..."/>
          </div>
          <div className="cont-input cont-input-name">
            <label htmlFor="nameCamera" className="label-input" >
              <img src={ nameIcon } alt="name" className="iconInput iconInput-name" />
              <span className="input-label-span input-label-name">Name</span>
            </label>
             <input defaultValue={this.state.camera.name} id="nameCamera" name="nameCamera" className="input-form input-form-name" placeholder="Name..." />
          </div>
        </div>

        <div className="cont-input cont-input-group">
          <div className="input-group-select-box">
            <label htmlFor="groupCamera" className="label-input" >
              <img src={ groupIcon } alt="group" className="iconInput iconInput-group" />
              <span className="input-label-span input-label-group">Group</span>
            </label>
            <dl id="groupCamera" className="dropdown">
                <dt>
                  <div className="toRotateTheArrow">
                    <span className="hida select-dropdowm">Select</span>
                    <img src={ arrowDown } alt="arrow down" className="iconInput iconInput-arrowDown" />
                  </div>
                </dt>
                <dd>
                    <div className="mutliSelect">
                        <ul>
                          {
                            reultGroup
                          }
                        </ul>
                    </div>
                </dd>
            </dl>
          </div>
          <div className="multiSel-Box"><p className="multiSel"></p></div>
        </div>
        <br/>

      <div className="cont-inputs-url-credentials">
        <div className="cont-input cont-input-url">
          <label htmlFor="urlCamera" className="label-input" >
            <img src={ urlIcon } alt="url" className="iconInput iconInput-url" />
            <span className="input-label-span input-label-url">URL</span>
          </label>
           <input defaultValue={this.state.camera.url} id="urlCamera" name="urlCamera" className="input-form input-form-url" placeholder="http://... or https://..." />
        </div>
        <div className="cont-check-setings">
          <div onClick={this.staticChecked} className="cont-input checkboxUrlCredentials displayInlineBlock">
            <label htmlFor="static" className="omrs-input-underlined">
              <input id="static" onClick={ this.streamCheckedHidePanoramic } defaultChecked={staticCamera} type="radio" name="cameraType" value="static" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Static </span>
            </label>
          </div>
          <div onClick={this.staticChecked} className="cont-input checkboxUrlCredentials displayInlineBlock">
            <label htmlFor="Stream" className="omrs-input-underlined">
              <input id="stream" onClick={ this.streamCheckedHidePanoramic } defaultChecked={stream} id="Stream" type="radio" name="cameraType" value="stream" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Stream </span>
            </label>
          </div>
          <div className="cont-input checkboxUrlCredentials displayInlineBlock">
            <label htmlFor="checkCreandentials" className="omrs-input-underlined">
              <input onClick={this.checkCredentials} id="checkCreandentials" type="checkbox" name="credentialsCheck" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Change Credentials </span>
            </label>
          </div>
        </div>
      </div>

        <div className="panoramicInput cont-input checkboxUrlCredentials displayInlineBlock display-none-expand">
          <label htmlFor="panoramic" className="omrs-input-underlined">
            <input onClick={this.panoramicChecked} defaultChecked={selectedPanoramic} id="panoramic" type="checkbox" name="panoramic" className="width-input-1 credentials-input" />
            <span className="input-label-checkCredentials"> Panoramic </span>
          </label>
        </div>

        <div className="cont-input checkboxUrlCredentials display-none-expand select-panoramic">
          <select name="select" className="select-select-panoramic">
            <option value="expand" disabled>Expand</option>
            <option value="Expand-Full" >Expand-Full</option>
            <option value="Expand-half" >Expand-half</option>
            <option value="None">None</option>
          </select>
        </div>
        <br/>

        <div id="cred" className="credentials-update-section">
          <div className="cont-input-user-changePass">
            <div id="userForcamera" className="cont-input-user">
              <label htmlFor="userCamera" className="label-input">
                <img src={ userIcon } alt="user" className="iconInput iconInput-user" />
                <span className="input-label-span input-label-user">User</span>
              </label>
              <input defaultValue={this.state.camera.user} id="userCamera" name="userCamera" className="input-form" placeholder="User name..."/>
            </div>
            <div className="cont-input checkboxUrlCredentials">
              <label htmlFor="checkChangePassword" className="omrs-input-underlined update-change-password-checbox">
                <input onClick={this.checkChangePassword} id="checkChangePassword" type="checkbox" name="credentialsCheck" className="width-input-1 credentials-input" />
                <span className="input-label-checkCredentials"> Change Password </span>
              </label>
            </div>
          </div>

          <br/>

          <div className="change-password-section">
            <div id="pwdForCamera" className="cont-input-pwd cont-update-input-pwd">
              <label htmlFor="pwdCamera" className="label-input">
                <img src={ pwdIcon } alt="pwd" className="iconInput iconInput-pwd" />
                <span className="input-label-span input-label-pwd">Password</span>
              </label>
              <input id="pwdCamera" type="password" name="pwdCamera" className="input-form" placeholder="Password..."/>
            </div>
            <div id="confirmPwdForcamera" className="cont-input-confirm-pwd cont-update-input-confirm-pwd">
              <label htmlFor="confirmPwdCamera" className="label-input">
                <img src={ pwdIcon } alt="confirm-pwd" className="iconInput iconInput-confirm-pwd" />
                <span className="input-label-span input-label-confirm-pwd">Confirm Password</span>
              </label>
              <input id="confirmPwdCamera" type="password" className="input-form" placeholder="Confirm Password..."/>
            </div>
          </div>
        </div>

        <div id="descriptionCamera" className="cont-input displayBlock">
          <span className="input-label-span input-label-description">Description</span>
          <label htmlFor="descriptionCamera-textarea" className="label-input label-input-description">
            <textarea id="descriptionCamera-textarea" defaultValue={this.state.camera.description} name="descriptionCamera" className="description-input-textarea"></textarea>
          </label>
        </div>

        <br />

        <div className="kurentoprocess cont-input displayInlineBlock">
          <label htmlFor="recordImages" className="omrs-input-underlined">
            <input id="recordImages" defaultChecked={this.state.camera.kurentoConfig.recorder} type="checkbox" name="recordImages" className="width-input-1 credentials-input" />
            <span className="input-label-checkCredentials"> Record images </span>
          </label>
        </div>
        <br />
        <div className="kurentoprocess cont-input displayInlineBlock">
          <label htmlFor="processImages" className="omrs-input-underlined">
            <input id="processImages" defaultChecked={this.state.camera.kurentoConfig.carDetection} type="checkbox" name="processImages" className="width-input-1 credentials-input" />
            <span className="input-label-checkCredentials"> Process images </span>
          </label>
        </div>

      </div>

 }
</div>
        <div className="buttons-cont">
          <button className="btn-6">
            <i className="fa fa-undo fa-lg icon-FormButton"></i>
            <span className="submit"> Update </span>
          </button>

          <a  href="/" className="btn-6 btn-6-cancel">
              <i className="fa fa-arrow-circle-left fa-lg icon-FormButton-cancel"></i>
              <span className="cancel"> Cancel </span>
          </a>

          <button onClick={() =>{this.resetDropDownMenuGroup()}} type="reset" className="btn-6 btn-6-reset">
            <i className="fa fa-reply fa-lg icon-FormButton-reset"></i>
            <span className="reset"> Reset </span>
          </button>
        </div>

    </form>

  </div>

}
</div>
  );
  }

  checkCredentials = () => {
       if ($('#checkCreandentials:checkbox:checked').length > 0) {
         $('.credentials-update-section').addClass('show-update-credential-section');
       }
       else if ($('#checkCreandentials:checkbox:checked').length === 0 && $('#checkChangePassword:checkbox:checked').length > 0){
         $('.change-password-section').removeClass('show-password-section');
         $('.credentials-update-section').removeClass('expand-update-credential-section');

         $('#checkChangePassword').prop("checked", false);
         $('.credentials-update-section').removeClass('show-update-credential-section');
       }
       else {
         $('.error-user').hide();
         $('.error-password').hide();
         $('.error-confirm-password').hide();
         $('.credentials-update-section').removeClass('show-update-credential-section');
       }
  }
  checkChangePassword = () =>{
    if ($('#checkChangePassword:checkbox:checked').length > 0) {
      $('.change-password-section').addClass('show-password-section');
      $('.credentials-update-section').addClass('expand-update-credential-section');
    }
    else {
      $('.change-password-section').removeClass('show-password-section');
      $('.credentials-update-section').removeClass('expand-update-credential-section');
    }
  }
}


export default UpdateCamera;
