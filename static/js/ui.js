// Lazy Load Selector
var lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
});

// Toggles Theme Dark Mode On & Off
function toggleDarkMode() {
    var lightModeActive = getCookie('ospLightMode');
    lightModeActive = !lightModeActive;
    if (lightModeActive ===  true) {
        setLightMode();
    } else {
        setDarkMode();
    }
}

function setLightMode() {
    darkModeIcon = document.getElementById('darkModeIcon');
    darkModeIcon.className = 'textShadow bi bi-brightness-alt-high-fill bs-icon';
    document.documentElement.setAttribute("data-theme", 'light');
    setCookie('ospLightMode', true);
}

function setDarkMode() {
    darkModeIcon = document.getElementById('darkModeIcon');
    darkModeIcon.className = 'textShadow bi bi-brightness-alt-low bs-icon';
    document.documentElement.setAttribute("data-theme", 'dark');
    setCookie('ospLightMode', false);
}

// Opens the User Navigation Bar
function showUserNav() {
    try {
        document.getElementById("userMenuDropdown").classList.toggle('show');
    } catch {
        console.log("Error: Unable to Detect User Menu");
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CopyDiv(divVal) {
    var copyText = document.getElementById(divVal);
    copyText.select();
    document.execCommand("copy");
}

function hideDiv(divID) {
  $('#' + divID).removeClass("show");
  $('#' + divID).addClass("hide");
}

function toggleDiv(divID) {
  var x = document.getElementById(divID);
  $(x).slideToggle();
}

function openModal(modalID) {
    $('#' + modalID).modal('show')
}

function map(arrayLike, fn) {
    var ret = [], i = -1, len = arrayLike.length;
    while (++i < len) ret[i] = fn(arrayLike[i]);
    return ret;
}

function getNodeIds(node) {
    if (node.nodeType === 1) return node.id;
    var txt = '';
    if (node = node.firstChild) do {
        txt += getText(node);
    } while (node = node.nextSibling);
    return txt;
}

// Creates a Bootstrap Alert
function createNewBSAlert(message,category) {
  var randomID = getRandomInt(1,9000);
  $('#toastDiv').append('<div class="toast fade show" id="toast-' + randomID + '" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="true" data-delay="30000" style="width:250px;">' +
          '<div class="toast-header"><strong class="mr-auto"><span class="toast-box"> </span><span style="margin-left:5px;">' + category + '</span> </strong>' +
          '<div class="float-end"><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" onclick="hideDiv(\'toast-' + randomID + '\')"></button></div></div><div class="toast-body">' + message + '</div></div>')
}

function clearSearch() {
    document.getElementById('systemSearchInput').value = '';
    document.getElementById('searchClearIcon').style.display = 'none';
    document.getElementById("searchResults").style.display = 'none';
    var ul = document.getElementById("searchResultsList-Channels");
    ul.innerHTML = '';
    var ul = document.getElementById("searchResultsList-Videos");
    ul.innerHTML = '';
    var ul = document.getElementById("searchResultsList-Clips");
    ul.innerHTML = '';
    var ul = document.getElementById("searchResultsList-Users");
    ul.innerHTML = '';
}

// Watches the Mouse Target Location Opens User Navigation Bar
$(document).click(function(event) {
    var target = event.target.parentNode;
    if (document.getElementById('userMenuDropdown') != null) {
        if (target.id != 'userMenuDropdown' && target.id != 'userDropDownButton' && document.getElementById('userMenuDropdown').classList.contains('show')) {
            document.getElementById("userMenuDropdown").classList.toggle('show');
        }
    }
});


// Event Handlers

// Stream Card png to gif Handler
$(document).ready(function()
  {
      $(".gif").hover(
          function()
          {
            var src = $(this).attr("src");
            $(this).attr("src", src.replace(/\.png$/i, ".gif"));
          },
          function()
          {
            var src = $(this).attr("src");
            $(this).attr("src", src.replace(/\.gif$/i, ".png"));
          });
});

// Stream Card png to gif Handler
$(document).ready(function()
  {
      $(".gifhover").hover(
          function()
          {
            var src = $(this).find('img').attr("src");
            $(this).find('img').attr("src", src.replace(/\.png$/i, ".gif"));
          },
          function()
          {
            var src = $(this).find('img').attr("src");
            $(this).find('img').attr("src", src.replace(/\.gif$/i, ".png"));
          });
});

// Handler for Setting Light/Dark Mode
document.addEventListener("DOMContentLoaded", function(event) {
  document.documentElement.setAttribute("data-theme", "dark");

  var lightModeActive = getCookie('ospLightMode');
  if (lightModeActive === null) {
    setCookie('ospLightMode', false);
    lightModeActive = 'false';
  }

  lightModeActive = (lightModeActive === 'true');

  if (lightModeActive === true) {
    setLightMode();
  } else if (lightModeActive === false) {
    setDarkMode()
  }
});

$("#systemSearchInput").on('change keydown paste input', function(){
    var searchInput = document.getElementById('systemSearchInput').value;
    var searchClearButton = document.getElementById('searchClearIcon')

    // Show and Hide Search Clear Button
    if (searchInput.length >= 1) {
        searchClearButton.style.display = 'initial';
    } else {
        searchClearButton.style.display = 'none';
    }

    resultsContainerDiv = document.getElementById("searchResults");

    if (searchInput.length >= 3) {
        resultsContainerDiv.style.display = 'none';

        document.getElementById("searchResults");
        var ul = document.getElementById("searchResultsList-Channels");
        ul.innerHTML = '';
        var ul = document.getElementById("searchResultsList-Videos");
        ul.innerHTML = '';
        var ul = document.getElementById("searchResultsList-Clips");
        ul.innerHTML = '';
        var ul = document.getElementById("searchResultsList-Users");
        ul.innerHTML = '';

        $.post('/apiv1/channel/search', {term: searchInput}, function (data, textStatus) {
            var channelResults = data['results'];
            ul = document.getElementById("searchResultsList-Channels");
            ul.innerHTML = '';
            for (var i = 0; i < channelResults.length; i++) {
                var li = document.createElement("li");
                li.classList = "list-group-item";
                li.innerHTML = '<a href="/channel/' + channelResults[i][0] + '/">' + channelResults[i][1] + '</a>'
                ul.appendChild(li);
            }
        }, "json");

        $.post('/apiv1/stream/search', {term: searchInput}, function (data, textStatus) {
            var streamResults = data['results'];
        }, "json");

        $.post('/apiv1/video/search', {term: searchInput}, function (data, textStatus) {
            var videoResults = data['results'];
            ul = document.getElementById("searchResultsList-Videos");
            ul.innerHTML = '';
            for (var i = 0; i < videoResults.length; i++) {
                var li = document.createElement("li");
                li.classList = "list-group-item";
                li.innerHTML = '<a href="/play/' + videoResults[i][0] + '/">' + videoResults[i][1] + '</a>'
                ul.appendChild(li);
            }
        }, "json");

        $.post('/apiv1/clip/search', {term: searchInput}, function (data, textStatus) {
            var clipResults = data['results'];
            ul = document.getElementById("searchResultsList-Clips");
            ul.innerHTML = '';
            for (var i = 0; i < clipResults.length; i++) {
                var li = document.createElement("li");
                li.classList = "list-group-item";
                li.innerHTML = '<a href="/clip/' + clipResults[i][0] + '/">' + clipResults[i][1] + '</a>'
                ul.appendChild(li);
            }
        }, "json");

        $.post('/apiv1/user/search', {term: searchInput}, function (data, textStatus) {
            var userResults = data['results'];
            ul = document.getElementById("searchResultsList-Users");
            ul.innerHTML = '';
            for (var i = 0; i < userResults.length; i++) {
                var li = document.createElement("li");
                li.classList = "list-group-item";
                li.innerHTML = '<a href="/profile/' + userResults[i][1] + '/">' + userResults[i][1] + '</a>'
                ul.appendChild(li);
            }
        }, "json");

        resultsContainerDiv.style.display = 'block';

    } else {
        resultsContainerDiv.style.display = 'none';
        var ul = document.getElementById("searchResultsList-Channels");
        ul.innerHTML = '';
        var ul = document.getElementById("searchResultsList-Videos");
        ul.innerHTML = '';
        var ul = document.getElementById("searchResultsList-Clips");
        ul.innerHTML = '';
        var ul = document.getElementById("searchResultsList-Users");
        ul.innerHTML = '';
    }
});

