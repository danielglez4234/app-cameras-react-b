import * as $ from 'jquery';


const regex = {
  id:                  /^[A-Za-zÀ-ú0-9]{3,50}$/, //only letters, no spaces, 3 to 50 character, no special characters and no numbers allowed
  name:                /^[A-Za-zÀ-ú0-9\s]{3,80}$/, //letters and numbers with spaces, 3 to 40 characters and no special characters allowed
  group:               /^[A-Za-z0-9]{3,100}$/, //letters and numbers, 3 to 20 characters and no special characters allowed
  url:                 /(rtsp:\/\/|https?:\/\/(www\.)?)[-a-zA-Z0-9@:%._\\+~#=]{1,256}[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.\/~#?&=]*)/, // In short, it only allows a valid format starting with https:// or http:// and the follow characters (except for invalid characters in a url like ''"" or !¡?¿)
  detectCrendentials:  /[@]/, // if the url have an "@" it means that have credentials set on the url itself
  user:                /^[A-Za-z0-9\s]{3,100}$/, //letters and numbers, 3 to 50 characters and no special characters allowed and no accents
  pwd:                 /.{3,256}$/, // at least 3 character
  description:         /.{3,400}$/ // matches any character except lines breaks and 3 to 400 characters
}
// -----------------------
setTimeout(function(){




// --------------------------------------------- ERROR HTML Messages -------------------------------------------------------------------------------------

var $errorIdCamera              = $('<div class="contein_error_message contein_error_message-id margin-top-15px"><div class="error_message">Length range from 3 to 50, no spaces and scpecial characters.</div></div>');
var $errorIdCameraEmpty         = $('<div class="contein_error_message contein_error_message-id margin-top-15px"><div class="error_message">The ID field cannot be empty!.</div></div>');

  $('.idCamera2').after($errorIdCamera);
  $('#idCamera').after($errorIdCameraEmpty)
                .after($errorIdCamera);
  $($errorIdCamera).hide();
  $($errorIdCameraEmpty).hide();


// const $error = $('<div class="contein_error_message"><div class="error_message">The Email field cannot be Empty</div></div>');
var $errorName                  = $('<div class="contein_error_message margin-top-15px"><div class="error_message">Length range from 3 to 40, no special character allowed.</div></div>');
var $errorNameEmpty             = $('<div class="contein_error_message margin-top-15px"><div class="error_message">The Name field cannot be empty!.</div></div>');
$('#nameCamera').after($errorName)
                .after($errorNameEmpty);;
$($errorName).hide();
$($errorNameEmpty).hide();


var $errorGroup                 = $('<div class="contein_error_message"><div class="error_message-group">You have to check at least one Group.</div></div>');
$('#groupCamera').after($errorGroup);
$($errorGroup).hide();

var $errorUrl                   = $('<div class="contein_error_message margin-top-15px"><div class="error_message">Please provide a valid URL. example: http://..., https://... or rtsp://</div></div>');
var $errorUrlEmpty              = $('<div class="contein_error_message margin-top-15px"><div class="error_message">The URL field cannot be empty!.</div></div>');
var $errorCheckCredentialsInUrl = $('<div class="contein_error_message margin-top-15px"><div class="error_message">A "@" has been detected, this may mean that you have put a username and password in the URL, if the url requires credentials please activate the credentials field.</div></div>');
$('#urlCamera').after($errorCheckCredentialsInUrl)
               .after($errorUrl)
               .after($errorUrlEmpty);
$($errorUrl).hide();
$($errorUrlEmpty).hide();
$($errorCheckCredentialsInUrl).hide();


var $errorUserEmpty             = $('<div class="contein_error_message error-user contein_error_message-user"><div class="error_message-group">The User field cannot be empty!.</div></div>');
var $errorUser                  = $('<div class="contein_error_message error-user contein_error_message-user"><div class="error_message-group error_message-desc">The User cannot contain less than 3 to 50 characters and any special character</div></div>');
$('#userCamera').after($errorUser)
                .after($errorUserEmpty);
$($errorUser).hide();
$($errorUserEmpty).hide();


var $errorPwd                   = $('<div class="contein_error_message error-password"><div class="error_message">Minimum length of 3.</div></div>');
var $errorConfirmPwd            = $('<div class="contein_error_message error-confirm-password"><div class="error_message ">The passwords don\'t match</div></div>');
$('#pwdCamera').after($errorPwd);
$('#confirmPwdCamera').after($errorConfirmPwd);
$($errorPwd).hide();
$($errorConfirmPwd).hide();

var $errorDescription           = $('<div class="contein_error_message-description"><div class="error_message-group error_message-desc">The Description field cannot be Empty! provide at least a short description.</div></div>');
var $errorDescriptionEmpty      = $('<div class="contein_error_message-description"><div class="error_message-group error_message-desc">The Description field cannot be Empty! provide at least a short description.</div></div>');
$('#descriptionCamera').after($errorDescription)
                       .after($errorDescriptionEmpty);
$($errorDescription).hide();
$($errorDescriptionEmpty).hide();


var $submitError                = $('<div class="error_message_submit">An error has occurred, check that all fields are correctly filled.</div>');
$($submitError).hide();




// --------------------------------------------- END OF ERROR HTML Messages -------------------------------------------------------------------------------------



$('#pwdCamera').on('keyup', function(event) {

  const confirmPwd           = event.target.value;
  var pwd                    = $('#pwdCamera').val();
  var actualValueconfirmPwd  = $('#confirmPwdCamera').val();
  $($errorPwd).hide();
if (pwd === "" && confirmPwd === "") {

  $('#pwdCamera').removeClass('confirmed-green confirmed-red');
  $('#confirmPwdCamera').removeClass('confirmed-green confirmed-red');
}
else if (actualValueconfirmPwd && pwd !== actualValueconfirmPwd) {

  $('#pwdCamera').addClass('confirmed-red').removeClass('confirmed-green');
  $('#confirmPwdCamera').addClass('confirmed-red').removeClass('confirmed-green');
}
else if (actualValueconfirmPwd === pwd) {

   $('#pwdCamera').addClass('confirmed-green').removeClass('confirmed-red');
   $('#confirmPwdCamera').addClass('confirmed-green').removeClass('confirmed-red');
}
});

$('#confirmPwdCamera').on('keyup', function(event) { //choose a color and the select appears with the colors of that design

const confirmPwd     = event.target.value;
var pwd              = $('#pwdCamera').val();

    if (pwd === "" && confirmPwd === "") {

      $('#pwdCamera').removeClass('confirmed-green confirmed-red');
      $('#confirmPwdCamera').removeClass('confirmed-green confirmed-red');
    }
    else if (pwd === "" && confirmPwd) {

      $('#pwdCamera').addClass('confirmed-red').removeClass('confirmed-green');
      $('#confirmPwdCamera').addClass('confirmed-red').removeClass('confirmed-green');
    }
   else if (confirmPwd === pwd || pwd === confirmPwd) {

      $('#pwdCamera').addClass('confirmed-green').removeClass('confirmed-red');
      $('#confirmPwdCamera').addClass('confirmed-green').removeClass('confirmed-red');
        $($errorConfirmPwd).hide();
    }else {

      $('#pwdCamera').addClass('confirmed-red').removeClass('confirmed-green');
      $('#confirmPwdCamera').addClass('confirmed-red').removeClass('confirmed-green');
    }
});

$('#idCamera').on('input', function(){
  const nameText     = $('#idCamera').val();
  const nameInput    = $('#idCamera');
  const errorText    = $errorIdCamera;
  const errorEmpty   = $errorIdCameraEmpty;

  validate(nameText, regex.id, nameInput, errorText, errorEmpty);
});

$('#nameCamera').on('input', function(){
  const nameText     = $('#nameCamera').val();
  const nameInput    = $('#nameCamera');
  const errorText    = $errorName;
  const errorEmpty   = $errorNameEmpty;

  validate(nameText, regex.name, nameInput, errorText, errorEmpty);
});

$(".mutliSelect ul li input").on('click', function(){
  var nameInput = $(".mutliSelect ul li input");
  validateGroup(nameInput);
});

$('#urlCamera').on('input', function(){
  const nameText     = $('#urlCamera').val();
  const nameInput    = $('#urlCamera');
  const errorText    = $errorUrl;
  const errorEmpty   = $errorUrlEmpty;
  const errorTextForCredentials = $errorCheckCredentialsInUrl;

  validateURL(nameText, regex.url, regex.detectCrendentials, nameInput, errorText, errorTextForCredentials, errorEmpty);
});

$('#descriptionCamera').on('input', function(){
  const nameText     = $('#descriptionCamera-textarea').val();
  const nameInput    = $('#descriptionCamera');
  const errorText    = $errorDescription;
  const errorEmpty   = $errorDescriptionEmpty;

  validate(nameText, regex.description, nameInput, errorText, errorEmpty);
});

$('#userCamera').on('input', function(){
  const nameText     = $('#userCamera').val();
  const nameInput    = $('#userCamera');
  const errorText    = $errorUser;
  const errorEmpty   = $errorUserEmpty;

  validate(nameText, regex.user, nameInput, errorText, errorEmpty);
});
// ----------------------------------------------------------------------------------------------------------------------------------



function validate(validateText, regexType, inputId_Name, errortext, errorEmpty){
  const testingField = regexType.test(validateText);
  if (!testingField) { //if it doesn't match
    $(errortext).fadeIn(1);
    $(errorEmpty).fadeOut(1);
  }else {
    $(errortext).fadeOut(1);
    $(errorEmpty).fadeOut(1);
  }
  if(validateText === ''){ // if the email input in empty
    $(errorEmpty).fadeIn(1);
    $(errortext).fadeOut(1);
  }
  return testingField; //is returned for use when the 'register' button is pressed
}


function validateGroup(inputsName){
var testingField;
    if ($(inputsName).is(':checked')) { // it only need one of them to be checked to return true  // that means this field cannot be empty
      $($errorGroup).hide();
      testingField = true;
      return testingField;
    }else {

      testingField = false;
      return testingField;
    }
}

function validateURL(validateText, regexURL, regexCredentials, inputId_Name, errortext, errorTextForCredentials, errorEmpty){

  var testingFieldURL          = regexURL.test(validateText);
  var testingFieldCredentials  = regexCredentials.test(validateText);

  if (!testingFieldURL) { //if it doesn't match
    $(errortext).fadeIn(1);
    $(errorEmpty).fadeOut(1);
  }
  else if (testingFieldCredentials) {
    errorTextForCredentials.fadeIn(1);
    errortext.hide();
    errorEmpty.hide();
    const detected = false;
    return detected;
  }
  else {
    errortext.hide();
    errorEmpty.hide();
    errorTextForCredentials.hide();

    return testingFieldURL;
  }

  if(validateText === ''){ // if the email input in empty
    errorEmpty.fadeIn(1);
    errortext.hide();
    errorTextForCredentials.hide();
  }

}


//------------------------------------------------------------------------------------------------------------------



$('.formCameras').on('submit', function(event){
  //we call and save the functions to check if they give the value true or false
  var $noErrorEmpty = $('doesnt-exists');
  var validIdCamera        = validate($('#idCamera').val(), regex.id, $('#idCamera'), $errorIdCamera, $noErrorEmpty);
  var validName            = validate($('#nameCamera').val(), regex.name, $('#nameCamera'), $errorName, $noErrorEmpty);
  var validDescription     = validate($('#descriptionCamera-textarea').val(), regex.description, $('#descriptionCamera'), $errorDescription, $noErrorEmpty);

  var validGroup           = validateGroup($(".mutliSelect ul li input"));

  var validUrl             = validateURL($('#urlCamera').val(), regex.url, regex.detectCrendentials, $('#urlCamera'), $noErrorEmpty, $noErrorEmpty, $noErrorEmpty);

  var validUser            = true;
  var validPwd             = true;
  var credentialsCheck     = $('#checkCreandentials:checkbox:checked');

  if (credentialsCheck.length > 0) {
    validUser              = validate($('#userCamera').val(), regex.user, $('#userCamera'), $errorPwd);
    validPwd               = validate($('#pwdCamera').val(), regex.pwd, $('#pwdCamera'), $errorConfirmPwd);
  }


  //if at least one returns 'false' the form is not sent
  console.log(validName +' '+ validIdCamera +' '+ validUrl +' '+ validGroup +' '+ validDescription +' '+ validUser +' '+ validPwd );
  if (!validIdCamera || !validName || !validUrl || !validGroup || !validDescription || !validUser || !validPwd){
    event.preventDefault();

    $('#title_container').after($submitError);
    $submitError.fadeIn(300);

    if (credentialsCheck.length > 0) { // if credentials is check validate user an password
      if (!validUser) {
        $errorUser.fadeIn(1);
        $errorUserEmpty.hide();
      }else{
        $errorUser.hide();
      }

      if ($('#checkChangePassword:checkbox:checked').length === 1) {

        if (!validPwd) {
          $errorPwd.fadeIn(1);

        }else{ $errorPwd.hide(); }

        const macthPwd        = $('#pwdCamera').val();
        const macthConfirmPwd = $('#confirmPwdCamera').val();

          if (macthPwd !== macthConfirmPwd) {
            $errorConfirmPwd.fadeIn(1);

          }else{ $errorConfirmPwd.hide() }

      }

      if (!$('#cred').hasClass('credentials-update-section')) {

        if (!validPwd) {
          $errorPwd.fadeIn(1);

        }else{ $errorPwd.hide(); }

        const macthPwd        = $('#pwdCamera').val();
        const macthConfirmPwd = $('#confirmPwdCamera').val();

          if (macthPwd !== macthConfirmPwd) {
            $errorConfirmPwd.fadeIn(1);

          }else{ $errorConfirmPwd.hide(); }
      }

    }


    if (!validIdCamera) {
      $errorIdCamera.fadeIn(1);
      $errorIdCameraEmpty.hide();

    }else{ $errorIdCamera.hide(); $errorIdCameraEmpty.hide(); }


    if (!validName) {
      $errorName.fadeIn(1);
      $errorNameEmpty.hide();

    }else{ $errorName.hide(); $errorNameEmpty.hide(); }


    if (!validGroup) {
      $errorGroup.fadeIn(1)
    }else{ $errorGroup.hide() }


    if (!validUrl) {
      $errorUrl.fadeIn(1);

    }else{ $errorCheckCredentialsInUrl.hide(); $errorUrl.hide(); $errorUrlEmpty.hide();}



    if (!validDescription) {
      $errorDescription.fadeIn(1);
      $errorDescriptionEmpty.hide();

    }else{ $errorDescription.hide(); $errorDescriptionEmpty.hide(); }

  }

});






//------------------------------------------------------------------------------------------------------------------









}, 100);
