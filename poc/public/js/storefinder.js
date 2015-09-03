$(document).ready(function(){
	
	$('#submit').click(function(){
		geocode($('#search').val());
	});
	
	function geocode(search) {
		Geocoder.geocode({'address': search}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				searchStores ([results[0].geometry.location.lat(), results[0].geometry.location.lng()])
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	}

	function searchStores (location) {
		var bounds = new google.maps.LatLngBounds (),
			locationList = [];
			
		$.getJSON('/api/searchStores?location=' + location.join(','), function(response) {
			
			if (response.success) {
				if (response.results.length) {
					
					var infowindow = [];
					  
					var markers = [];
					
					for (var i=0; i<10; i++ ) {
						
						markers.push(new google.maps.Marker({
							position: {
								lat: response.results[i].Latitude, 
								lng: response.results[i].Longitude
								},
							map: Map,
							title: response.results[i].StoreName
						}));
						
						infowindow.push(new google.maps.InfoWindow({
							content: '<h2>' + response.results[i].StoreName + '</h2>'
						}));
					  
						markers[markers.length - 1].addListener('click', function() {
							infowindow[infowindow.length - 1].setContent(this.html);
							infowindow[infowindow.length - 1].open(Map, this);
						});

						markers[markers.length - 1].html = '<h2>' + response.results[i].StoreName + '</h2>';
						markers[markers.length - 1].setMap(Map);
						
						bounds.extend (new google.maps.LatLng (response.results[i].Latitude, response.results[i].Longitude));
					}

					Map.fitBounds (bounds);
					
					// template
					$('#results').html(Stencil.render($('#tpl').html(), response));
				}
			}
		});
	}
});