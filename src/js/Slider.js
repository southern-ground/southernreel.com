/**
 * Created by fst on 5/30/17.
 */
var Slider = function () {
    this.busy = false;
    this.index = 0;
    this.$active;
    this.slideCount = 0;
    this.slideAnimationTime = 750;
};
Slider.prototype = {
    init: function () {
        this.slideCount = $('ul.slide-show li').length;
        $('.slide-show').find('li').each(function (index, el) {
            var $el = $(el),
                background = $el.data('background');
            $el.css({
                'background-image': "url(img/slides/" + background + ")",
                'opacity': index === 0 ? "1" : "0"
            });
        });
        this.$active = $('ul.slide-show li[data-index=0]');
        (function (scope) {
            // Keyboard commands
            jQuery(document).keydown(function (e) {
                if (e.keyCode == 37) {
                    scope.prev();
                }
                if (e.keyCode == 39) {
                    scope.next();
                }
                if (e.keyCode == 27) {
                    // Esc key
                    // jQuery('.fullscreen-gallery .close').click();
                    console.log('ESCAPE');
                }
                if (e.keyCode == 33) {
                    scope.prev();
                }
                if (e.keyCode == 34) {
                    scope.next();
                }
                if (e.keyCode == 36) {
                    scope.first();
                }
                if (e.keyCode == 35) {
                    scope.last();
                }

            });
            $('.slide-show').bind('mousewheel', function (e) {
                if (e.originalEvent.wheelDelta / 120 > 0) {
                    scope.scrollUp();
                } else {
                    scope.scrollDown();
                }
            });
        })(this);
    },
    isBoss: function () {
        return $(window).scrollTop() === 0;
    },
    prev: function () {
        console.log('slider::prev', this.isBoss());
        /*if (!this.busy) {
         var $currentSlide = $('ul.slide-show li[data-index=' + this.index + ']'),
         nextIndex = this.index === 0 ? -1 : this.index - 1,
         $nextSlide = $('li[data-index=' + nextIndex + ']');

         console.log('prev');

         if (nextIndex >= 0) {
         this.busy = true;

         $currentSlide.animate({opacity: 0}, 500);

         $nextSlide.animate({opacity: 1}, this.slideAnimationTime, (function (scope) {
         scope.index = nextIndex;
         scope.busy = false;
         })(this));
         }
         }*/
    },
    next: function () {
        console.log('slider::next', this.isBoss());
        /*if (!this.busy) {

         var $currentSlide = $('ul.slide-show li[data-index=' + this.index + ']'),
         nextIndex = this.index === this.slideCount - 1 ? -1 : this.index + 1,
         $nextSlide = $('li[data-index=' + nextIndex + ']');

         if (nextIndex >= 0) {
         this.busy = true;

         $currentSlide.animate({opacity: 0}, 500);

         $nextSlide.animate({opacity: 1}, this.slideAnimationTime, (function (scope) {
         scope.index = nextIndex;
         scope.busy = false;
         })(this));
         } else {
         $('#Content').removeClass('slide-show-active');

         }

         }*/
    },
    first: function () {
        console.log('slider::first');
        /*if (!busy) {
         var $currentSlide = $('ul.slide-show li[data-index=' + index + ']'),
         nextIndex = 0,
         $nextSlide = $('li[data-index=' + nextIndex + ']');

         busy = true;

         $currentSlide.animate({opacity: 0}, 500);
         $nextSlide.animate({opacity: 1}, 500, (function (scope) {
         index = nextIndex;
         busy = false;
         })(this));
         }*/
    },
    last: function () {
        console.log('slider::last');
        /*if (!busy) {
         var $currentSlide = $('ul.slide-show li[data-index=' + index + ']'),
         nextIndex = slideCount - 1,
         $nextSlide = $('li[data-index=' + nextIndex + ']');

         busy = true;

         $currentSlide.animate({opacity: 0}, 500);
         $nextSlide.animate({opacity: 1}, 500, (function (scope) {
         index = nextIndex;
         busy = false;
         })(this));
         }*/
    },
    scrollUp: function (e) {
        if (this.isBoss()) {
            if ($('#content').hasClass('slide-show-active')) {
                var currentIndex = this.$active.data('index'),
                    opacity = this.$active.css('opacity') - 0.02,
                    $next = $('ul.slide-show li[data-index=' + (currentIndex - 1) + ']');
                if (currentIndex > 0) {
                    if (opacity > 0) {
                        this.$active.css({
                            opacity: opacity
                        });
                        $next.css({
                            opacity: 1 - opacity
                        });
                    } else {
                        $('ul.slide-show li').css({opacity: 0});
                        this.$active.css({
                            opacity: 0
                        });
                        $next.css({
                            opacity: 1
                        });
                        this.$active = $next;
                    }
                }
            } else {
                $('#content').addClass('slide-show-active');
                this.scrollUp();
            }
        }
    },
    scrollDown: function (e) {
        var currentIndex = this.$active.data('index'),
            opacity = this.$active.css('opacity') - 0.02,
            $next = $('ul.slide-show li[data-index=' + (currentIndex + 1) + ']');
        if (currentIndex < this.slideCount - 1 && this.isBoss()) {
            if (opacity > 0) {
                this.$active.css({
                    opacity: opacity
                });
                $next.css({opacity: (1 - opacity)});
            } else {
                $('ul.slide-show li').css({opacity: 0});
                $next.css({opacity: 1});
                this.$active = $next;
                if (currentIndex === this.slideCount - 2) {
                    $('#content').removeClass('slide-show-active');
                }
            }
        }
    }
};