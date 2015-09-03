$(document).ready(function(){
	var markers = [];
	var infowindow;
	
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
					
					for (var i = 0; i < markers.length; i++) {
						markers[i].setMap(null);
					}
					
					markers = [];
					
					for (var i=0; i<10; i++ ) {
						
						markers.push(new google.maps.Marker({
							position: {
								lat: response.results[i].Latitude, 
								lng: response.results[i].Longitude
								},
							map: Map,
							title: response.results[i].StoreName
						}));
						
						infowindow = new google.maps.InfoWindow();
					  
						markers[markers.length - 1].addListener('click', function(){
							showInfo(this);
						});

						markers[markers.length - 1].html = 
							'<h2>' + response.results[i].StoreName + '</h2>' +
							'<p>' + response.results[i].AddressLine1 + '</p>' +
							'<p>' + response.results[i].AddressLine2 + '</p>';
						markers[markers.length - 1].setMap(Map);
						
						bounds.extend (new google.maps.LatLng (response.results[i].Latitude, response.results[i].Longitude));
					}

					Map.fitBounds (bounds);
					
					document.getElementById('map').style.visibility = 'visible'; 
					$('#results').html(Stencil.render($('#tpl').html(), response));
					$('#results h2').click(function(){
						showInfo(markers[$('#results h2').index($(this))]);
					});
					
					showInfo(markers[0]);
				}
			}
		});
	}
	
	
	function showInfo (marker) {
		infowindow.setContent(marker.html);
		infowindow.open(Map, marker);
	}
});