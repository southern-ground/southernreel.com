/**
 * Created by fst on 6/1/17.
 */
$(document).ready(function () {
    var Slider = function (w) {
        this.FOLLOW_UP_TIMEOUT = 250;
        this.$sliderContainer;
        this.currentSlide = 1;
        this.followUpTimeout;
        this.previousScrollTop = 0;
        this.scrollDirection = 0;
        this.scrollTop = 0;
        this.slideCount = 0;
        this.windowHeight = 0;
    };
    Slider.prototype = {
        addListeners: function () {
            console.log('slider::addListeners');
            (function (sliderInstance) {
                $(document).keydown(function (e) {
                    if (e.keyCode == 37) {
                        sliderInstance.prev();
                    }
                    if (e.keyCode == 39) {
                        sliderInstance.next();
                    }
                    if (e.keyCode == 27) {
                        console.log('ESCAPE');
                    }
                    if (e.keyCode == 33) {
                        sliderInstance.prev();
                    }
                    if (e.keyCode == 34) {
                        sliderInstance.next();
                    }
                    if (e.keyCode == 36) {
                        sliderInstance.first();
                    }
                    if (e.keyCode == 35) {
                        sliderInstance.last();
                    }
                });
                $(window).scroll(function () {
                    sliderInstance.handleScroll();
                });
                $(window).resize(function () {
                    sliderInstance.resizeSlider();
                });
            })(this);
        },
        continueScroll: function () {
            var pos = 1 + (this.previousScrollTop / this.windowHeight);
            if (this.scrollDirection === 1) {
                if (this.currentSlide < this.slideCount) {
                    // Go to next:
                    $("html, body").animate({scrollTop: this.currentSlide * this.windowHeight}, "fast");
                }
            } else {
                $("html, body").animate({scrollTop: (this.currentSlide - 1) * this.windowHeight}, "fast");
            }
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

            this.scrollDirection = d.top > this.previousScrollTop ? 1 : -1;
            this.previousScrollTop = d.top;
            this.currentSlide = d.currentSlide;

            $el.css({
                opacity: opacity,
                display: d.delta > 0.03 ? "flex" : "none"
            });
            $image.css({transform: 'scale(' + (((1 - d.delta) * 0.4) + 1) + ')'});
            $title.css({
                "-webkit-transform": "translate(0," + textTranslateScaler + "px)",
                "-ms-transform": "translate(0," + textTranslateScaler + "px)",
                "transform": "translate(0," + textTranslateScaler + "px)"
            });

            // this.setFollowUp();

            // Communicate up that we've scrolled:
            window.parent.com.southernReel.slideShowScroll({
                top: d.top,
                slide: this.currentSlide,
                total: this.slideCount
            });
        },
        init: function () {
            this.initSlides();
            this.resizeSlider();
            this.addListeners();
        },
        initSlides: function () {
            this.$sliderContainer = $('#slideShowWrapper');
            this.slideCount = $('li.slide').length;
            $('.slide .slide__copy').click(function (e) {
                var url = $(this).data('url'),
                    title = $(this).data('title');
                window.parent.com.southernReel.showVideo({
                    url: url,
                    title: title
                });
            });
        },
        last: function () {
            $("html, body").animate({scrollTop: this.slideCount * this.windowHeight}, "fast");
        },
        next: function () {
            console.log('slider::next', this.currentSlide, this.slideCount);
            if (this.currentSlide < this.slideCount) {
                console.log('zippy');
                // Go to next:
                $("html, body").animate({scrollTop: this.currentSlide * this.windowHeight}, "fast");
            }
        },
        prev: function () {
            console.log('slider::prev', this.currentSlide, this.slideCount);
            if (this.currentSlide > 1) {
                // Go to next:
                $("html, body").animate({scrollTop: (this.currentSlide - 2) * this.windowHeight}, "fast");
            }
        },
        resizeSlider: function () {
            this.windowHeight = $(window).innerHeight();
            this.$sliderContainer.css('min-height', this.slideCount * this.windowHeight);
        },
        scrollData: function () {
            var wh = $(window).innerHeight(),
                t = $(window).scrollTop(),
                h = this.$sliderContainer.innerHeight(),
                cs = ((t / wh) + 1 | 0);
            return {
                top: t,
                windowHeight: wh,
                height: h,
                currentSlide: cs,
                perc: t / (h - wh),
                delta: ((cs * wh) - t) / wh
            }
        },
        setFollowUp: function () {
            clearTimeout(this.followUpTimeout);
            this.followUpTimeout = (function (sliderInstance) {
                return setTimeout(function () {
                    sliderInstance.continueScroll();
                }, sliderInstance.FOLLOW_UP_TIMEOUT);
            })(this);
        }
    };
    var com = window.parent.com || {};
    com.slideShow = new Slider(window);
    com.slideShow.init();
});