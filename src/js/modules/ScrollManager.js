import debounce from 'js-util/debounce';
import isiOS from 'js-util/isiOS';
import isAndroid from 'js-util/isAndroid';
import ScrollItem from './ScrollItem';
import ParallaxItem from './ParallaxItem';

export default class ScrollManager {
  constructor(opt) {
    this.elm = document.querySelectorAll('.js-scroll-item');
    this.elmParallax = document.querySelectorAll('.js-parallax-item');
    this.items = [];
    this.parallaxItems = [];
    this.scrollTop = window.pageYOffset;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.bodyResolution = {
      x: 0,
      y: 0
    };
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.isWorking = (opt && opt.isWorking !== undefined) ? opt.isWorking : true;
    this.init();
  }
  init() {
    if (this.elm.length > 0) {
      for (var i = 0; i < this.elm.length; i++) {
        this.items[i] = new ScrollItem(this.elm[i]);
      }
    }
    if (this.elmParallax.length > 0) {
      for (var i = 0; i < this.elmParallax.length; i++) {
        this.parallaxItems[i] = new ParallaxItem(this.elmParallax[i]);
      }
    }
    this.resize();
    this.on();
  }
  scrollBasis() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].show(this.scrollTop + this.resolution.y, this.scrollTop);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].scroll(this.scrollTop + this.resolution.y * 0.5);
    }
  }
  scroll() {
    this.scrollTop = window.pageYOffset;
    if (this.isWorking === false) return;
    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].init(this.scrollTop, this.resolution);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].init(this.scrollTop, this.resolution);
    }
  }
  resize(callback) {
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;
    if (this.resizePrev) this.resizePrev();
    setTimeout(() => {
      this.scrollTop = window.pageYOffset;
      this.resizeBasis();
      if (this.resizeNext) this.resizeNext();
      if (callback) callback();
    }, 100);
  }
  on() {
    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
      this.scroll(event);
    }, 400), false);
  }
}
