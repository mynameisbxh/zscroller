var ZScroller = {
    /**
     * 初始化函数
     */
    init: function () {
        this._addEvent();
    },
    /*
     * 对游览器滚轮事件作了兼容处理
     * 通过调用函数 判断 event.delta 是否大于还是小于0 判断是向上滚动还是向下滚动
     * win7 火狐游览器判断是向下 是通过event.detail这个属性判断 如果是-3的话 那么向下 或者如果是3的话 那么向上
     * win7 其他游览器是通过event.wheelDelta来判断 如果是-120的话 那么向下 否则120的话 是向上
     */
    _addEvent: function () {
        var EventProcess = function (event) {
            var type = event.type;
            if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }
            if (event.srcElement && !event.target) {
                event.target = event.srcElement;
            }
            if (!event.preventDefault && event.returnValue !== undefined) {
                event.preventDefault = function () {
                    event.returnValue = false;
                };
            }
            return event;
        }
        if (window.addEventListener) {
            return function (el, type, fn, capture) {
                if (type === "mousewheel" && document.mozHidden !== undefined) {
                    type = "DOMMouseScroll";
                }
                el.addEventListener(type, function (event) {
                    fn.call(this, EventProcess(event));
                }, capture || false);
            }
        } else if (window.attachEvent) {
            return function (el, type, fn, capture) {
                el.attachEvent("on" + type, function (event) {
                    event = event || window.event;
                    fn.call(el, EventProcess(event));
                });
            }
        }
    }
}