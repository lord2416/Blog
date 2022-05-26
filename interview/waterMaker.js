export default class WaterMark {
  constructor() {
    this.container = null;
    this.defaultOption = {
      id: 'watermark-global',
      width: 300,
      preventTamper: true,
      height: 115,
      text: 'icc-watermark',
      font: '20px Times New Roman',
      rotateDegree: 30 * Math.PI / 180,
      style: {
        'pointer-events': 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'fixed',
        'z-index': 5000,
      },
    };
  }

  createImageUrl(options) {
    const canvas = document.createElement('canvas');
    const text = options.text;
    canvas.width = 300;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.rotate(20 * Math.PI / 180);
    ctx.font = '15px Microsoft JhengHei';
    ctx.fillStyle = 'rgba(17, 17, 17, 0.10)';
    // ctx.fillStyle = "rgba(0, 0, 0, .5)";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'Middle';
    ctx.fillText(text, canvas.width / 3, canvas.height / 2);
    ctx.rotate(options.rotateDegree);
    return canvas.toDataURL('image/png');
  }

  createContainer(options, forceCreate) {
    const oldDiv = document.getElementById(options.id);
    const existsOldDiv = typeof oldDiv !== 'undefined' && oldDiv !== null;
    if (!forceCreate && existsOldDiv) {
      return existsOldDiv;
    }
    const url = this.createImageUrl(options);
    const div = existsOldDiv ? oldDiv : document.createElement('div');
    div.id = options.id;

    let parentEl = options.preventTamper ? document.body : options.parentEl || document.body;

    if (typeof parentEl === 'string') {
      if (parentEl.startsWith('#')) {
        parentEl = parentEl.substring(1);
      }
      parentEl = document.getElementById(parentEl);
    }
    const rect = parentEl.getBoundingClientRect();
    options.style.left = `${options.left || rect.left}px`;
    options.style.top = `${options.top || rect.top}px`;
    div.style.cssText = this.getStyleText(options);
    div.setAttribute('class', '');
    div.style.background = `url(${url}) repeat center center`;
    !oldDiv && parentEl.appendChild(div);
    return div;
  }

  getStyleText(options) {
    let ret = '',
      style = options.style;

    Object.keys(style).forEach(k => {
      ret += `${k}:${style[k]};`;
    });

    return ret;
  }

  observe(options) {
    const self = this;
    self.container = self.createContainer(options, true);
    const target = self.container;
    const observer = new MutationObserver(() => {
      observer.disconnect();
      self.container = self.createContainer(options, true);
      const config = { attributes: true, childList: true, characterData: true, subtree: true };
      observer.observe(target, config);
    });
    const config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(target, config);
  }

  observeBody(options) {
    //  observe body element, recreate if the element is deleted
    const self = this;
    const pObserver = new MutationObserver(mutations => {
      mutations.forEach(m => {
        const length = m.removedNodes.length;
        if (m.type === 'childList' && length > 0) {
          let watermarkNodeRemoved = false;
          for (let n = 0; n < length; n++) {
            if (m.removedNodes[n].id === options.id) {
              watermarkNodeRemoved = true;
              break;
            }
          }
          if (watermarkNodeRemoved) {
            self.observe(options, true);
          }
        }
      });
    });
    pObserver.observe(document.body, { childList: true, subtree: true });
  }

  init(opt = {}) {
    const options = {
      ...this.defaultOption,
      ...opt,
    };
    this.observe(options);
    this.observeBody(options);
  }
}
