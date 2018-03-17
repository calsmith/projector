ImgType = {
    ANY : 0,
    BG : 1,
    HERO : 2
}

var images = [];
var totalImages = 0;
var minTimeout = 4100;
var maxTimeout = 15000;

$(function() {
    // Fetch image list.
    $.getJSON('js/images.json?v=3', function(data) {
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
        playMusic();
        maxTimeout = 0;
    }

    // Add click listener.
    $('#page').click(function() {
        updateImages(true);
    });
});

function updateImages(noTimer) {
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

    if (noTimer != true) {
        var delay = Math.floor(Math.random() * maxTimeout) + minTimeout;
        setTimeout(updateImages, delay);
    }
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

function playMusic() {
    var sc = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/9455969&amp;color=0066cc&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false";
    $('#music').prop('src', sc);
}