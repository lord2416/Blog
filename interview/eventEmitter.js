class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(name, callback) {
        if (this.listeners[name]) {
            this.listeners[name].push(callback);
        } else {
            this.listeners[name] = [callback];
        }
    }
    once(name, callback) {
        const self = this;
        const fn = (...args) => {
            callback.apply(null, args);
            self.off(name, fn);
        };
        this.on(name, fn);
    }
    emit(name, ...args) {
        const listeners = this.listeners[name];

        if (listeners) {
            for (let i = 0, len = listeners.length; i < len; i++) {
                listeners[i].apply(null, args);
            }
        }
    }
    off(name, callback) {
        const listener = this.listeners[name];

        if (listener) {
            const index = listener.indexOf(callback);
            index >= 0 && listener.splice(index, 1); 
        }
    }
}

const e = new EventEmitter();
const fn = (args) => {
    console.log('a emit', args);
};
e.on('a', fn);
e.once('b', (args) => {
    console.log('b emit', args);
});
e.emit('a', 1);
e.emit('b', 2);
e.emit('b', 3);
e.emit('a', 4);
e.off('a', fn);
e.emit('a', 5);