$(document).ready(function () {
  const amenities = {};
  const states = {};
  const cities = {};

  function setAmenities (dataId, dataName) {
    amenities[dataId] = dataName;
  }

  function delAmenity (dataId) {
    delete amenities[dataId];
  }

  function setStates (dataId, dataName) {
    states[dataId] = dataName;
  }

  function delStates (dataId) {
    delete states[dataId];
  }

  function setCities (dataId, dataName) {
    cities[dataId] = dataName;
  }

  function delCities (dataId) {
    delete cities[dataId];
  }

  function placeTemplate (place) {
    const guest = (place.max_guest !== 1) ? 'Guests' : 'Guest';
    const bedroom = (place.number_rooms !== 1) ? 'Bedrooms' : 'Bedroom';
    const bathroom = (place.number_bathrooms !== 1) ? 'Bathrooms' : 'Bathroom';
    const description = (place.description === null) ? '' : place.description;
    return (
      `<article>
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">${place.price_by_night}</div>
      </div>
      <div class="information">
        <div class="max_guest">${place.max_guest} ${guest}</div>
        <div class="number_rooms">${place.number_rooms} ${bedroom}</div>
        <div class="number_bathrooms">${place.number_bathrooms}
          ${bathroom}</div>
      </div>
      <div class="description">
        ${description}
      </div>
    </article>`
    );
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

  $('.locations .popover ul li input').on('click', function () {
    let dataId, dataName;
    if ($(this).prop('checked') === true) {
      dataId = $(this).attr('data-id');
      dataName = $(this).attr('data-name');
      if ($(this).parent().parent().get(0).tagName === 'H2') {
        setStates(dataId, dataName);
      } else {
        setCities(dataId, dataName);
      }
    } else {
      dataId = $(this).attr('data-id');
      if ($(this).parent().parent().get(0).tagName === 'H2') {
        delStates(dataId, dataName);
      } else {
        delCities(dataId, dataName);
      }
    }
    $('.locations h4').text($.map({ ...states, ...cities }, (val) => val).join(', '));
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus, jqXHR) {
    if (jqXHR.status === 200 && data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
      $('DIV#api_status').css({ 'background-color': '#cccccc' });
    }
  });

  function placeSearch (filters) {
    let html = '';
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      dataType: 'json',
      success: function (data) {
        $.each(data, (index, value) => { html += placeTemplate(value); });
        $('SECTION.places').html(html);
      }
    });
  }

  $('.filters button').on('click', function () {
    const amenitiesIds = $.map(amenities, (val, index) => index);
    const statesIds = $.map(states, (val, index) => index);
    const citiesIds = $.map(cities, (val, index) => index);
    const filtersSend = { amenities: amenitiesIds, states: statesIds, cities: citiesIds };
    placeSearch(filtersSend);
  });

  function main () {
    placeSearch({});
  }
  main();
});
