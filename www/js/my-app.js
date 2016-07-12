// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var tempThreshold = 30;
var hours = 1;
var minutes = '00'

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

      value: [hours, minutes],

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
      ]
  });
})

// TODO Ajax GET to update temp + time values
function refresh() {
  alert('refresh()');
  $$('#currentTemperature').html('69');


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
}

function adjustTempThreshold(adjustment) {
  alert('adjustTempThreshold(' + adjustment + ')');
  tempThreshold += adjustment;

  $$.ajax({
      url: "0.0.0.0:3000/toggle", // TODO insert pi IP
      contentType: "OPTIONS",
      dataType : 'json',
      crossDomain: true,
      data: {
          q: "getThresholds",
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

// TODO Ajax POST to change thresholds
function applySettings() {
  alert('applySettings()');

  $$.ajax({
      url: "0.0.0.0:3000/apply", // TODO insert pi IP
      contentType: "OPTIONS",
      dataType : 'json',
      crossDomain: true,
      data: {
          q: "temperatureThreshold=" + tempThreshold + "&timeThreshold=" + ,
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
