// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var tempThreshold = 30; // degrees C
var timeThreshold = 60; // minutes

var savedTempThreshold = 30;
var savedTimeThreshold = 60;

var toggleButtonState = 0;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    //setInterval(refresh(), 3000);
});

// Using page callback for page:
myApp.onPageInit('settings', function (page) {
  // Set threshold value initially
  $$('#temperatureThreshold').text(tempThreshold.toString() + '° C');

  // Add threshold inc/dec handlers
  $$('#incTempThreshold').on('click', function(){
    tempThreshold++;
    $$('#temperatureThreshold').text(tempThreshold.toString() + '° C');
  });
  $$('#decTempThreshold').on('click', function(){
    tempThreshold--;
    $$('#temperatureThreshold').text(tempThreshold.toString() + '° C');
  });

  var today = new Date();

  var pickerInline = myApp.picker({
      input: '#movementThreshold',
      container: '#picker-date-container',
      toolbar: false,
      rotateEffect: true,

      value: [Math.floor(savedTimeThreshold / 60), (savedTimeThreshold % 60 < 10? '0' + savedTimeThreshold % 60: savedTimeThreshold % 60)],

      formatValue: function (p, values) {
          return values[0] + ' hours ' + values[1] + ' minutes';
      },

      cols: [
          // Hours
          {
              values: (function () {
                  var arr = [];
                  for (var i = 0; i <= 12; i++) { arr.push(i); }
                  return arr;
              })(),
          },
          // Divider
          {
              divider: true,
              content: ':'
          },
          // Minutes
          {
              values: (function () {
                  var arr = [];
                  for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                  return arr;
              })(),
          }
      ],

      onChange: function(p, values, displayValues){
        timeThreshold = parseInt(values[0]) * 60 + parseInt(values[1]);
      }
  });
})

// TODO Ajax GET to update temp + time values
function refresh() {
  $$.ajax({
      url: "http://134.87.154.181:8997/refresh", // TODO insert pi IP
      contentType: "OPTIONS",
      dataType : 'jsonp',
      crossDomain: true,
      data: {
          q: "refresh",
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
          var jsonResponse = JSON.parse(response);
          alert(jsonResponse.temperature + ', ' + jsonResponse.timeSinceLastMovement);

          // TODO make vars to store these?
          $$('#currentTemperature').text(jsonResponse.temperature);
          $$('#timeSinceLastMovement').text(jsonResponse.timeSinceLastMovement);
          // TODO check that this works
      },
      error: function( xhr, textStatus, thrownError ) {
          alert('error');
      }
  });
}

// TODO Ajax GET/POST to enable/disable the stove. May want to have 2 functions.
function toggleStove() {
  alert('toggleStove()');

  $$.ajax({
      url: "0.0.0.0:3000/toggle", // TODO insert pi IP
      contentType: "OPTIONS",
      dataType : 'json',
      crossDomain: true,
      data: {
          q:"toggle",
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
          alert( response ); // TODO read response and handle values
          if(toggleButtonState == 0) {
            $$('#toggleButtonContainer').html('<p><a href="#" class="button button-big button-fill color-green" onclick="toggleStove()">Enable Stove</a></p>');
            toggleButtonState = 1;
          } else {
            $$('#toggleButtonContainer').html('<p><a href="#" class="button button-big button-fill color-red" onclick="toggleStove()">Disable Stove</a></p>');
            toggleButtonState = 0;
          }
      },
      error: function( xhr, textStatus, thrownError ) {
        alert(thrownError);
      }
  });
}

// TODO Ajax POST to change thresholds
function applySettings() {
  alert('applySettings()');

  savedTempThreshold = tempThreshold;
  savedTimeThreshold = timeThreshold;

  // TODO make this work with cole's stuff - should change thresholds on the pi
  /*$$.ajax({
      url: "0.0.0.0:3000/apply", // TODO insert pi IP
      contentType: "OPTIONS",
      dataType : 'json',
      crossDomain: true,
      data: {
          q: 'tempThreshold='+tempThreshold, // TODO formatting?
          w: 'timeThreshold='+timeThreshold,
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
          alert( response );
      },
      error: function( xhr, textStatus, thrownError ) {
        alert(thrownError);
      }
  });*/
}
