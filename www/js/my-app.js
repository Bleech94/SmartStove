// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var piIP = "http://134.87.157.128:8987";

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var tempThreshold = 30; // degrees C
var timeThreshold = 300; // seconds

var savedTempThreshold = 30;
var savedTimeThreshold = 300;

var toggleButtonState = 0;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

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

      value: [(Math.floor(savedTimeThreshold / 60) < 10? '0' + Math.floor(savedTimeThreshold / 60) : Math.floor(savedTimeThreshold / 60)),
      (Math.floor(savedTimeThreshold % 60) < 10? '0' + Math.floor(savedTimeThreshold % 60): Math.floor(savedTimeThreshold % 60))],

      formatValue: function (p, values) {
          return values[0] + ' minutes ' + values[1] + ' seconds';
      },

      cols: [
          // Minutes
          {
              values: (function () {
                  var arr = [];
                  for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                  return arr;
              })(),
          },
          // Divider
          {
              divider: true,
              content: ':'
          },
          // Seconds
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

// Ajax GET to update temp + time values
function refresh() {
  $$.ajax({
      url: piIP + "/refresh",
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

          var temp = Math.round(jsonResponse.temperature * 10) / 10;

          var timeInt = Math.round(jsonResponse.timeSinceLastMovement);

          var timeMinutes = Math.floor(timeInt / 60);
          var timeSeconds = Math.floor(timeInt % 60);

          $$('#currentTemperature').text(temp + '° C');
          $$('#timeSinceLastMovement').text((timeMinutes < 10? '0' + timeMinutes : timeMinutes) + ":" + (timeSeconds < 10? '0' + timeSeconds : timeSeconds));
      },
      error: function( xhr, textStatus, thrownError ) {
          alert('error');
      }
  });
}

// Ajax GET/POST to enable/disable the stove. May want to have 2 functions.
function toggleStove() {
  $$.ajax({
      url: piIP + "/toggle",
      contentType: "OPTIONS",
      dataType : 'jsonp',
      crossDomain: true,
      data: {
          q:"toggle",
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
          if(toggleButtonState == 0) {
            $$('#toggleButtonContainer').html('<p><a href="#" class="button button-big button-fill color-green" onclick="toggleStove()">Enable Stove</a></p>');
            toggleButtonState = 1;
          } else {
            $$('#toggleButtonContainer').html('<p><a href="#" class="button button-big button-fill color-red" onclick="toggleStove()">Disable Stove</a></p>');
            toggleButtonState = 0;
          }
      },
      error: function( xhr, textStatus, thrownError ) {
        alert('error');
      }
  });
}

// Ajax POST to change thresholds
function applySettings() {
  savedTempThreshold = tempThreshold;
  savedTimeThreshold = timeThreshold;

  $$.ajax({
      url: piIP + "/update",
      contentType: "OPTIONS",
      dataType : 'jsonp',
      crossDomain: true,
      data: {
          q: tempThreshold,
          w: timeThreshold,
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
        alert('Settings updated.')
      },
      error: function( xhr, textStatus, thrownError ) {
        alert('error');
      }
  });
}
