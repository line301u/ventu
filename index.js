// This will run when page is ready.
$(function() {
	// Jquery time picker settings
	$('.timepicker').timepicker({
		timeFormat: 'HH:mm',
		interval: 5,
		minTime: '05',
		maxTime: '23:55',
		defaultTime: false,
		startTime: '05:00',
		dynamic: false,
		dropdown: true,
		scrollbar: true
	}); 

	// Convert time into to timestamp
	function convertToTimestamp(time) {
		const todaysDate = new Date();

		let timestamp = new Date((todaysDate.getMonth() + 1) + "/" + todaysDate.getDate() + "/" + todaysDate.getFullYear() + " " + time);
		timestamp = timestamp.getTime();

		return timestamp
	}

	// Validate format of inputs
    function validateInput(value) {
		if (!value) {
			return {
				'isValid': false,
				'message':'Dette felt skal udfyldes'
			}
		}

        const timeFormat = new RegExp('([01]?[0-9]|2[0-3]):[0-5][0-9]');
		if (!timeFormat.test(value)) {
			return {
				'isValid': false,
				'message':'Den instastede tid skal være i formatet TT:mm'
			}
        }

		return {'isValid': true}
    }

	// Validate form on submit
	$( "#timeregistration_edit_form" ).on( "submit", function( event ) {
		event.preventDefault();

		let isValid = true
		
		$('#timeregistration_edit_form input[type!="submit"]').each(function() {
			// Clear error messages
			const errorMessageElement = ($(this).closest('.input_wrapper')).children('.error_message')
			errorMessageElement.text('')
			$( $(this) ).on( "mouseup", function() {
				errorMessageElement.text('')
			} );

			// Validate input format
			const validationResult = validateInput($(this).val());
			if (!validationResult.isValid){
				errorMessageElement.text(validationResult.message)
				isValid = false
				return
			}
		});
		
		if (!isValid) {return false}

		// Validate time interval of inputs
		const worktime_start = convertToTimestamp($('#worktime_start').val())
		const worktime_end = convertToTimestamp($('#worktime_end').val())
		const lunchbreak_start = convertToTimestamp($('#lunchbreak_start').val())
		const lunchbreak_end = convertToTimestamp($('#lunchbreak_end').val())

		if (worktime_start > worktime_end){
			($('#worktime_start').closest('.input_wrapper').children('.error_message')).text('Starttidspunktet skal falde før sluttidspunktet')
		}

		if (lunchbreak_start > lunchbreak_end){
			($('#lunchbreak_start').closest('.input_wrapper').children('.error_message')).text('Starttidspunktet skal falde før sluttidspunktet')
		}

		if ((lunchbreak_start < worktime_start) || (lunchbreak_end > worktime_end)){
			($('#lunchbreak_start').closest('.input_wrapper').children('.error_message')).text('Frokostpausen skal falde indenfor arbejdstiden')
		}

		return true;
	});
});