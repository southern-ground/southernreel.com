var _ = window._;
$(document).ready(function () {

    var backToTop = $('.back-to-top'),
        myLazyLoad = new LazyLoad(),
        onScroll,
        checkScroll = function () {
            console.log('checkScroll');
            if (this.scrollY > $('header').height()) {
                backToTop.removeClass('hidden');
            } else {
                backToTop.addClass('hidden');
            }
        };

    $('.nav-items__item__link').each(function (index, item) {
        if ($(item).data('loc')) {
            var $targetElem = $($(item).data('loc'));
            $(item).on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('target:', $targetElem.offset().top);
                $('html, body').animate({
                    scrollTop: $targetElem.offset().top
                }, 500);
            });
        }
    });

    backToTop.click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    onScroll = _.debounce(checkScroll, 100);

    $(window).scroll(onScroll);

    onScroll();

});

(function () {
    var com = window.com || {};

    com.ambiveo = new Ambiveo(document.getElementById('Content'), {class: 'ambiveo'});
    com.ambiveo.init();

    com.slider = new Slider();
    com.slider.init();

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
    $('.headerMenu__internalLink').click(function (e) {
        var sectionID = $(this).attr('href');
        sectionID === '#Video'
            ?
            $('#content').addClass('slide-show-active')
            :
            $('#content').removeClass('slide-show-active');

        $('#headerMenu').slideUp('fast');

        $('html, body').animate({
            scrollTop: $(sectionID).offset().top
        }, 2000);
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
    $('.slide a').click(function (e) {
        console.log("YES")
        var url = $(this).data('url'),
            title = $(this).data('title'),
            w = 640, // (window.innerWidth * 0.8) | 0,
            h = 360; // (w * (360/640)) | 0;

        $('#overlayContent').empty();
        $('#overlayContent').html(
            '<iframe src="' + url + '" width="'+w+'" height="'+h+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
            '<p>' + title + '</p>'
        );
        $('#overlay').fadeIn('fast');
        e.preventDefault();
        e.stopPropagation();
        void(0);
        return false;
    });

})();
