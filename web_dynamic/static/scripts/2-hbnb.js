$(document).ready(function () {
  const amenities = {};

  function setAmenities (dataId, dataName) {
    amenities[dataId] = dataName;
  }

  function delAmenity (dataId) {
    delete amenities[dataId];
  }

  $('.amenities .popover ul li input').on('click', function () {
    let dataId, dataName;
    if ($(this).prop('checked') === true) {
      dataId = $(this).attr('data-id');
      dataName = $(this).attr('data-name');
      setAmenities(dataId, dataName);
    } else {
      dataId = $(this).attr('data-id');
      delAmenity(dataId);
    }
    $('.amenities h4').text($.map(amenities, (val) => val).join(', '));
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus, jqXHR) {
    if (jqXHR.status === 200 && data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
      $('DIV#api_status').css({ 'background-color': '#cccccc' });
    }
  });
});
