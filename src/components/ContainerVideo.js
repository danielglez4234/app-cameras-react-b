import React, { Component }   from 'react';
import { Consumer }           from './context';
import * as $                 from 'jquery';

import noCameaSrc             from '../img/noCamera.png';
import loadingSrc             from '../img/loading.svg';
import apiNotResponding       from '../img/apiNotResponding.png';
// import deleteIcon          from '../img/delete.png';

import Videos                 from './Videos';
import ConnectionError        from './ConnectionError';

class ContainerVideo extends Component {

  constructor() {
    super();
    this.state = {
      countVideos: 0
      // mapTestId: [
      //             {id:'1', cameraType:"static", url:"https://atmosportal.gtc.iac.es/webcams/camaraAllSky.jpg", order: 1},
      //             {id:'2', cameraType:"static", url:"https://atmosportal.gtc.iac.es/img/lastskycam.jpg", order: 2},
      //             {id:'3', cameraType:"static", url:"https://atmosportal.gtc.iac.es/img/lastzenithcam.jpg", order: 3, panoramic:true},
      //             {id:'4', cameraType:"static", url:"https://atmosportal.gtc.iac.es/webcams/pasillo.jpg", order: 5, panoramic:false}
      //           ]
    };
  }

    warningDelete = (id) =>{
      $('.warning-delete' + id).fadeIn(100);
      $('.block-area-for-warning-delete').fadeIn(100);
    }
    closeWarningDelete = (id) =>{
      if (id) {
        $('.warning-delete' + id).fadeOut(100);
        $('.block-area-for-warning-delete').fadeOut(100);
      }
      else {
        $('.warning-delete').fadeOut(100);
        $('.block-area-for-warning-delete').fadeOut(100);
      }
    }


    showMenuItems = (id) =>{
      $('.menuCameraItem' + id).toggle();
      $('.menuVideoCameraButton' + id).toggleClass('border-bottom-left-radius-0 border-top-left-radius-0');
      $('.cameraButtons' + id).toggleClass('opacity-on-Move-right');
    }

    coverCamera = (id) =>{
      $('.rep_prub').toggle();
      $('.coverCameraButtonIcon').toggleClass('cover-rotate-when-clicked');
      $('.rep_prub' + id).toggleClass('displayBlock width-height-1');
      if ($(".pnc" + id).hasClass("panoramic")) {
        $('.rep_prub' + id).toggleClass('adjust-panoramic');
      }
    }

    showMoreInfo = (id) =>{
      $('.rep_prub-info' + id).toggleClass('show-rep_prub-info');
    }


    adjustPanoramic = () => {
      var imgHTML = $(".video_streamJPG");
      for (var i = 0; i < imgHTML.length; i++) {
        var url = imgHTML.eq(i).attr("src");

        var img = new Image();
        var difference = 0;

        img.src = url;
        img.onload = function() {
          difference = this.width - this.height;

          if (difference > 300) {
            var e = i - 1;
            // console.log("i: " + e + " html: " + imgHTML.eq(e).attr("src"));
            imgHTML.eq(e).closest(".rep_prub").addClass("adjust-panoramic");
            $('.rep_prub').addClass('width-height-7')
                          .removeClass('width-height-1 width-height-2 width-height-3 width-height-5');
          }
        }
      }
    }

    componentDidMount() {
      this.reloadimageJPG();

    }

    reloadimageJPG = () => {
      var count = 0;
      var imgTag = $(".video_streamJPG");
      var d = new Date();

      setInterval(function(){

        if (count === 5) {
          for (var i = 0; i < imgTag.length; i++) {
            var url = imgTag.eq(i).attr("src");
            url = url.slice( 0, url.indexOf('?') );
            imgTag.eq(i).attr("src", url);
          }
          count = 0
        }
        else {
          for (var i = 0; i < imgTag.length; i++) {
            var url = imgTag.eq(i).attr("src");
            imgTag.eq(i).attr("src", url + "?" + d.getTime());
          }
          count += 1;
        }

      }, 60000);
    }


  render(){
    return (
      <Consumer>
      { context => {

        function sortJSON(data, key, orden) {
          return data.sort(function (a, b) {
              var x = a[key],
              y = b[key];

              if (orden === 'asc') {
                  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
              }

              if (orden === 'desc') {
                  return ((x > y) ? -1 : ((x < y) ? 1 : 0));
              }
          });
        }

        let videos;
        const result = context.idCam; //we save the data in the result variable
        // const resultStatic = context.staticIdCam;
        // const result = this.state.mapTestId;

        sortJSON(result, 'order', 'asc');


        if (result === undefined){

          videos = <ConnectionError />;

        }else{

          if (result.length > 0) { // if the results found are greater than 0 the images are displayed
            videos = result.map(video =>
               <Videos
                key                = { video.id }
                name               = { video }
                warningDelete      = { this.warningDelete }
                closeWaringDelete  = { this.closeWarningDelete }
                showMenuItems      = { this.showMenuItems }
                coverCamera        = { this.coverCamera }
                showMoreInfo       = { this.showMoreInfo }
                reloadimage        = { this.reloadimageJPG }
                adjustPanoramic    = { this.adjustPanoramic }
                />
            );

          }
          else  { // if not, the component <NotFound> is displayed
            videos = <div>
                      <img className="loading connection_error" src={ noCameaSrc } alt="No Camera Available" />
                      <span className="message_connection_error">No cameras available</span>
                    </div>;
          }
        }

        return(
          <div className="container-cameras-box">
            <div className="rep_prub_cont overflow_scroll">
            <div onClick={() => {this.closeWarningDelete()}} className="block-area-for-warning-delete"></div>

            { (context.connectionError) ? <ConnectionError /> :
              (context.apiRestConnectioError) ? <p><img className="loading connection_error" src={ apiNotResponding } alt="loading"/><span className="message_connection_error api_error">APi REST server is not responding...</span></p> :
              (context.loading) ? <img className="loading connection_error" src={ loadingSrc } alt="loading"/> : videos }

            </div>
          </div>
        );
      }}
      </Consumer>
    );
  }
}


export default ContainerVideo;
