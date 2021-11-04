import React, { Component }   from 'react';
// import { NavLink } from 'react-router-dom';
import * as $                 from 'jquery';

import logoSrc                from '../img/logo.png';

class Nav extends Component {

  render(){
    return(

      <div>
        <div className="showOrHideButton-div">
          <a onClick={ this.hideNavBar } className="button-hideNavBar">
            <i className="fa fa-angle-left fa-lg"></i>
          </a>
          <a onClick={ this.expandNavBar } className="button-expandNavBar">
            <i className="fa fa-angle-double-right fa-lg"></i>
          </a>
        </div>
        <div onClick={ this.unExpandNavArea } className="unExpandNavArea"></div>
      <nav id="navBar" className="main-menu">

        <div className="box-logo">
          <a href="/" className="box-logo-content">
            <img className="box-logo-icon" src={ logoSrc } alt="Gran Telescopio de Canarias" />
            <span className="box-logo-text"> GRANTECAN </span>
          </a>
       </div>

        <div className="scrollbar style-1">

          <ul>

          <li>
            <a href="/">
              <i className="fa fa-home fa-lg menuNav-icon"></i>
              <span className="nav-text"> Home </span>
            </a>
          </li>

            <li>
              <a href="/list">
                <i className="fa fa-list-ul fa-lg menuNav-icon"></i>
                <span className="nav-text"> Show All </span>
              </a>
            </li>

            <li className="darkerli darkerlishadow">
              <a href="/create">
                <i className="bx bxs-add-to-queue menuNav-icon bx-menu-icons"></i>
                <span className="nav-text"> Add New Camera </span>
              </a>
            </li>

            <li className="darkerli darkerlishadowdown">
              <button className="menu-nav-button" onClick={() => {this.showEditDelteButtons()}}>
                <i className="bx bxs-edit menuNav-icon bx-menu-icons"></i>
                <span className="nav-text menu-nav-button-text"> Edit </span>
              </button>
            </li>

            <li>
              <button className="menu-nav-button">
                <i className="fa fa-filter fa-lg menuNav-icon bx-menu-icons adjust-filter-icon"></i>
                <span className="nav-text menu-nav-button-text transform-uppercase adjust-filter-text"> Filter </span>
              </button>
            </li>

          </ul>
          <ul className="ulBottom">
            <li className="logout">
              <a href="#">
                <i className="bx bxs-user menuNav-icon bx-menu-icons"></i>
                <span className="nav-text"> Log in </span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      </div>
    );
  }

  showEditDelteButtons = () =>{

    $(".deleteUpdate-cameraButtons-box").toggleClass('show-deleteUpdate-camerabuttons');
  }

  hideNavBar = () => {

    $(".unExpandNavArea").hide();
    $("#navBar").toggle().removeClass("button-expandNavBar timetransition25s");
    $(".showOrHideButton-div").toggleClass("moveAlong").removeClass("moveAlongExpand timetransition25s").addClass("timetransition0s");
        $(".fa-angle-left").toggleClass("rotate-arrow");
        $(".fa-angle-double-right").removeClass("rotate-arrow");

    $(".rep_prub_cont").toggleClass("marginLeft-0-Cont");
    $(".container-cameras-box").toggleClass("paddingLeft-0");
    $(".rep_prub_cont_inside").toggleClass("paddingLeft-0 paddingRight-0 paddingTop-0");
    // $(".connection_error").toggleClass("marginleft_alignErrorMessageIcon");
    // $(".message_connection_error").toggleClass("marginleft_alignErrorMessageText");

  }
  expandNavBar = () => {

    $(".unExpandNavArea").toggle();
    $("#navBar").show().addClass("timetransition25s").toggleClass("button-expandNavBar");
    $(".showOrHideButton-div").removeClass("moveAlong timetransition0s").addClass("timetransition25s").toggleClass("moveAlongExpand");
        $(".fa-angle-double-right").toggleClass("rotate-arrow");
        $(".fa-angle-left").removeClass("rotate-arrow");

    $(".rep_prub_cont").removeClass("marginLeft-0-Cont");
    $(".container-cameras-box").removeClass("paddingLeft-0");
    $(".rep_prub_cont_inside").removeClass("paddingLeft-0 paddingRight-0 paddingTop-0");
  }
  unExpandNavArea = () => {

    $(".unExpandNavArea").hide();
    $("#navBar").removeClass("button-expandNavBar");
    $(".showOrHideButton-div").removeClass("moveAlongExpand");
    $(".fa-angle-double-right").removeClass("rotate-arrow");
  }
}
export default Nav;
