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

})();
