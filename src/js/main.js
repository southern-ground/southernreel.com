var sr = window.sr = {
    _: window._,
    CRAW_INTERVAL: 2500,
    PHOTO_GALLERY_INTERVAL: 7500,
    crawlInterval: null,
    isMobile: null,
    $container: null,
    foldOffset: 0,
    foldHeight: 0,
    lazyLoad: null,
    overlayOpen: false,
    photoGalleryInterval: null,
    sliderInstance: null,
    checkFold: function () {
        var $w = $(window),
            top = $w.scrollTop();
        if (top === 0 && !sr.isMobile) {
            sr.$container.addClass('slide-show--active');
        }
        if (top > sr.foldHeight) {
            $('body').addClass('below-the-fold');
        } else {
            $('body').removeClass('below-the-fold');
        }
    },
    getOverlayVideoSize: function () {
        var $win = $(window),
            w = $win.innerWidth(),
            h = $win.innerHeight,
            vw = 0,
            vh = 0,
            aspectRatio = 1.77;

        vw = ( w * 0.6 ) | 0;
        vh = vw / aspectRatio;

        return {
            w: vw,
            h: vh
        };
    },
    init: function () {
        sr.isMobile = mobileAndTabletcheck();
        sr.$container = $('#content');
        $('body').addClass(sr.isMobile ? "is-mobile" : "not-mobile");
        if (sr.isMobile) {
            sr.$container.removeClass('slide-show--active');
            sr.initMobileGallery();
            $('#slide-show-iframe').addClass('hidden');
            $('#mobile-gallery').removeClass('hidden');
        } else {
            var $iframe = $('#slide-show-iframe');
            $iframe.addClass('active')
                .attr('src', $iframe.data('url'));
        }
        sr.initHeader();
        sr.initCrawl();
        $(window).scroll(function () {
            sr.checkFold();
        });
        sr.checkFold();
        $(window).resize(function () {
            sr.resizeSlideShow();
        });
        sr.resizeSlideShow();
        sr.initPhotoGallery();
        sr.initTracking();
        sr.lazyLoad = new LazyLoad();
    },
    initCrawl: function () {
        $('.crawl').data('index', $('.crawl').children().length);
        $('.crawl').each(function () {
            $(this).find('li').each(function (index, el) {
                index === 0 ? $(el).addClass('active') : $(el).addClass('inactive');
            });
            $(this).css('margin-left', '50%');
            sr.moveCrawl();
        });
        clearInterval(sr.crawlInterval);
        sr.crawlInterval = setInterval(sr.moveCrawl, sr.CRAW_INTERVAL);
    },
    initHeader: function () {
        var $logo = $('#southern-reel__logo');
        sr.foldOffset = $logo.parent().height() - $logo.height() * 0.5;
        $('#headerMenu').slideUp();
        $('#header__hamburger').parent().click(function () {
            if ($('#headerMenu').is(":hidden")) {
                $('body').addClass('no-scroll menu-open');
                $('#headerMenu').slideDown("slow");
                $('#southern-reel__logo')
                    .removeClass('light')
                    .addClass('dark');
                $('#southern-reel__hamburger')
                    .removeClass('headerHamburger light')
                    .addClass('headerClose dark');
                sr.trackEvent('Hamburger Icon', 'click', 'Open');
            } else {
                $('#headerMenu').slideUp(function(){
                    $('body').removeClass('no-scroll menu-open');
                });
                $('#southern-reel__logo')
                    .removeClass('dark')
                    .addClass('light');
                $('#southern-reel__hamburger')
                    .removeClass('headerClose dark')
                    .addClass('headerHamburger light');
                sr.trackEvent('Hamburger Icon', 'click', 'Close');
            }
        });
        $('#southern-reel__logo').click(function () {
            $('body').removeClass('no-scroll');
            $('#headerMenu').slideUp();
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            sr.rewindSlideShow();
            sr.trackEvent('Header Logo', 'click', 'Back to Top');
        });
        $('#menuClose').click(function () {
            $('#headerMenu').slideUp();
            sr.trackEvent('Menu', 'click', 'Close');
        });
        $('#overlayClose').click(function () {
            $('#overlay').fadeOut('fast', function () {
                $(this).find('#overlayContent').empty();
                $('body').removeClass('no-scroll overlay-open');
                sr.overlayOpen = false;
            });
            sr.trackEvent('Overlay', 'click', 'Close');
        });
        $('.headerMenu__internalLink').click(function () {
            var sectionID = $(this).attr('href');
            $('body').removeClass('no-scroll');
            if (!sr.isMobile) {
                sectionID === '#Video'
                    ?
                    sr.$container.addClass('slide-show--active')
                    :
                    sr.$container.removeClass('slide-show--active');
            }
            $('#headerMenu').slideUp('fast', function(){
                $('body').removeClass('no-scroll menu-open');
            });
            $('#southern-reel__hamburger').removeClass('headerClose dark').addClass('headerHamburger light');
            $('#southern-reel__logo').removeClass('dark').addClass('light');
            sr.trackEvent('Menu Link', 'click', sectionID);
            $('html, body').animate({
                scrollTop: $(sectionID).offset().top
            }, 2000, function () {
                // Callback.
                sr.rewindSlideShow();
            });
        });
    },
    initMobileGallery: function () {
        var $el;
        $('.mobile-gallery--slide__background').each(function (i, el) {
            $el = $(el);
            $el.css({
                'background-image': 'url(' + $el.data('background-image') + ')'
            });
        });
        $('.mobile-gallery--slide__copy').click(function (e) {
            var url = $(this).data('url'),
                title = $(this).data('title'),
                subtitle = $(this).data('subtitle'),
                tracking = $(this).data('tracking-title');
            sr.showVideo({
                url: url,
                title: title,
                subtitle: subtitle,
                tracking: tracking
            });
        });
    },
    initPhotoGallery: function () {
        $('#photo-carousel__next').click(function () {
            var id = $('.photo-carousel__item.active').data('index');
            $('.photo-carousel__item').removeClass('active');
            id++;
            if(id >= $('.photo-carousel__item').length-1){
                id = 0;
            }
            $('.photo-carousel__item[data-index='+id+']').addClass('active');
            sr.resetPhotoGalleryInterval();
        });
        $('#photo-carousel__prev').click(function () {
            var id = $('.photo-carousel__item.active').data('index');
            $('.photo-carousel__item').removeClass('active');
            id--;
            if(id < 0){
                id = $('.photo-carousel__item').length - 1;
            }
            $('.photo-carousel__item[data-index='+id+']').addClass('active');
            sr.resetPhotoGalleryInterval();
        });

        $('.photo-carousel__item').each(function(){
            var $el = $(this);
            $el.css({
                'background-image': 'url('+$el.data('image')+')'
            })
        });

        sr.resetPhotoGalleryInterval();

    },
    initTracking: function(){
        // Adds some extra items to track:
        $('[data-tracking-category]').each(function() {
            var data = $(this).data();
            $(this).click(function(){
                try{
                    sr.trackEvent(data.trackingCategory, data.trackingEvent, data.trackingLabel);
                }catch(e){
                    console.warn(e);
                }
            });
        });
    },
    moveCrawl: function () {
        var $crawl = $('.crawl'),
            newIndex = $crawl.data('index') + 1,
            crawlCount = $crawl.children().length,
            newWidth,
            $active,
            newLeft;
        newIndex = newIndex >= crawlCount ? 0 : newIndex;
        $crawl.children().each(function (index, el) {
            if (index === newIndex) {
                $active = $(this);
                $active.removeClass('inactive').addClass('active,blurred');
                newLeft = $active.position().left + 20; // +20 accounts for padding on the sections.
                newWidth = $active.width();
            } else {
                $(this).removeClass('active,blurred').addClass('inactive');
            }
        });
        newLeft += newWidth * 0.5;
        $('.crawl').animate({'margin-left': -newLeft}, 'slow');
        $crawl.data('index', newIndex);
    },
    resetPhotoGalleryInterval: function(){
        clearInterval(sr.photoGalleryInterval);
        sr.photoGalleryInterval = setInterval(function(){
            $('#photo-carousel__next').click();
        }, sr.PHOTO_GALLERY_INTERVAL);
    },
    resizeSlideShow: function () {
        sr.isMobile
            ?
            sr.foldHeight = $('#mobile-gallery').height() - sr.foldOffset
            :
            sr.foldHeight = $('#slide-show-iframe').height() - sr.foldOffset;
        if (sr.overlayOpen) {
            var videoSize = sr.getOverlayVideoSize();
            $('#vimeo-player').width(videoSize.w).height(videoSize.h);

        }
    },
    rewindSlideShow: function () {
        if (sr.isMobile || !sr.sliderInstance) return;

        // Rewind the slide show to the start:
        try {
            sr.sliderInstance.rewind();
        } catch (e) {
            e.stack ? console.warn(e.stack) : console.warn(e.name + "\n\r\t" + e.message);
        } finally {
            // Nothing.
        }

    },
    setSliderReference: function (obj) {
        sr.sliderInstance = obj;
    },
    showVideo: function (obj) {

        var html = '<iframe id="vimeo-player" src="https://player.vimeo.com/video/%%videoURL%%?title=0&amp;byline=0&amp;portrait=0&amp;loop=0&amp;color=222222&amp;autoplay=1&amp;api=1&amp;player_id=vimeo-player" width="%%vw%%" height="%%vh%%" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" class="vimeo-api-active"></iframe>',
            videoSize = sr.getOverlayVideoSize();

        html = html.replace("%%videoURL%%", obj.url)
            .replace('%%vw%%', videoSize.w)
            .replace('%%vh%%', videoSize.h);

        $('#overlayContent').empty();
        $('#overlayContent').html(
            html +
            '<div class="video-description">' +
            '<div class="video__title">' + obj.title + '</div>' +
            '<div class="video__subtitle">' + obj.subtitle + '</div>' +
            '</div>'
        );

        $('#vimeo-player').width = videoSize.w;
        $('#vimeo-player').height = videoSize.h;

        if(obj.tracking){
            sr.trackEvent('View Video', 'play', obj.tracking);
        }

        $('#overlay').fadeIn('fast');

        $('body').addClass('no-scroll overlay-open');

        sr.overlayOpen = true;
    },
    slideShowScroll: function (evt) {
        if (sr.isMobile) {
            return;
        }
        if (evt.slide === evt.total) {
            sr.$container.removeClass('slide-show--active');
        }
    },
    trackEvent: function (evtCategory,evtAction,evtLabel){
        try{
            ga('send', {
                hitType: 'event',
                eventCategory: evtCategory,
                eventAction: evtAction,
                eventLabel: evtLabel
            });
        }catch(e){
            console.warn(e);
        }
    }
};

window.mobileAndTabletcheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);

    if (!check && window.orientation !== undefined) {
        // We're falsy but haven't an orientation.
        check = true;
    }

    return check;
};

$(document).ready(function () {
    sr.init();
});