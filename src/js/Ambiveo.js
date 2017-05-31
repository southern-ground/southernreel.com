/**
 * Created by fst on 5/30/17.
 */
var Ambiveo = function (el, options) {
    console.log('Ambiveo constructor');
    this.options = this.options || {};
    this.el = el || document;
    this.videos = this.options.class ? (this.el.getElementsByClassName(this.options.class)) : (this.el.querySelectorAll('video'));
    console.log('\tVideos: ' + this.videos);
};
Ambiveo.prototype = {
    fallback: function (video) {
        var img = video.querySelector('img');
        if (img) {
            img.classList = video.classList;
            video.parentNode.replaceChild(img, video);
        }
    },
    init: function () {
        console.log('Ambiveo::init');
        var video,
            sourceMain, sourceFallback, sourceImage,
            _scope = this;
        for (var i = 0; i < this.videos.length; i++) {
            video = this.videos[i];
            sourceMain = document.createElement('source');
            sourceMain.src = video.getAttribute('data-source-main');
            sourceFallback = document.createElement('source');
            sourceFallback.src = video.getAttribute('data-source-fallback');
            sourceFallback.onerror = function () {
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
