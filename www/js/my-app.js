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

      value: [Math.floor(timeThreshold / 60), (timeThreshold % 60 < 10? '0' + timeThreshold % 60: timeThreshold % 60)],

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

      onChange: function(p, values, displayValues){ // TODO make sure this is correct
        timeThreshold = parseInt(values[0]) * 60 + parseInt(values[1]);
      }
  });
})

// TODO Ajax GET to update temp + time values
function refresh() {
  alert('refresh()');
  $$('#currentTemperature').html(tempThreshold);


  $$.ajax({
      url: "0.0.0.0:3000/refresh", // TODO insert pi IP
      contentType: "OPTIONS",
      dataType : 'json',
      crossDomain: true,
      data: {
          q: "getValues",
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
          alert( response ); // TODO read response and handle values
      },
      error: function( xhr, textStatus, thrownError ) {
        alert(thrownError);
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
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
          alert( response ); // TODO read response and handle values
      },
      error: function( xhr, textStatus, thrownError ) {
        alert(thrownError);
      }
  });
}

function adjustTempThreshold(adjustment) {
  alert('adjustTempThreshold(' + adjustment + ')');
  tempThreshold += adjustment;
}

// TODO Ajax POST to change thresholds
function applySettings() {
  alert('applySettings()');

  $$.ajax({
      url: "0.0.0.0:3000/apply", // TODO insert pi IP
      contentType: "OPTIONS",
      dataType : 'json',
      crossDomain: true,
      data: {
          q: 'tempThreshold='+tempThreshold+'&timeThreshold=', // TODO fix this
          format: "json",
          callback:function(){
             return true;
          }
      },
      success: function( response ) {
          alert( response ); // TODO read response and handle values
      },
      error: function( xhr, textStatus, thrownError ) {
        alert(thrownError);
      }
  });
}
