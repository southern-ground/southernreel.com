var _ = window._,
    com = window.com || {},
    SouthernReel = function (w) {
        this.window = w || window;
        this.$slideShowContainer = $('.slide-show-active');
    };

SouthernReel.prototype = {
    init: function () {
        console.log('southernReel::init');
        $('#headerMenu').slideUp();
        $('#hamburger').click(function () {
            if ($('#headerMenu').is(":hidden")) {
                $('#headerMenu').slideDown("slow");
            } else {
                $('#headerMenu').slideUp();
            }
        });
        $('#menuClose').click(function () {
            $('#headerMenu').slideUp();
        });


        $('#overlayClose').click(function (e) {
            $('#overlay').fadeOut('fast', function () {
                $(this).find('#overlayContent').empty();
            });
            e.preventDefault();
            e.stopPropagation();
            void(0);
            return false;
        });
        (function (sliderInstance) {
            $('.headerMenu__internalLink').click(function (e) {
                var sectionID = $(this).attr('href');
                sectionID === '#Video'
                    ?
                    sliderInstance.$slideShowContainer.addClass('slide-show-active')
                    :
                    sliderInstance.$slideShowContainer.removeClass('slide-show-active');

                $('#headerMenu').slideUp('fast');

                $('html, body').animate({
                    scrollTop: $(sectionID).offset().top
                }, 2000);
            });
            $(window).scroll(function () {
                if ($(window).scrollTop() === 0) {
                    sliderInstance.$slideShowContainer.addClass('slide-show-active');
                }
            });
        })(this);
    },
    showVideo: function (obj) {
        var w = {h: $(window).innerHeight(), w: $(window).innerWidth()},
            vw = {h: 0, w: 0, ratio: 360 / 640};

        vw.w = (w.w * 0.9) | 0;
        vw.h = vw.w * vw.ratio;

        $('#overlayContent').empty();
        $('#overlayContent').html(
            '<iframe src="' + obj.url + '" width="' + vw.w + '" height="' + vw.h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
            '<p>' + obj.title + '</p>'
        );
        $('#overlay').fadeIn('fast');
    },
    slideShowScroll: function (evt) {
        if (evt.slide === evt.total) {
            this.$slideShowContainer.removeClass('slide-show-active');
        }
    }
};

com.ambiveo = new Ambiveo(document.getElementById('Content'), {class: 'ambiveo'});
com.southernReel = new SouthernReel();

$(document).ready(function () {

    com.ambiveo.init();
    com.southernReel.init();
    console.log(com);

});