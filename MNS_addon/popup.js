(function() {
    function bindEvents() {
        document.getElementById('search').addEventListener('click', getData);
        document.getElementById('global-search').addEventListener('keyup', keyCode);
        var categoryLink = document.querySelectorAll('#category a');
        for (var i = 0; i < categoryLink.length; i++) {
            categoryLink[i].addEventListener('click', redirect)
        }
    }
    bindEvents();

    function getData(event) {
        var selectedEnv = document.getElementsByTagName('select')[0].value.toUpperCase();
    
        switch (selectedEnv) {
            case "PROD":
                postUrl = 'http://www.marksandspencer.com/MSSearchResultsDisplayCmd?';
                break;
            case "QA2":
                postUrl = "http://www.qa2.mnsplatform.com/MSFindItemsByKeyword?";
                break;
            case "ClOUD-2":
                postUrl = "http://cloud.qa2.devops.mnscorp.net/MSSearchResultsDisplayCmd?";
                break;
            case "SIT-2":
                postUrl = "http://www.sit2.marksandspencer.com/MSFindItemsByKeyword?";
                break;
            case "QA-3":
                postUrl = "http://www.qa3.mnsplatform.com/MSSearchResultsDisplayCmd?";
                break;
        }

        var postUrl = postUrl + 'searchTerm=' + document.getElementById('global-search').value + '&langId=-24&storeId=10151&catalogId=10051&categoryId=0&typeAhead=';
        window.location.href = postUrl;
        window.open(postUrl);
    }

    function keyCode(event) {
        if (event.keyCode == 13) {
            getData();
        };
    }

    function redirect(event) {
        event.preventDefault();
        window.open(event.srcElement.href)
    }


}())
