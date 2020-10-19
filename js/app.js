ImgType = {
    ANY : 0,
    BG : 1,
    HERO : 2
}

var images = [];
var totalImages = 0;
var minTimeout = 3 * 1000;
var maxTimeout = 70 * 1000;
var timer;
var lastUsedIndexes = {};

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
    $.getJSON('js/images.json?v=6', function(data) {
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
    $('#audio')[0].play();

    // Custom timing
    var mode = window.location.hash.substr(1);
    if (mode == 'fast') {
        maxTimeout = 5 * 1000;
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

        // Check that index hasn't recently been used.
        if (lastUsedIndexes[rand] == true) {
            console.log("Index " + rand + " already used");
            continue;
        }

        // Get image.
        var img = images[rand];
        var url = img[0];
        var type = img[1];

        if (type == ImgType.ANY) {
            if (!didSetHero) {
                setImage(ImgType.HERO, url, rand);
                didSetHero = true;
            } else {
                setImage(ImgType.BG, url, rand);
                didSetBg = true;
            }
        } else if (type == ImgType.BG && !didSetBg) {
            setImage(type, url, rand);
            didSetBg = true;
        } else if (type == ImgType.HERO && !didSetHero) {
            setImage(type, url, rand);
            didSetHero = true;
        }

    }

    if (timer != null) {
        clearTimeout(timer);
    }

    var delay = Math.floor(Math.random() * maxTimeout) + minTimeout;
    timer = setTimeout(updateImages, delay);
    console.log(delay/1000);

    // Clear last used index if it gets too large.
    if (Object.keys(lastUsedIndexes).length >= 150) {
        lastUsedIndexes = {};
    }
}

/** Sets the element background image. */
function setImage(type, url, index) {
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

    // Add to used indexes.
    lastUsedIndexes[index] = true;
}