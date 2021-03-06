import { addEventListener } from './listener';
const MOUSE_WAIT = 2000;
export function createPointerEvents(el, pointerDown, pointerMove, pointerUp, options) {
    let rmTouchStart;
    let rmTouchMove;
    let rmTouchEnd;
    let rmTouchCancel;
    let rmMouseStart;
    let rmMouseMove;
    let rmMouseUp;
    let lastTouchEvent = 0;
    function handleTouchStart(ev) {
        lastTouchEvent = Date.now() + MOUSE_WAIT;
        if (!pointerDown(ev)) {
            return;
        }
        if (!rmTouchMove && pointerMove) {
            rmTouchMove = addEventListener(el, 'touchmove', pointerMove, options);
        }
        if (!rmTouchEnd) {
            rmTouchEnd = addEventListener(el, 'touchend', handleTouchEnd, options);
        }
        if (!rmTouchCancel) {
            rmTouchCancel = addEventListener(el, 'touchcancel', handleTouchEnd, options);
        }
    }
    function handleMouseDown(ev) {
        if (lastTouchEvent > Date.now()) {
            return;
        }
        if (!pointerDown(ev)) {
            return;
        }
        if (!rmMouseMove && pointerMove) {
            rmMouseMove = addEventListener(getDocument(el), 'mousemove', pointerMove, options);
        }
        if (!rmMouseUp) {
            rmMouseUp = addEventListener(getDocument(el), 'mouseup', handleMouseUp, options);
        }
    }
    function handleTouchEnd(ev) {
        stopTouch();
        if (pointerUp) {
            pointerUp(ev);
        }
    }
    function handleMouseUp(ev) {
        stopMouse();
        if (pointerUp) {
            pointerUp(ev);
        }
    }
    function stopTouch() {
        if (rmTouchMove) {
            rmTouchMove();
        }
        if (rmTouchEnd) {
            rmTouchEnd();
        }
        if (rmTouchCancel) {
            rmTouchCancel();
        }
        rmTouchMove = rmTouchEnd = rmTouchCancel = undefined;
    }
    function stopMouse() {
        if (rmMouseMove) {
            rmMouseMove();
        }
        if (rmMouseUp) {
            rmMouseUp();
        }
        rmMouseMove = rmMouseUp = undefined;
    }
    function stop() {
        stopTouch();
        stopMouse();
    }
    function setDisabled(disabled) {
        if (disabled) {
            if (rmTouchStart) {
                rmTouchStart();
            }
            if (rmMouseStart) {
                rmMouseStart();
            }
            rmTouchStart = rmMouseStart = undefined;
            stop();
        }
        else {
            if (!rmTouchStart) {
                rmTouchStart = addEventListener(el, 'touchstart', handleTouchStart, options);
            }
            if (!rmMouseStart) {
                rmMouseStart = addEventListener(el, 'mousedown', handleMouseDown, options);
            }
        }
    }
    function destroy() {
        setDisabled(true);
        pointerUp = pointerMove = pointerDown = undefined;
    }
    return {
        setDisabled,
        stop,
        destroy
    };
}
function getDocument(node) {
    return node instanceof Document ? node : node.ownerDocument;
}
