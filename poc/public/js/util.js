var submitButton = $('#submit'),
    searchField = $('#search');
$(searchField).on('keyup', function(event) {
    if (event.keyCode === 13) {
        $(submitButton).click();
    }
})
