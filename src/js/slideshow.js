/**
 * Created by fst on 6/1/17.
 */
var sr_ss = { // Southern Reel Slide Show
    FOLLOW_UP_TIMEOUT: 250,
    $container: null,
    currentSlide: 1,
    isMobile: null,
    followUpTimeout: null,
    previousScrollTop: 0,
    scrollDirection: 0,
    scrollTop: 0,
    slideCount: 0,
    winHeight: 0,
    winWidth: 0,
    addListeners: function () {
        $(document).keydown(function (e) {
            if (e.keyCode == 37) {
                sr_ss.prev();
            }
            if (e.keyCode == 39) {
                sr_ss.next();
            }
            if (e.keyCode == 27) {
                console.log('ESCAPE');
            }
            if (e.keyCode == 33) {
                sr_ss.prev();
            }
            if (e.keyCode == 34) {
                sr_ss.next();
            }
            if (e.keyCode == 36) {
                sr_ss.first();
            }
            if (e.keyCode == 35) {
                sr_ss.last();
            }
        });
        $(window).scroll(function () {
            sr_ss.handleScroll();
        });
        $(window).resize(function () {
            sr_ss.resizeSlider();
        });

        var $firstSlide = $('li.slide[data-index=1]').find('.slide__background');

        $('<img/>')
            .attr('src', $firstSlide.data('background'))
            .on('load', function () {
                $(this).remove();
                sr_ss.showSlides();
            });

    },
    first: function () {
        $("html, body").animate({scrollTop: 0}, "fast");
    },
    handleScroll: function () {
        var d = this.scrollData(),
            $el = $('li.slide[data-index=' + d.currentSlide + ']'),
            $image = $el.find('.slide__background'),
            $title = $el.find('.slide__copy'),
            textTranslateScaler = ((1 - d.delta) * -100),
            opacity = (d.delta < 0.7) ? d.delta / 0.7 : 1;

        sr_ss.scrollDirection = d.top > sr_ss.previousScrollTop ? 1 : -1;
        sr_ss.previousScrollTop = d.top;
        sr_ss.currentSlide = d.currentSlide;
        $el.css({
            opacity: opacity <= 0.03 ? 0 : opacity,
            display: d.delta > 0.03 ? "flex" : "none"
        });
        $image.css({transform: 'scale(' + (((1 - d.delta) * 0.4) + 1) + ')'});
        $title.css({
            "-webkit-transform": "translate(0," + textTranslateScaler + "px)",
            "-ms-transform": "translate(0," + textTranslateScaler + "px)",
            "transform": "translate(0," + textTranslateScaler + "px)"
        });

        $('.slide').filter(function () {
            return $(this).data('index') < d.currentSlide - 1;
        }).css({
            'display': 'none',
            'opacity': 0
        });
        // Communicate up that we've scrolled:
        if (!sr_ss.isMobile) window.parent.sr.slideShowScroll({
            top: d.top,
            slide: sr_ss.currentSlide,
            total: sr_ss.slideCount
        });
    },
    init: function () {
        sr_ss.isMobile = window.parent.mobileAndTabletcheck();
        sr_ss.$container = $('#slideShowWrapper');
        sr_ss.$container.addClass(sr_ss.isMobile ? "is-mobile" : "not-mobile");
        if (sr_ss.isMobile) {
            window.parent.sr.resizeSlideShow();
            return;
        }
        sr_ss.initSlides();
        sr_ss.resizeSlider();
        sr_ss.addListeners();
        sr_ss.setBeacon();
    },
    initSlides: function () {
        sr_ss.slideCount = $('li.slide').length;
        $('.slide .slide__copy').click(function (e) {
            var url = $(this).data('url'),
                title = $(this).data('title'),
                subtitle = $(this).data('subtitle'),
                tracking = $(this).data('tracking-title');
            window.parent.sr.showVideo({
                url: url,
                title: title,
                subtitle: subtitle,
                tracking: tracking
            });
        });
    },
    last: function () {
        $("html, body").animate({scrollTop: sr_ss.slideCount * sr_ss.winHeight}, "fast");
    },
    next: function () {
        if (sr_ss.currentSlide < sr_ss.slideCount) {
            // Go to next:
            $("html, body").animate({scrollTop: sr_ss.currentSlide * sr_ss.winHeight}, "fast");
        }
    },
    prev: function () {
        if (sr_ss.currentSlide > 1) {
            // Go to next:
            $("html, body").animate({scrollTop: (sr_ss.currentSlide - 2) * sr_ss.winHeight}, "fast");
        }
    },
    resizeSlider: function () {
        sr_ss.winHeight = $(window).innerHeight();
        sr_ss.winWidth = $(window).innerWidth();
        sr_ss.$container.css('min-height', sr_ss.slideCount * sr_ss.winHeight);
    },
    rewind: function () {
        $('body, html').animate({
            'scrollTop': 0
        }, 'fast', function () {
            // Callback;
        });
    },
    scrollData: function () {
        var wh = $(window).innerHeight(),
            t = $(window).scrollTop(),
            h = sr_ss.$container.innerHeight(),
            cs = ((t / wh) + 1 | 0);
        return {
            top: t,
            winHeight: wh,
            height: h,
            currentSlide: cs,
            perc: t / (h - wh),
            delta: ((cs * wh) - t) / wh
        }
    },
    setBeacon: function () {
        window.parent.sr.setSliderReference(sr_ss);
    },
    showSlides: function () {
        var $el;
        $('.slide__background').each(function () {
            $el = $(this);
            $el.css({
                'background-image': 'url(' + $el.data('background') + ')'
            })
                .removeClass('hidden')
                .fadeIn();
        });
        $('.slide__copy').each(function () {
            $el = $(this);
            $el.removeClass('hidden');
            if ($el.parent().data('index') === 1) {
                $el
                    .css({
                        'opacity': 0
                    })
                    .animate({'opacity': 1}, 1500, "linear")
            }
        });
    }
};
sr_ss.init();