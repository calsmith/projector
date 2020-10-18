ImgType = {
    ANY : 0,
    BG : 1,
    HERO : 2
}

var images = [];
var totalImages = 0;
var minTimeout = 20 * 1000;
var maxTimeout = 120 * 1000;
var timer;

$(function() {

    // Check if running on mobile.
    var browser = navigator.userAgent.toLowerCase();
    if (browser.includes("android") || browser.includes("iphone")) {
        alert("Open on desktop for the best experience:\nmadebycalsmith.com/projector");
    }

    // Add begin button.
    $('#startButton').click(function() {
        begin();
    });
    
});

function begin() {
    // Remove start button.
    $('#startButton').remove();

    // Fetch image list.
    $.getJSON('js/images.json?v=4', function(data) {
        images = data.images;
        totalImages = images.length;
        if (totalImages != 0) {
            updateImages();
        } else {
            alert("Oops! Couldn't load any images");
        }
    }).fail(function(o, msg) {
        console.log(o);
        alert("Failed to load image list!\n" + msg);
    });

    // Enable music if needed.
    var mode = window.location.hash.substr(1);
    if (!mode || mode == '') {
        $('#audio')[0].play();
        maxTimeout = 0;
    }

    // Add click listener.
    $('#page').click(function() {
        updateImages();
    });

    // Go full-sceen.
    if (document.documentElement.webkitRequestFullScreen) {  
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    } 
}

function updateImages() {
    var didSetBg = false;
    var didSetHero = false;
    while (!didSetBg || !didSetHero) {
        // Get random image object.
        var rand = Math.floor(Math.random() * totalImages);
        var img = images[rand];
        var url = img[0];
        var type = img[1];

        if (type == ImgType.ANY) {
            if (!didSetHero) {
                setImage(ImgType.HERO, url);
                didSetHero = true;
            } else {
                setImage(ImgType.BG, url);
                didSetBg = true;
            }
        } else if (type == ImgType.BG && !didSetBg) {
            setImage(type, url);
            didSetBg = true;
        } else if (type == ImgType.HERO && !didSetHero) {
            setImage(type, url);
            didSetHero = true;
        }

    }

    if (timer != null) {
        clearTimeout(timer);
    }

    var delay = Math.floor(Math.random() * maxTimeout) + minTimeout;
    timer = setTimeout(updateImages, delay);
}

/** Sets the element background image. */
function setImage(type, url) {
    url = "img/" + url + ".gif";
    var el = '';
    if (type == ImgType.BG) {
        el = '#page';
    } else if (type == ImgType.HERO) {
        el = '#hero';
    } else {
        console.log("Invalid type sent to setImage()");
    }

    $(el).css('background-image', 'url(' + url + ')');
}