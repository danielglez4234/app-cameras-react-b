import React, { Component }   from 'react';
import * as $                 from 'jquery';
import axios                  from 'axios';

import loading2Src           from '../img/loading-strows.svg';
import idIcon                 from '../img/id.png';
import nameIcon               from '../img/name.png';
import groupIcon              from '../img/group.png';
import urlIcon                from '../img/url.png';
import userIcon               from '../img/user.png';
import pwdIcon                from '../img/pwd.png';
import arrowDown              from '../img/arrowDown.png';
import closeGroupIcon         from '../img/closeGroup.png';

const {REACT_APP_SERVICES_IP} = process.env;

const options = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
const body = {
   "method": "POST",
    "description": "Get a norification when ANY attribute is change",
    "subject": {
      "entities": [
        {
        "idPattern": ".*"
        }
      ]
    },
    "notification": {
    "onlyChangedAttrs":true,
      "http": {
      "url": "http://localhost:3000/"
      }
    },
    "duration":"PT10S",
    "throttling": 1
  };

var count;

class CreateCamera extends Component {

  constructor() {
    super();
    this.state = {
      loadingOrder: true,
      connectionError: false,
      countCameras: 0
    };
  }

  componentDidMount() {
    const _this = this;
    setTimeout(function(){
      _this.dropDownMenuGroup();
    }, 1000);
    this.countCamerasForOrder();
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
      var $clicked   = $(e.target);
      if (!$clicked.parents().hasClass("dropdown")){
        $(".dropdown dd ul").hide();
        $('.iconInput-arrowDown').removeClass('rotate-arrow-groups');
      }
    });

    $('.mutliSelect input[type="checkbox"]').on('click', function() {

      var title      = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
        title        = $(this).val();

      if ($(this).is(':checked')) {
        var html     = "<div class='group-options-box group-options-box" + title + "'><span class='span-checked' title=" + title + ">" + title + "</span><img src=" + closeGroupIcon + " alt='close group' class='iconSpan-select iconSpan-select"+ title + "' /></div>";
        $('.multiSel').append(html);

      } else {
        $('.group-options-box'+ title).remove();
      }

      $('.iconSpan-select' + title).on('click', function() {
        var title   = $(this).closest('div').find('.span-checked').html();
          $("#" + title).prop("checked", false);
          $('.group-options-box'+ title).remove();
      });
    });
  }

  resetDropDownMenuGroup = () =>{
    $('.group-options-box').remove();
  }


  staticChecked = () => {
    if ($("#Stream").is(':checked')) {
      $(".kurentoprocess").removeClass("displayInlineBlock cont-input").addClass("display-none");

    }else {
      $(".kurentoprocess").removeClass("display-none").addClass("cont-input displayInlineBlock");
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


  countCamerasForOrder = () => {
    axios.get(`http://${REACT_APP_SERVICES_IP}:1026/v2/entities/`, { headers: options	})
      .then(response => {

        var data = response.data;
        var count = data.filter(o => o.name).length;
        count += 1;

        this.setState({ //save the current state of the data
          loadingOrder: false,
          countCameras: count
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data on the ORION context brocker', error);
      });
  }




  render(){


  return(
<div className="rep_prub_form">

      <div className="update_container">
        <div id="title_container" className="mark_title_update mark_title_create">
          <h4 className="title_update_cameras"> Add New Camera </h4>
        </div>
        <form className="formCameras formCamerasCreate" action="/add" method="get">

        { (this.state.loadingOrder) ? <img className="loadingOrder" src={ loading2Src } alt="loading"/> :
        <input id="countCamera" name="order" className="input-orderCamera" defaultValue={this.state.countCameras} />
        }


<div className="formInputsfields">
          <div className="cont-input cont-input-idCam displayInlineBlock">
            <label htmlFor="idCamera" className="label-input">
              <img src={ idIcon } alt="id-camera" className="iconInput iconInput-idcam" />
              <span className="input-label-span input-label-idCam">Id-Camera</span>
            </label>
            <input id="idCamera" name="idCamera" className="input-form input-form-id-camera" placeholder="Id..."/>
          </div>

          <div className="cont-input cont-input-name displayInlineBlock">
            <label htmlFor="nameCamera" className="label-input" >
              <img src={ nameIcon } alt="name" className="iconInput iconInput-name" />
              <span className="input-label-span input-label-name">Name</span>
            </label>
             <input id="nameCamera" name="nameCamera" className="input-form input-form-name" placeholder="Name..." />
          </div>

          <div className="cont-input cont-input-group">
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
                            <li>
                                <label htmlFor="Interior-GTC" className="label-input-select" >Interior-GTC</label>
                                <input id="Interior-GTC" name="interiorGTC" type="checkbox" value="Interior-GTC" />
                            </li>
                            <li>
                                <label htmlFor="Exterior-GTC" className="label-input-select" >Exterior-GTC</label>
                                <input id="Exterior-GTC" name="exteriorGTC" type="checkbox" value="Exterior-GTC" />
                            </li>
                            <li>
                                <label htmlFor="Offices" className="label-input-select" >Offices</label>
                                <input id="Offices" name="offices" type="checkbox" value="Offices" />
                            </li>
                            <li>
                                <label htmlFor="Dome" className="label-input-select" >Dome</label>
                                <input id="Dome" name="dome" type="checkbox" value="Dome" />
                            </li>
                            <li>
                                <label htmlFor="Corridor" className="label-input-select" >Corridor</label>
                                <input id="Corridor" name="corridor" type="checkbox" value="Corridor" />
                            </li>
                            <li>
                                <label htmlFor="Others" className="label-input-select" >Others</label>
                                <input id="Others" name="others" type="checkbox" value="Others" />
                            </li>
                        </ul>
                    </div>
                </dd>
            </dl>
            <div className="multiSel-Box"><p className="multiSel"></p></div>
          </div>

          <br/>

          <div className="cont-input cont-input-url displayInlineBlock">
            <label htmlFor="urlCamera" className="label-input" >
              <img src={ urlIcon } alt="url" className="iconInput iconInput-url" />
              <span className="input-label-span input-label-url">URL</span>
            </label>
             <input id="urlCamera" name="urlCamera" className="input-form input-form-url" placeholder="http://... or https://..." />
          </div>

          <div onClick={ this.staticChecked } className="cont-input checkboxUrlCredentials displayInlineBlock">
            <label htmlFor="static" className="omrs-input-underlined">
              <input onClick={ this.streamCheckedHidePanoramic } id="static" type="radio" name="cameraType" value="static" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Static </span>
            </label>
          </div>
          <div onClick={ this.staticChecked } className="cont-input checkboxUrlCredentials displayInlineBlock">
            <label htmlFor="Stream" className="omrs-input-underlined">
              <input onClick={ this.streamCheckedHidePanoramic } id="stream" defaultChecked id="Stream" type="radio" name="cameraType" value="stream" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Stream </span>
            </label>
          </div>

          <div className="cont-input checkboxUrlCredentials displayInlineBlock">
            <label htmlFor="checkCreandentials" className="omrs-input-underlined">
              <input onClick={ this.checkCredentials } id="checkCreandentials" type="checkbox" name="credentialsCheck" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Credentials </span>
            </label>
          </div>

          <div className="panoramicInput ont-input checkboxUrlCredentials display-none-expand">
            <label htmlFor="panoramic" className="omrs-input-underlined">
              <input onClick={ this.panoramicChecked } id="panoramic" type="checkbox" name="panoramic" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Panoramic </span>
            </label>
          </div>

          <div className="cont-input checkboxUrlCredentials display-none-expand select-panoramic">
            <select name="select" className="select-select-panoramic">
              <option value="expand" selected disabled>Expand</option>
              <option value="Expand-Full">Expand-Full</option>
              <option value="Expand-half">Expand-half</option>
              <option value="None">None</option>
            </select>
          </div>
          <br/>

        <div id="cred" className="credentials-section">
          <div id="userForcamera" className="cont-input-user">
            <label htmlFor="userCamera" className="label-input">
              <img src={ userIcon } alt="user" className="iconInput iconInput-user" />
              <span className="input-label-span input-label-user">User</span>
            </label>
            <input id="userCamera" name="userCamera" className="input-form" placeholder="User name..."/>
          </div>


          <div id="pwdForCamera" className="cont-input-pwd">
            <label htmlFor="pwdCamera" className="label-input">
              <img src={ pwdIcon } alt="pwd" className="iconInput iconInput-pwd" />
              <span className="input-label-span input-label-pwd">Password</span>
            </label>
            <input id="pwdCamera" type="password" name="pwdCamera" className="input-form" placeholder="Password..."/>
          </div>

          <div id="confirmPwdForcamera" className=" cont-input-confirm-pwd">
            <label htmlFor="confirmPwdCamera" className="label-input">
              <img src={ pwdIcon } alt="confirm-pwd" className="iconInput iconInput-confirm-pwd" />
              <span className="input-label-span input-label-confirm-pwd">Confirm Password</span>
            </label>
            <input id="confirmPwdCamera" type="password" className="input-form" placeholder="Confirm Password..."/>
          </div>
        </div>

          <div id="descriptionCamera" className="cont-input displayBlock">
            <span className="input-label-span input-label-description">Description</span>
            <label htmlFor="descriptionCamera-textarea" className="label-input label-input-description">
              <textarea id="descriptionCamera-textarea" name="descriptionCamera" className="description-input-textarea"></textarea>
            </label>
          </div>

          <br />

          <div className="cont-input displayInlineBlock kurentoprocess">
            <label htmlFor="recordImages" className="omrs-input-underlined">
              <input id="recordImages" type="checkbox" name="recordImages" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Record images </span>
            </label>
          </div>
          <br />
          <div className="cont-input displayInlineBlock kurentoprocess">
            <label htmlFor="processImages" className="omrs-input-underlined">
              <input id="processImages" type="checkbox" name="processImages" className="width-input-1 credentials-input" />
              <span className="input-label-checkCredentials"> Process images </span>
            </label>
          </div>
  </div>


          <div className="buttons-cont">
            <button className="btn-6">
              <i className="fa fa-folder-open fa-lg icon-FormButton"></i>
              <span className="submit"> Create </span>
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

</div>

  );
  }

  checkCredentials = () => {
       if ($('#checkCreandentials:checkbox:checked').length > 0) {
         $('.credentials-section').addClass('show-credential-section');
       }else {
         $('.error-user').hide();
         $('.error-password').hide();
         $('.error-confirm-password').hide();
         $('.credentials-section').removeClass('show-credential-section');
       }
  }

}


export default CreateCamera;
