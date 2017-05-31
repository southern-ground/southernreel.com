/**
 * Created by fst on 5/30/17.
 */
var Slider = function () {
    this.FOLLOW_UP_TIMEOUT = 250;
    this.SCROLL_INCREMENT = 0.01;
    this.SCROLL_THRESHOLD = 0.5;
    this.SLIDE_ANIMATION_TIME = 750;
    this.SLIDE_SHOW_ACTIVE_CLASS = 'slide-show-active';
    this.$active;
    this.$sliderContainer;
    this.busy = false;
    this.index = 0;
    this.lastSlide = 0;
    this.slideCount = 0;
    this.followUpTimeout;
    this.scrollDirection = 0;
};
Slider.prototype = {
    addListeners: function (scope) {
        // Keyboard commands
        $(document).keydown(function (e) {
            if (e.keyCode == 37) {
                scope.prev();
            }
            if (e.keyCode == 39) {
                scope.next();
            }
            if (e.keyCode == 27) {
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
    },
    createFollowUpTimeout: function (scope) {
        return setTimeout(function () {
            scope.checkScroll();
        }, this.FOLLOW_UP_TIMEOUT);
    },
    init: function () {
        this.$sliderContainer = $('.slide-show-wrapper');
        this.initSlides(this);
        this.addListeners(this);
    },
    initSlides: function (scope) {
        $('li.slide').each(function (index, el) {
            var $el = $(el),
                background = $el.data('background');
            $el.css({
                'background-image': "url(img/slides/" + background + ")",
                'opacity': index === 0 ? "1" : "0"
            });
            if (index === 0) {
                scope.$active = $el;
            } else {
                $el.addClass('inactive');
            }
            scope.slideCount++;
        });
        this.lastSlide = this.slideCount - 1; // Lazy.
    },
    addFollowUp: function () {
        clearTimeout(this.followUpTimeout);
        this.followUpTimeout = this.createFollowUpTimeout(this);
    },
    checkScroll: function () {
        var currentIndex,
            $next,
            _this = this,
            percentComplete = this.$active.css('opacity'),
            completeTransition = percentComplete < this.SCROLL_THRESHOLD;

        if (this.scrollDirection === 1) {
            // Scrolling Up
            currentIndex = this.$active.data('index');
            if (currentIndex > 0) {
                $next = $('li.slide[data-index=' + (currentIndex - 1) + ']');
            } else {
                $next = $('li.slide[data-index=0]');
            }
            if (completeTransition) {
                this.$active
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 0);
                $next
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 1, function () {
                        _this.$active = $next;
                        _this.hideInactive();
                    });
            } else {
                $next
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 0);
                this.$active
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 1, function () {
                        $('li.slide').addClass('inactive');
                        _this.$active.removeClass('inactive');
                        _this.hideInactive();
                    });
            }
        } else if (this.scrollDirection === -1) {
            currentIndex = this.$active.data('index');
            $next = $('li.slide[data-index=' + (currentIndex + 1) + ']');
            // Scrolling Down
            if (completeTransition) {
                this.$active
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 0);
                $next
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 1, function () {
                        _this.$active = $next;
                        _this.hideInactive();
                    });
            } else {
                $next
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 0);
                this.$active
                    .fadeTo(this.SLIDE_ANIMATION_TIME, 1, function () {
                        $('li.slide').addClass('inactive');
                        _this.$active.removeClass('inactive');
                        _this.hideInactive();
                    });
            }
        } else {
            console.warn('Null Transition');
            if (this.isAtTopOfPage()) {
                this.$sliderContainer.addClass(this.SLIDE_SHOW_ACTIVE_CLASS);
            }
        }
    },
    hideInactive: function () {
        $('li.slide[data-index!=' + this.$active.data('index') + ']')
            .css({
                opacity: 0
            })
            .addClass('inactive');
        this.$active.removeClass('inactive');
        this.$active.data('index') === this.lastSlide
            ?
            this.$sliderContainer.removeClass(this.SLIDE_SHOW_ACTIVE_CLASS)
            :
            this.$sliderContainer.addClass(this.SLIDE_SHOW_ACTIVE_CLASS);
    },
    isAtTopOfPage: function () {
        return $(window).scrollTop() === 0;
    },
    prev: function () {
        if (!this.busy) {
            if (this.isAtTopOfPage()) {
                this.$sliderContainer.addClass(this.SLIDE_SHOW_ACTIVE_CLASS);
                var currentIndex = this.$active.data('index'),
                    nextIndex = currentIndex === 0 ? -1 : currentIndex - 1,
                    $next = $('li.slide[data-index=' + nextIndex + ']');
                if (nextIndex >= 0) {
                    this.busy = true;
                    this.$active.fadeTo(this.SLIDE_ANIMATION_TIME, 0);
                    (function(sliderInstance){
                        $next.fadeTo(this.SLIDE_ANIMATION_TIME, 1, function () {
                            sliderInstance.$active = $next;
                            sliderInstance.busy = false;
                        });
                    })(this);
                } else {
                    this.$sliderContainer.addClass(this.SLIDE_SHOW_ACTIVE_CLASS);
                }

            }
        }
    },
    next: function () {
        if (!this.busy) {
            var currentIndex = this.$active.data('index'),
                nextIndex = currentIndex === this.lastSlide ? -1 : currentIndex + 1,
                $next = $('li.slide[data-index=' + nextIndex + ']');
            if (nextIndex >= 0) {
                this.busy = true;
                this.$active.fadeTo(this.SLIDE_ANIMATION_TIME, 0);
                (function(sliderInstance){
                    $next.fadeTo(this.SLIDE_ANIMATION_TIME, 1, function () {
                        sliderInstance.$active = $next;
                        sliderInstance.busy = false;
                        sliderInstance.hideInactive();
                    });
                })(this);
            } else {
                this.$sliderContainer.removeClass(this.SLIDE_SHOW_ACTIVE_CLASS);
            }
        }
    },
    first: function () {
        if (!this.busy) {
            this.busy = true;
            var $next = $('li.slide[data-index=' + 0 + ']');
            this.$active.fadeTo(this.SLIDE_ANIMATION_TIME, 0);
            (function(sliderInstance){
                $next.fadeTo(this.SLIDE_ANIMATION_TIME, 1, function () {
                    sliderInstance.$active = $next;
                    sliderInstance.hideInactive();
                    sliderInstance.busy = false;
                });
            })(this);
        }
    },
    last: function () {
        if (!this.busy) {
            this.busy = true;
            var $next = $('li.slide[data-index=' + this.lastSlide + ']');
            this.$active.fadeTo(this.SLIDE_ANIMATION_TIME, 0);
            (function(sliderInstance){
                $next.fadeTo(this.SLIDE_ANIMATION_TIME, 1, function(){
                    sliderInstance.$active = $next;
                    sliderInstance.hideInactive();
                    sliderInstance.busy = false;
                });
            })(this);
        }
    },
    scrollUp: function (e) {
        if(this.busy) return;
        if (this.isAtTopOfPage()) {
            if (this.$sliderContainer.hasClass(this.SLIDE_SHOW_ACTIVE_CLASS)) {
                var currentIndex = this.$active.data('index'),
                    opacity = this.$active.css('opacity') - this.SCROLL_INCREMENT,
                    $next = $('li.slide[data-index=' + (currentIndex - 1) + ']');
                if (currentIndex > 0) {
                    if (opacity > 0) {
                        this.$active.css({
                            opacity: opacity
                        });
                        $next.css({
                            opacity: 1 - opacity
                        });
                        this.scrollDirection = 1;
                        this.addFollowUp();
                    } else {
                        $('li.slide').css({opacity: 0});
                        this.$active
                            .css({
                                opacity: 0
                            })
                            .addClass('inactive');
                        $next
                            .css({
                                opacity: 1
                            })
                            .removeClass('inactive');
                        this.scrollDirection = 0;
                        this.$active = $next;
                    }
                }
            } else {
                this.$sliderContainer.addClass(this.SLIDE_SHOW_ACTIVE_CLASS);
                this.scrollUp();
            }
        }
    },
    scrollDown: function (e) {
        if(this.busy) return;
        var currentIndex = this.$active.data('index'),
            opacity = this.$active.css('opacity') - this.SCROLL_INCREMENT,
            $next = $('li.slide[data-index=' + (currentIndex + 1) + ']');
        if (currentIndex < this.lastSlide && this.isAtTopOfPage()) {
            if (opacity > 0) {
                this.$active.css({
                    opacity: opacity
                });
                $next.css({opacity: (1 - opacity)});
                this.scrollDirection = -1;
                this.addFollowUp();
            } else {
                $('li.slide').css({opacity: 0});
                $next
                    .css({opacity: 1})
                    .removeClass('inactive');
                this.$active.addClass('inactive');
                this.$active = $next;
                if (currentIndex === this.lastSlide - 1) {
                    this.$sliderContainer.removeClass(this.SLIDE_SHOW_ACTIVE_CLASS);
                }
                this.scrollDirection = 0;
            }
        }
    }
};