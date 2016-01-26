var url = "http://localhost:8080/";
var socket = io.connect(url);

$(document).ready(function() {
	$('#adjective').on('input',function() {
		if ($('#adjective').val() != "") {
			if ($('#full_name').val() != "") {
				var desc = $('#full_name').val() + " is " + $('#adjective').val() + "." 
				$('#description').text(desc);
			}
		}
	});
	
	$('#full_name').on('input',function() {
		if ($('#full_name').val() != "") {
			if ($('#adjective').val() != "") {
				var desc = "<p>" + $('#full_name').val() + " is " + $('#adjective').val() + ".</p>" 
				$('#description').text(desc);
			}
		}
	});
	
	$('form').submit(function() {
		var data = {
			"name":$('#full_name').val(),
			"adjective":$('#adjective').val()
		};
		socket.emit('submit', data);
	});
	
	$('#retrieve').click(function() {
		socket.emit('retrieve');
	});
	
	socket.on('data_retrieved', function (result) {
		$('#results').text("");
		for (key in result) {
			var entry = result[key];
			$('#results').append('<p>' + entry["name"] + " is " + entry["adjective"] + ".</p>");
		}
	});
});