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
    var com = window.com || {},
        Ambiveo = function (el, options) {
            console.log('Ambiveo constructor');
            this.options = this.options || {};
            this.el = el || document;
            this.videos = this.options.class ? (this.el.getElementsByClassName(this.options.class)) : (this.el.querySelectorAll('video'));
            console.log('\tVideos: ' + this.videos);
        };
    Ambiveo.prototype = {
        fallback: function (video) {
            var img = video.querySelector('img');
            if (img){
                img.classList = video.classList;
                video.parentNode.replaceChild(img, video);
            }
        },
        init: function () {
            console.log('Ambiveo::init');
            var video,
                sourceMain, sourceFallback, sourceImage,
                _scope = this;
            for(var i = 0; i < this.videos.length; i++){
                video = this.videos[i];
                sourceMain = document.createElement('source');
                sourceMain.src = video.getAttribute('data-source-main');
                sourceFallback = document.createElement('source');
                sourceFallback.src = video.getAttribute('data-source-fallback');
                sourceFallback.onerror = function(){
                    _scope.fallback(this.parentNode);
                };
                sourceImage = document.createElement('img');
                sourceImage.src = video.getAttribute('data-source-image');

                video.appendChild(sourceMain);
                video.appendChild(sourceFallback);
                video.appendChild(sourceImage);

                video.setAttribute('data-orientation', (window.innerWidth > window.innerHeight) ? ("landscape") : ("portrait"));

            }
        }
    };

    com.ambiveo = new Ambiveo(document.getElementById('Content'), {class: 'ambiveo'});
    com.ambiveo.init();
})();
