/* Base/WebInspector.js */

/*
 * Copyright (C) 2013 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

var WI = {}; // Namespace

/* Base/LinkedList.js */

/*
 * Copyright (C) 2016 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

class LinkedList
{
    constructor()
    {
        this.head = new LinkedListNode;
        this.head.next = this.head.prev = this.head;
        this.length = 0;
    }

    clear()
    {
        this.head.next = this.head.prev = this.head;
        this.length = 0;
    }

    get last()
    {
        return this.head.prev;
    }

    push(item)
    {
        let newNode = new LinkedListNode(item);
        let last = this.last;
        let head = this.head;

        last.next = newNode;
        newNode.next = head;
        head.prev = newNode;
        newNode.prev = last;

        this.length++;

        return newNode;
    }

    remove(node)
    {
        if (!node)
            return false;

        node.prev.next = node.next;
        node.next.prev = node.prev;

        this.length--;
        return true;
    }

    forEach(callback)
    {
        let node = this.head;
        for (let i = 0, length = this.length; i < length; i++) {
            node = node.next;
            let returnValue = callback(node.value, i);
            if (returnValue === false)
                return;
        }
    }

    toArray()
    {
        let node = this.head;
        let i = this.length;
        let result = new Array(i);
        while (i--) {
            node = node.prev;
            result[i] = node.value;
        }
        return result;
    }

    toJSON()
    {
        return this.toArray();
    }
}


class LinkedListNode
{
    constructor(value)
    {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

/* Base/ListMultimap.js */

/*
 * Copyright (C) 2016 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

class ListMultimap
{
    constructor()
    {
        this._insertionOrderedEntries = new LinkedList;
        this._keyMap = new Map;
    }

    get size()
    {
        return this._insertionOrderedEntries.length;
    }

    add(key, value)
    {
        let nodeMap = this._keyMap.get(key);
        if (!nodeMap) {
            nodeMap = new Map;
            this._keyMap.set(key, nodeMap);
        }

        let node = nodeMap.get(value);
        if (!node) {
            node = this._insertionOrderedEntries.push([key, value]);
            nodeMap.set(value, node);
        }

        return this;
    }

    delete(key, value)
    {
        let nodeMap = this._keyMap.get(key);
        if (!nodeMap)
            return false;

        let node = nodeMap.get(value);
        if (!node)
            return false;

        nodeMap.delete(value);
        this._insertionOrderedEntries.remove(node);
        return true;
    }

    deleteAll(key)
    {
        let nodeMap = this._keyMap.get(key);
        if (!nodeMap)
            return false;

        let list = this._insertionOrderedEntries;
        let didDelete = false;
        nodeMap.forEach(function(node) {
            list.remove(node);
            didDelete = true;
        });

        this._keyMap.delete(key);
        return didDelete;
    }

    has(key, value)
    {
        let nodeMap = this._keyMap.get(key);
        if (!nodeMap)
            return false;

        return nodeMap.has(value);
    }

    clear()
    {
        this._keyMap = new Map;
        this._insertionOrderedEntries = new LinkedList;
    }

    forEach(callback)
    {
        this._insertionOrderedEntries.forEach(callback);
    }

    toArray()
    {
        return this._insertionOrderedEntries.toArray();
    }

    toJSON()
    {
        return this.toArray();
    }
}

/* Base/Object.js */

/*
 * Copyright (C) 2008, 2013 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WI.Object = class WebInspectorObject
{
    constructor()
    {
        this._listeners = null;
    }

    // Static

    static addEventListener(eventType, listener, thisObject)
    {
        thisObject = thisObject || null;

        console.assert(eventType, "Object.addEventListener: invalid event type ", eventType, "(listener: ", listener, "thisObject: ", thisObject, ")");
        if (!eventType)
            return null;

        console.assert(listener, "Object.addEventListener: invalid listener ", listener, "(event type: ", eventType, "thisObject: ", thisObject, ")");
        if (!listener)
            return null;

        if (!this._listeners)
            this._listeners = new Map();

        let listenersTable = this._listeners.get(eventType);
        if (!listenersTable) {
            listenersTable = new ListMultimap();
            this._listeners.set(eventType, listenersTable);
        }

        listenersTable.add(thisObject, listener);
        return listener;
    }

    static singleFireEventListener(eventType, listener, thisObject)
    {
        let wrappedCallback = function() {
            this.removeEventListener(eventType, wrappedCallback, null);
            listener.apply(thisObject, arguments);
        }.bind(this);

        this.addEventListener(eventType, wrappedCallback, null);
        return wrappedCallback;
    }

    static removeEventListener(eventType, listener, thisObject)
    {
        eventType = eventType || null;
        listener = listener || null;
        thisObject = thisObject || null;

        if (!this._listeners)
            return;

        if (thisObject && !eventType) {
            this._listeners.forEach(function(listenersTable) {
                let listenerPairs = listenersTable.toArray();
                for (let i = 0, length = listenerPairs.length; i < length; ++i) {
                    let existingThisObject = listenerPairs[i][0];
                    if (existingThisObject === thisObject)
                        listenersTable.deleteAll(existingThisObject);
                }
            });

            return;
        }

        let listenersTable = this._listeners.get(eventType);
        if (!listenersTable || listenersTable.size === 0)
            return;

        let didDelete = listenersTable.delete(thisObject, listener);
        console.assert(didDelete, "removeEventListener cannot remove " + eventType.toString() + " because it doesn't exist.");
    }

    static awaitEvent(eventType)
    {
        let wrapper = new WI.WrappedPromise;
        this.singleFireEventListener(eventType, (event) => wrapper.resolve(event));
        return wrapper.promise;
    }

    // Only used by tests.
    static hasEventListeners(eventType)
    {
        if (!this._listeners)
            return false;

        let listenersTable = this._listeners.get(eventType);
        return listenersTable && listenersTable.size > 0;
    }

    // This should only be used within regression tests to detect leaks.
    static retainedObjectsWithPrototype(proto)
    {
        let results = new Set;

        if (this._listeners) {
            this._listeners.forEach(function(listenersTable, eventType) {
                listenersTable.forEach(function(pair) {
                    let thisObject = pair[0];
                    if (thisObject instanceof proto)
                        results.add(thisObject);
                });
            });
        }

        return results;
    }

    // Public

    addEventListener() { return WI.Object.addEventListener.apply(this, arguments); }
    singleFireEventListener() { return WI.Object.singleFireEventListener.apply(this, arguments); }
    removeEventListener() { return WI.Object.removeEventListener.apply(this, arguments); }
    awaitEvent() { return WI.Object.awaitEvent.apply(this, arguments); }
    hasEventListeners() { return WI.Object.hasEventListeners.apply(this, arguments); }
    retainedObjectsWithPrototype() { return WI.Object.retainedObjectsWithPrototype.apply(this, arguments); }

    dispatchEventToListeners(eventType, eventData)
    {
        let event = new WI.Event(this, eventType, eventData);

        function dispatch(object)
        {
            if (!object || event._stoppedPropagation)
                return;

            let listenerTypesMap = object._listeners;
            if (!listenerTypesMap || !object.hasOwnProperty("_listeners"))
                return;

            console.assert(listenerTypesMap instanceof Map);

            let listenersTable = listenerTypesMap.get(eventType);
            if (!listenersTable)
                return;

            // Make a copy with slice so mutations during the loop doesn't affect us.
            let listeners = listenersTable.toArray();

            // Iterate over the listeners and call them. Stop if stopPropagation is called.
            for (let i = 0, length = listeners.length; i < length; ++i) {
                let [thisObject, listener] = listeners[i];
                listener.call(thisObject, event);
                if (event._stoppedPropagation)
                    break;
            }
        }

        // Dispatch to listeners of this specific object.
        dispatch(this);

        // Allow propagation again so listeners on the constructor always have a crack at the event.
        event._stoppedPropagation = false;

        // Dispatch to listeners on all constructors up the prototype chain, including the immediate constructor.
        let constructor = this.constructor;
        while (constructor) {
            dispatch(constructor);

            if (!constructor.prototype.__proto__)
                break;

            constructor = constructor.prototype.__proto__.constructor;
        }

        return event.defaultPrevented;
    }
};

WI.Event = class Event
{
    constructor(target, type, data)
    {
        this.target = target;
        this.type = type;
        this.data = data;
        this.defaultPrevented = false;
        this._stoppedPropagation = false;
    }

    stopPropagation()
    {
        this._stoppedPropagation = true;
    }

    preventDefault()
    {
        this.defaultPrevented = true;
    }
};

WI.notifications = new WI.Object;

WI.Notification = {
    GlobalModifierKeysDidChange: "global-modifiers-did-change",
    PageArchiveStarted: "page-archive-started",
    PageArchiveEnded: "page-archive-ended",
    ExtraDomainsActivated: "extra-domains-activated",
    DebugUIEnabledDidChange: "debug-ui-enabled-did-change",
    VisibilityStateDidChange: "visibility-state-did-change",
};

/* Base/Utilities.js */

/*
 * Copyright (C) 2013 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

var emDash = "\u2014";
var enDash = "\u2013";
var figureDash = "\u2012";
var ellipsis = "\u2026";
var zeroWidthSpace = "\u200b";
var multiplicationSign = "\u00d7";

Object.defineProperty(Object, "shallowCopy",
{
    value(object)
    {
        // Make a new object and copy all the key/values. The values are not copied.
        var copy = {};
        var keys = Object.keys(object);
        for (var i = 0; i < keys.length; ++i)
            copy[keys[i]] = object[keys[i]];
        return copy;
    }
});

Object.defineProperty(Object, "shallowEqual",
{
    value(a, b)
    {
        // Checks if two objects have the same top-level properties.

        if (!(a instanceof Object) || !(b instanceof Object))
            return false;

        if (a === b)
            return true;

        if (Array.shallowEqual(a, b))
            return true;

        if (a.constructor !== b.constructor)
            return false;

        let aKeys = Object.keys(a);
        let bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length)
            return false;

        for (let aKey of aKeys) {
            if (!(aKey in b))
                return false;

            let aValue = a[aKey];
            let bValue = b[aKey];
            if (aValue !== bValue && !Array.shallowEqual(aValue, bValue))
                return false;
        }

        return true;
    }
});

Object.defineProperty(Object.prototype, "valueForCaseInsensitiveKey",
{
    value(key)
    {
        if (this.hasOwnProperty(key))
            return this[key];

        var lowerCaseKey = key.toLowerCase();
        for (var currentKey in this) {
            if (currentKey.toLowerCase() === lowerCaseKey)
                return this[currentKey];
        }

        return undefined;
    }
});

Object.defineProperty(Map, "fromObject",
{
    value(object)
    {
        let map = new Map;
        for (let key in object)
            map.set(key, object[key]);
        return map;
    }
});

Object.defineProperty(Map.prototype, "take",
{
    value(key)
    {
        var deletedValue = this.get(key);
        this.delete(key);
        return deletedValue;
    }
});

Object.defineProperty(Node.prototype, "enclosingNodeOrSelfWithClass",
{
    value(className)
    {
        for (let node = this; node; node = node.parentElement) {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains(className))
                return node;
        }

        return null;
    }
});

Object.defineProperty(Node.prototype, "enclosingNodeOrSelfWithNodeNameInArray",
{
    value(nodeNames)
    {
        let upperCaseNodeNames = nodeNames.map((name) => name.toUpperCase());

        for (let node = this; node; node = node.parentElement) {
            for (let nodeName of upperCaseNodeNames) {
                if (node.nodeName === nodeName)
                    return node;
            }
        }

        return null;
    }
});

Object.defineProperty(Node.prototype, "enclosingNodeOrSelfWithNodeName",
{
    value(nodeName)
    {
        return this.enclosingNodeOrSelfWithNodeNameInArray([nodeName]);
    }
});

Object.defineProperty(Node.prototype, "traverseNextNode",
{
    value(stayWithin)
    {
        var node = this.firstChild;
        if (node)
            return node;

        if (stayWithin && this === stayWithin)
            return null;

        node = this.nextSibling;
        if (node)
            return node;

        node = this;
        while (node && !node.nextSibling && (!stayWithin || !node.parentNode || node.parentNode !== stayWithin))
            node = node.parentNode;
        if (!node)
            return null;

        return node.nextSibling;
    }
});

Object.defineProperty(Node.prototype, "traversePreviousNode",
{
    value(stayWithin)
    {
       if (stayWithin && this === stayWithin)
            return null;
        var node = this.previousSibling;
        while (node && node.lastChild)
            node = node.lastChild;
        if (node)
            return node;
        return this.parentNode;
    }
});


Object.defineProperty(Node.prototype, "rangeOfWord",
{
    value(offset, stopCharacters, stayWithinNode, direction)
    {
        var startNode;
        var startOffset = 0;
        var endNode;
        var endOffset = 0;

        if (!stayWithinNode)
            stayWithinNode = this;

        if (!direction || direction === "backward" || direction === "both") {
            var node = this;
            while (node) {
                if (node === stayWithinNode) {
                    if (!startNode)
                        startNode = stayWithinNode;
                    break;
                }

                if (node.nodeType === Node.TEXT_NODE) {
                    let start = node === this ? (offset - 1) : (node.nodeValue.length - 1);
                    for (var i = start; i >= 0; --i) {
                        if (stopCharacters.indexOf(node.nodeValue[i]) !== -1) {
                            startNode = node;
                            startOffset = i + 1;
                            break;
                        }
                    }
                }

                if (startNode)
                    break;

                node = node.traversePreviousNode(stayWithinNode);
            }

            if (!startNode) {
                startNode = stayWithinNode;
                startOffset = 0;
            }
        } else {
            startNode = this;
            startOffset = offset;
        }

        if (!direction || direction === "forward" || direction === "both") {
            node = this;
            while (node) {
                if (node === stayWithinNode) {
                    if (!endNode)
                        endNode = stayWithinNode;
                    break;
                }

                if (node.nodeType === Node.TEXT_NODE) {
                    let start = node === this ? offset : 0;
                    for (var i = start; i < node.nodeValue.length; ++i) {
                        if (stopCharacters.indexOf(node.nodeValue[i]) !== -1) {
                            endNode = node;
                            endOffset = i;
                            break;
                        }
                    }
                }

                if (endNode)
                    break;

                node = node.traverseNextNode(stayWithinNode);
            }

            if (!endNode) {
                endNode = stayWithinNode;
                endOffset = stayWithinNode.nodeType === Node.TEXT_NODE ? stayWithinNode.nodeValue.length : stayWithinNode.childNodes.length;
            }
        } else {
            endNode = this;
            endOffset = offset;
        }

        var result = this.ownerDocument.createRange();
        result.setStart(startNode, startOffset);
        result.setEnd(endNode, endOffset);

        return result;

    }
});

Object.defineProperty(Element.prototype, "realOffsetWidth",
{
    get()
    {
        return this.getBoundingClientRect().width;
    }
});

Object.defineProperty(Element.prototype, "realOffsetHeight",
{
    get()
    {
        return this.getBoundingClientRect().height;
    }
});

Object.defineProperty(Element.prototype, "totalOffsetLeft",
{
    get()
    {
        return this.getBoundingClientRect().left;
    }
});

Object.defineProperty(Element.prototype, "totalOffsetRight",
{
    get()
    {
        return this.getBoundingClientRect().right;
    }
});

Object.defineProperty(Element.prototype, "totalOffsetTop",
{
    get()
    {
        return this.getBoundingClientRect().top;
    }
});

Object.defineProperty(Element.prototype, "removeChildren",
{
    value()
    {
        // This has been tested to be the fastest removal method.
        if (this.firstChild)
            this.textContent = "";
    }
});

Object.defineProperty(Element.prototype, "isInsertionCaretInside",
{
    value()
    {
        var selection = window.getSelection();
        if (!selection.rangeCount || !selection.isCollapsed)
            return false;
        var selectionRange = selection.getRangeAt(0);
        return selectionRange.startContainer === this || this.contains(selectionRange.startContainer);
    }
});

Object.defineProperty(Element.prototype, "removeMatchingStyleClasses",
{
    value(classNameRegex)
    {
        var regex = new RegExp("(^|\\s+)" + classNameRegex + "($|\\s+)");
        if (regex.test(this.className))
            this.className = this.className.replace(regex, " ");
    }
});

Object.defineProperty(Element.prototype, "createChild",
{
    value(elementName, className)
    {
        var element = this.ownerDocument.createElement(elementName);
        if (className)
            element.className = className;
        this.appendChild(element);
        return element;
    }
});

Object.defineProperty(Element.prototype, "isScrolledToBottom",
{
    value()
    {
        // This code works only for 0-width border
        return this.scrollTop + this.clientHeight === this.scrollHeight;
    }
});

Object.defineProperty(Element.prototype, "recalculateStyles",
{
    value()
    {
        this.ownerDocument.defaultView.getComputedStyle(this);
    }
});

Object.defineProperty(DocumentFragment.prototype, "createChild",
{
    value: Element.prototype.createChild
});

Object.defineProperty(Event.prototype, "stop",
{
    value()
    {
        this.stopImmediatePropagation();
        this.preventDefault();
    }
});

Object.defineProperty(Array, "shallowEqual",
{
    value(a, b)
    {
        if (!Array.isArray(a) || !Array.isArray(b))
            return false;

        if (a === b)
            return true;

        let length = a.length;

        if (length !== b.length)
            return false;

        for (let i = 0; i < length; ++i) {
            if (a[i] === b[i])
                continue;

            if (!Object.shallowEqual(a[i], b[i]))
                return false;
        }

        return true;
    }
});

Object.defineProperty(Array.prototype, "lastValue",
{
    get()
    {
        if (!this.length)
            return undefined;
        return this[this.length - 1];
    }
});

Object.defineProperty(Array.prototype, "remove",
{
    value(value)
    {
        for (let i = 0; i < this.length; ++i) {
            if (this[i] === value) {
                this.splice(i, 1);
                return;
            }
        }
    }
});

Object.defineProperty(Array.prototype, "removeAll",
{
    value(value)
    {
        for (let i = this.length - 1; i >= 0; --i) {
            if (this[i] === value)
                this.splice(i, 1);
        }
    }
});

Object.defineProperty(Array.prototype, "toggleIncludes",
{
    value(value, force)
    {
        let exists = this.includes(value);
        if (exists === !!force)
            return;

        if (exists)
            this.remove(value);
        else
            this.push(value);
    }
});

Object.defineProperty(Array.prototype, "insertAtIndex",
{
    value(value, index)
    {
        this.splice(index, 0, value);
    }
});

Object.defineProperty(Array.prototype, "keySet",
{
    value()
    {
        let keys = Object.create(null);
        for (var i = 0; i < this.length; ++i)
            keys[this[i]] = true;
        return keys;
    }
});

Object.defineProperty(Array.prototype, "partition",
{
    value(callback)
    {
        let positive = [];
        let negative = [];
        for (let i = 0; i < this.length; ++i) {
            let value = this[i];
            if (callback(value))
                positive.push(value);
            else
                negative.push(value);
        }
        return [positive, negative];
    }
});

Object.defineProperty(String.prototype, "isLowerCase",
{
    value()
    {
        return String(this) === this.toLowerCase();
    }
});

Object.defineProperty(String.prototype, "isUpperCase",
{
    value()
    {
        return String(this) === this.toUpperCase();
    }
});

Object.defineProperty(String.prototype, "truncateMiddle",
{
    value(maxLength)
    {
        "use strict";

        if (this.length <= maxLength)
            return this;
        var leftHalf = maxLength >> 1;
        var rightHalf = maxLength - leftHalf - 1;
        return this.substr(0, leftHalf) + ellipsis + this.substr(this.length - rightHalf, rightHalf);
    }
});

Object.defineProperty(String.prototype, "truncateEnd",
{
    value(maxLength)
    {
        "use strict";

        if (this.length <= maxLength)
            return this;
        return this.substr(0, maxLength - 1) + ellipsis;
    }
});

Object.defineProperty(String.prototype, "truncate",
{
    value(maxLength)
    {
        "use strict";

        if (this.length <= maxLength)
            return this;

        let clipped = this.slice(0, maxLength);
        let indexOfLastWhitespace = clipped.search(/\s\S*$/);
        if (indexOfLastWhitespace > Math.floor(maxLength / 2))
            clipped = clipped.slice(0, indexOfLastWhitespace - 1);

        return clipped + ellipsis;
    }
});

Object.defineProperty(String.prototype, "collapseWhitespace",
{
    value()
    {
        return this.replace(/[\s\xA0]+/g, " ");
    }
});

Object.defineProperty(String.prototype, "removeWhitespace",
{
    value()
    {
        return this.replace(/[\s\xA0]+/g, "");
    }
});

Object.defineProperty(String.prototype, "escapeCharacters",
{
    value(charactersToEscape)
    {
        if (!charactersToEscape)
            return this.valueOf();

        let charactersToEscapeSet = new Set(charactersToEscape);

        let foundCharacter = false;
        for (let c of this) {
            if (!charactersToEscapeSet.has(c))
                continue;
            foundCharacter = true;
            break;
        }

        if (!foundCharacter)
            return this.valueOf();

        let result = "";
        for (let c of this) {
            if (charactersToEscapeSet.has(c))
                result += "\\";
            result += c;
        }

        return result.valueOf();
    }
});

Object.defineProperty(String.prototype, "escapeForRegExp",
{
    value()
    {
        return this.escapeCharacters("^[]{}()\\.$*+?|");
    }
});

Object.defineProperty(String.prototype, "capitalize",
{
    value()
    {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
});

Object.defineProperty(String.prototype, "extendedLocaleCompare",
{
    value(other)
    {
        return this.localeCompare(other, undefined, {numeric: true});
    }
});

Object.defineProperty(String, "tokenizeFormatString",
{
    value(format)
    {
        var tokens = [];
        var substitutionIndex = 0;

        function addStringToken(str)
        {
            tokens.push({type: "string", value: str});
        }

        function addSpecifierToken(specifier, precision, substitutionIndex)
        {
            tokens.push({type: "specifier", specifier, precision, substitutionIndex});
        }

        var index = 0;
        for (var precentIndex = format.indexOf("%", index); precentIndex !== -1; precentIndex = format.indexOf("%", index)) {
            addStringToken(format.substring(index, precentIndex));
            index = precentIndex + 1;

            if (format[index] === "%") {
                addStringToken("%");
                ++index;
                continue;
            }

            if (!isNaN(format[index])) {
                // The first character is a number, it might be a substitution index.
                var number = parseInt(format.substring(index), 10);
                while (!isNaN(format[index]))
                    ++index;

                // If the number is greater than zero and ends with a "$",
                // then this is a substitution index.
                if (number > 0 && format[index] === "$") {
                    substitutionIndex = (number - 1);
                    ++index;
                }
            }

            const defaultPrecision = 6;

            let precision = defaultPrecision;
            if (format[index] === ".") {
                // This is a precision specifier. If no digit follows the ".",
                // then use the default precision of six digits (ISO C99 specification).
                ++index;

                precision = parseInt(format.substring(index), 10);
                if (isNaN(precision))
                    precision = defaultPrecision;

                while (!isNaN(format[index]))
                    ++index;
            }

            addSpecifierToken(format[index], precision, substitutionIndex);

            ++substitutionIndex;
            ++index;
        }

        addStringToken(format.substring(index));

        return tokens;
    }
});

Object.defineProperty(String.prototype, "lineCount",
{
    get()
    {
        "use strict";

        let lineCount = 1;
        let index = 0;
        while (true) {
            index = this.indexOf("\n", index);
            if (index === -1)
                return lineCount;

            index += "\n".length;
            lineCount++;
        }
    }
});

Object.defineProperty(String.prototype, "lastLine",
{
    get()
    {
        "use strict";

        let index = this.lastIndexOf("\n");
        if (index === -1)
            return this;

        return this.slice(index + "\n".length);
    }
});

Object.defineProperty(String.prototype, "hash",
{
    get()
    {
        // Matches the wtf/Hasher.h (SuperFastHash) algorithm.

        // Arbitrary start value to avoid mapping all 0's to all 0's.
        const stringHashingStartValue = 0x9e3779b9;

        var result = stringHashingStartValue;
        var pendingCharacter = null;
        for (var i = 0; i < this.length; ++i) {
            var currentCharacter = this[i].charCodeAt(0);
            if (pendingCharacter === null) {
                pendingCharacter = currentCharacter;
                continue;
            }

            result += pendingCharacter;
            result = (result << 16) ^ ((currentCharacter << 11) ^ result);
            result += result >> 11;

            pendingCharacter = null;
        }

        // Handle the last character in odd length strings.
        if (pendingCharacter !== null) {
            result += pendingCharacter;
            result ^= result << 11;
            result += result >> 17;
        }

        // Force "avalanching" of final 31 bits.
        result ^= result << 3;
        result += result >> 5;
        result ^= result << 2;
        result += result >> 15;
        result ^= result << 10;

        // Prevent 0 and negative results.
        return (0xffffffff + result + 1).toString(36);
    }
});

Object.defineProperty(String, "standardFormatters",
{
    value: {
        d: function(substitution)
        {
            return parseInt(substitution).toLocaleString();
        },

        f: function(substitution, token)
        {
            let value = parseFloat(substitution);
            if (isNaN(value))
                return NaN;

            let options = {
                minimumFractionDigits: token.precision,
                maximumFractionDigits: token.precision,
                useGrouping: false
            };
            return value.toLocaleString(undefined, options);
        },

        s: function(substitution)
        {
            return substitution;
        }
    }
});

Object.defineProperty(String, "format",
{
    value(format, substitutions, formatters, initialValue, append)
    {
        if (!format || !substitutions || !substitutions.length)
            return {formattedResult: append(initialValue, format), unusedSubstitutions: substitutions};

        function prettyFunctionName()
        {
            return "String.format(\"" + format + "\", \"" + Array.from(substitutions).join("\", \"") + "\")";
        }

        function warn(msg)
        {
            console.warn(prettyFunctionName() + ": " + msg);
        }

        function error(msg)
        {
            console.error(prettyFunctionName() + ": " + msg);
        }

        var result = initialValue;
        var tokens = String.tokenizeFormatString(format);
        var usedSubstitutionIndexes = {};

        for (var i = 0; i < tokens.length; ++i) {
            var token = tokens[i];

            if (token.type === "string") {
                result = append(result, token.value);
                continue;
            }

            if (token.type !== "specifier") {
                error("Unknown token type \"" + token.type + "\" found.");
                continue;
            }

            if (token.substitutionIndex >= substitutions.length) {
                // If there are not enough substitutions for the current substitutionIndex
                // just output the format specifier literally and move on.
                error("not enough substitution arguments. Had " + substitutions.length + " but needed " + (token.substitutionIndex + 1) + ", so substitution was skipped.");
                result = append(result, "%" + (token.precision > -1 ? token.precision : "") + token.specifier);
                continue;
            }

            usedSubstitutionIndexes[token.substitutionIndex] = true;

            if (!(token.specifier in formatters)) {
                // Encountered an unsupported format character, treat as a string.
                warn("unsupported format character \u201C" + token.specifier + "\u201D. Treating as a string.");
                result = append(result, substitutions[token.substitutionIndex]);
                continue;
            }

            result = append(result, formatters[token.specifier](substitutions[token.substitutionIndex], token));
        }

        var unusedSubstitutions = [];
        for (var i = 0; i < substitutions.length; ++i) {
            if (i in usedSubstitutionIndexes)
                continue;
            unusedSubstitutions.push(substitutions[i]);
        }

        return {formattedResult: result, unusedSubstitutions};
    }
});

Object.defineProperty(String.prototype, "format",
{
    value()
    {
        return String.format(this, arguments, String.standardFormatters, "", function(a, b) { return a + b; }).formattedResult;
    }
});

Object.defineProperty(String.prototype, "insertWordBreakCharacters",
{
    value()
    {
        // Add zero width spaces after characters that are good to break after.
        // Otherwise a string with no spaces will not break and overflow its container.
        // This is mainly used on URL strings, so the characters are tailored for URLs.
        return this.replace(/([\/;:\)\]\}&?])/g, "$1\u200b");
    }
});

Object.defineProperty(String.prototype, "removeWordBreakCharacters",
{
    value()
    {
        // Undoes what insertWordBreakCharacters did.
        return this.replace(/\u200b/g, "");
    }
});

Object.defineProperty(String.prototype, "getMatchingIndexes",
{
    value(needle)
    {
        var indexesOfNeedle = [];
        var index = this.indexOf(needle);

        while (index >= 0) {
            indexesOfNeedle.push(index);
            index = this.indexOf(needle, index + 1);
        }

        return indexesOfNeedle;
    }
});

Object.defineProperty(String.prototype, "levenshteinDistance",
{
    value(s)
    {
        var m = this.length;
        var n = s.length;
        var d = new Array(m + 1);

        for (var i = 0; i <= m; ++i) {
            d[i] = new Array(n + 1);
            d[i][0] = i;
        }

        for (var j = 0; j <= n; ++j)
            d[0][j] = j;

        for (var j = 1; j <= n; ++j) {
            for (var i = 1; i <= m; ++i) {
                if (this[i - 1] === s[j - 1])
                    d[i][j] = d[i - 1][j - 1];
                else {
                    var deletion = d[i - 1][j] + 1;
                    var insertion = d[i][j - 1] + 1;
                    var substitution = d[i - 1][j - 1] + 1;
                    d[i][j] = Math.min(deletion, insertion, substitution);
                }
            }
        }

        return d[m][n];
    }
});

Object.defineProperty(String.prototype, "toCamelCase",
{
    value()
    {
        return this.toLowerCase().replace(/[^\w]+(\w)/g, (match, group) => group.toUpperCase());
    }
});

Object.defineProperty(String.prototype, "hasMatchingEscapedQuotes",
{
    value()
    {
        return /^\"(?:[^\"\\]|\\.)*\"$/.test(this) || /^\'(?:[^\'\\]|\\.)*\'$/.test(this);
    }
});

Object.defineProperty(Math, "roundTo",
{
    value(num, step)
    {
        return Math.round(num / step) * step;
    }
});

Object.defineProperty(Number, "constrain",
{
    value(num, min, max)
    {
        if (isNaN(num) || max < min)
            return min;

        if (num < min)
            num = min;
        else if (num > max)
            num = max;
        return num;
    }
});

Object.defineProperty(Number, "percentageString",
{
    value(fraction, precision = 1)
    {
        return fraction.toLocaleString(undefined, {minimumFractionDigits: precision, style: "percent"});
    }
});

Object.defineProperty(Number, "secondsToMillisecondsString",
{
    value(seconds, higherResolution)
    {
        let ms = seconds * 1000;

        if (higherResolution)
            return WI.UIString("%.2fms").format(ms);
        return WI.UIString("%.1fms").format(ms);
    }
});

Object.defineProperty(Number, "secondsToString",
{
    value(seconds, higherResolution)
    {
        let ms = seconds * 1000;
        if (!ms)
            return WI.UIString("%.0fms").format(0);

        const epsilon = 0.0001;

        if (Math.abs(ms) < (10 + epsilon)) {
            if (higherResolution)
                return WI.UIString("%.3fms").format(ms);
            return WI.UIString("%.2fms").format(ms);
        }

        if (Math.abs(ms) < (100 + epsilon)) {
            if (higherResolution)
                return WI.UIString("%.2fms").format(ms);
            return WI.UIString("%.1fms").format(ms);
        }

        if (Math.abs(ms) < (1000 + epsilon)) {
            if (higherResolution)
                return WI.UIString("%.1fms").format(ms);
            return WI.UIString("%.0fms").format(ms);
        }

        // Do not go over seconds when in high resolution mode.
        if (higherResolution || Math.abs(seconds) < 60)
            return WI.UIString("%.2fs").format(seconds);

        let minutes = seconds / 60;
        if (Math.abs(minutes) < 60)
            return WI.UIString("%.1fmin").format(minutes);

        let hours = minutes / 60;
        if (Math.abs(hours) < 24)
            return WI.UIString("%.1fhrs").format(hours);

        let days = hours / 24;
        return WI.UIString("%.1f days").format(days);
    }
});

Object.defineProperty(Number, "bytesToString",
{
    value(bytes, higherResolution)
    {
        if (higherResolution === undefined)
            higherResolution = true;

        if (Math.abs(bytes) < 1024)
            return WI.UIString("%.0f B").format(bytes);

        let kilobytes = bytes / 1024;
        if (Math.abs(kilobytes) < 1024) {
            if (higherResolution || Math.abs(kilobytes) < 10)
                return WI.UIString("%.2f KB").format(kilobytes);
            return WI.UIString("%.1f KB").format(kilobytes);
        }

        let megabytes = kilobytes / 1024;
        if (Math.abs(megabytes) < 1024) {
            if (higherResolution || Math.abs(megabytes) < 10)
                return WI.UIString("%.2f MB").format(megabytes);
            return WI.UIString("%.1f MB").format(megabytes);
        }

        let gigabytes = megabytes / 1024;
        if (higherResolution || Math.abs(gigabytes) < 10)
            return WI.UIString("%.2f GB").format(gigabytes);
        return WI.UIString("%.1f GB").format(gigabytes);
    }
});

Object.defineProperty(Number, "abbreviate",
{
    value(num)
    {
        if (num < 1000)
            return num.toLocaleString();

        if (num < 1000000)
            return WI.UIString("%.1fK").format(Math.round(num / 100) / 10);

        if (num < 1000000000)
            return WI.UIString("%.1fM").format(Math.round(num / 100000) / 10);

        return WI.UIString("%.1fB").format(Math.round(num / 100000000) / 10);
    }
});

Object.defineProperty(Number, "zeroPad",
{
    value(num, length)
    {
        let string = num.toLocaleString();
        return string.padStart(length, "0");
    },
});

Object.defineProperty(Number, "countDigits",
{
    value(num)
    {
        if (num === 0)
            return 1;

        num = Math.abs(num);
        return Math.floor(Math.log(num) * Math.LOG10E) + 1;
    }
});

Object.defineProperty(Number.prototype, "maxDecimals",
{
    value(decimals)
    {
        let power = 10 ** decimals;
        return Math.round(this * power) / power;
    }
});

Object.defineProperty(Uint32Array, "isLittleEndian",
{
    value()
    {
        if ("_isLittleEndian" in this)
            return this._isLittleEndian;

        var buffer = new ArrayBuffer(4);
        var longData = new Uint32Array(buffer);
        var data = new Uint8Array(buffer);

        longData[0] = 0x0a0b0c0d;

        this._isLittleEndian = data[0] === 0x0d && data[1] === 0x0c && data[2] === 0x0b && data[3] === 0x0a;

        return this._isLittleEndian;
    }
});

function isEmptyObject(object)
{
    for (var property in object)
        return false;
    return true;
}

function isEnterKey(event)
{
    // Check if this is an IME event.
    return event.keyCode !== 229 && event.keyIdentifier === "Enter";
}

function resolveDotsInPath(path)
{
    if (!path)
        return path;

    if (path.indexOf("./") === -1)
        return path;

    console.assert(path.charAt(0) === "/");

    var result = [];

    var components = path.split("/");
    for (var i = 0; i < components.length; ++i) {
        var component = components[i];

        // Skip over "./".
        if (component === ".")
            continue;

        // Rewind one component for "../".
        if (component === "..") {
            if (result.length === 1)
                continue;
            result.pop();
            continue;
        }

        result.push(component);
    }

    return result.join("/");
}

function parseMIMEType(fullMimeType)
{
    if (!fullMimeType)
        return {type: fullMimeType, boundary: null, encoding: null};

    var typeParts = fullMimeType.split(/\s*;\s*/);
    console.assert(typeParts.length >= 1);

    var type = typeParts[0];
    var boundary = null;
    var encoding = null;

    for (var i = 1; i < typeParts.length; ++i) {
        var subparts = typeParts[i].split(/\s*=\s*/);
        if (subparts.length !== 2)
            continue;

        if (subparts[0].toLowerCase() === "boundary")
            boundary = subparts[1];
        else if (subparts[0].toLowerCase() === "charset")
            encoding = subparts[1].replace("^\"|\"$", ""); // Trim quotes.
    }

    return {type, boundary: boundary || null, encoding: encoding || null};
}

function simpleGlobStringToRegExp(globString, regExpFlags)
{
    // Only supports "*" globs.

    if (!globString)
        return null;

    // Escape everything from String.prototype.escapeForRegExp except "*".
    var regexString = globString.escapeCharacters("^[]{}()\\.$+?|");

    // Unescape all doubly escaped backslashes in front of escaped asterisks.
    // So "\\*" will become "\*" again, undoing escapeCharacters escaping of "\".
    // This makes "\*" match a literal "*" instead of using the "*" for globbing.
    regexString = regexString.replace(/\\\\\*/g, "\\*");

    // The following regex doesn't match an asterisk that has a backslash in front.
    // It also catches consecutive asterisks so they collapse down when replaced.
    var unescapedAsteriskRegex = /(^|[^\\])\*+/g;
    if (unescapedAsteriskRegex.test(globString)) {
        // Replace all unescaped asterisks with ".*".
        regexString = regexString.replace(unescapedAsteriskRegex, "$1.*");

        // Match edge boundaries when there is an asterisk to better meet the expectations
        // of the user. When someone types "*.js" they don't expect "foo.json" to match. They
        // would only expect that if they type "*.js*". We use \b (instead of ^ and $) to allow
        // matches inside paths or URLs, so "ba*.js" will match "foo/bar.js" but not "boo/bbar.js".
        // When there isn't an asterisk the regexString is just a substring search.
        regexString = "\\b" + regexString + "\\b";
    }

    return new RegExp(regexString, regExpFlags);
}

Object.defineProperty(Array.prototype, "lowerBound",
{
    // Return index of the leftmost element that is equal or greater
    // than the specimen object. If there's no such element (i.e. all
    // elements are smaller than the specimen) returns array.length.
    // The function works for sorted array.
    value(object, comparator)
    {
        function defaultComparator(a, b)
        {
            return a - b;
        }
        comparator = comparator || defaultComparator;
        var l = 0;
        var r = this.length;
        while (l < r) {
            var m = (l + r) >> 1;
            if (comparator(object, this[m]) > 0)
                l = m + 1;
            else
                r = m;
        }
        return r;
    }
});

Object.defineProperty(Array.prototype, "upperBound",
{
    // Return index of the leftmost element that is greater
    // than the specimen object. If there's no such element (i.e. all
    // elements are smaller than the specimen) returns array.length.
    // The function works for sorted array.
    value(object, comparator)
    {
        function defaultComparator(a, b)
        {
            return a - b;
        }
        comparator = comparator || defaultComparator;
        var l = 0;
        var r = this.length;
        while (l < r) {
            var m = (l + r) >> 1;
            if (comparator(object, this[m]) >= 0)
                l = m + 1;
            else
                r = m;
        }
        return r;
    }
});

Object.defineProperty(Array.prototype, "binaryIndexOf",
{
    value(value, comparator)
    {
        var index = this.lowerBound(value, comparator);
        return index < this.length && comparator(value, this[index]) === 0 ? index : -1;
    }
});

(function() {
    // The `debounce` function lets you call any function on an object with a delay
    // and if the function keeps getting called, the delay gets reset. Since `debounce`
    // returns a Proxy, you can cache it and call multiple functions with the same delay.

    // Use: object.debounce(200).foo("Argument 1", "Argument 2")
    // Note: The last call's arguments get used for the delayed call.

    const debounceTimeoutSymbol = Symbol("debounce-timeout");
    const debounceSoonProxySymbol = Symbol("debounce-soon-proxy");

    Object.defineProperty(Object.prototype, "soon",
    {
        get()
        {
            if (!this[debounceSoonProxySymbol])
                this[debounceSoonProxySymbol] = this.debounce(0);
            return this[debounceSoonProxySymbol];
        }
    });

    Object.defineProperty(Object.prototype, "debounce",
    {
        value(delay)
        {
            console.assert(delay >= 0);

            return new Proxy(this, {
                get(target, property, receiver) {
                    return (...args) => {
                        let original = target[property];
                        console.assert(typeof original === "function");

                        if (original[debounceTimeoutSymbol])
                            clearTimeout(original[debounceTimeoutSymbol]);

                        let performWork = () => {
                            original[debounceTimeoutSymbol] = undefined;
                            original.apply(target, args);
                        };

                        original[debounceTimeoutSymbol] = setTimeout(performWork, delay);
                    };
                }
            });
        }
    });

    Object.defineProperty(Function.prototype, "cancelDebounce",
    {
        value()
        {
            if (!this[debounceTimeoutSymbol])
                return;

            clearTimeout(this[debounceTimeoutSymbol]);
            this[debounceTimeoutSymbol] = undefined;
        }
    });

    const requestAnimationFrameSymbol = Symbol("peform-on-animation-frame");
    const requestAnimationFrameProxySymbol = Symbol("perform-on-animation-frame-proxy");

    Object.defineProperty(Object.prototype, "onNextFrame",
    {
        get()
        {
            if (!this[requestAnimationFrameProxySymbol]) {
                this[requestAnimationFrameProxySymbol] = new Proxy(this, {
                    get(target, property, receiver) {
                        return (...args) => {
                            let original = target[property];
                            console.assert(typeof original === "function");

                            if (original[requestAnimationFrameSymbol])
                                return;

                            let performWork = () => {
                                original[requestAnimationFrameSymbol] = undefined;
                                original.apply(target, args);
                            };

                            original[requestAnimationFrameSymbol] = requestAnimationFrame(performWork);
                        };
                    }
                });
            }

            return this[requestAnimationFrameProxySymbol];
        }
    });

    const throttleTimeoutSymbol = Symbol("throttle-timeout");

    Object.defineProperty(Object.prototype, "throttle",
    {
        value(delay)
        {
            console.assert(delay >= 0);

            let lastFireTime = NaN;
            let mostRecentArguments = null;

            return new Proxy(this, {
                get(target, property, receiver) {
                    return (...args) => {
                        let original = target[property];
                        console.assert(typeof original === "function");
                        mostRecentArguments = args;

                        function performWork() {
                            lastFireTime = Date.now();
                            original[throttleTimeoutSymbol] = undefined;
                            original.apply(target, mostRecentArguments);
                        }

                        if (isNaN(lastFireTime)) {
                            performWork();
                            return;
                        }

                        let remaining = delay - (Date.now() - lastFireTime);
                        if (remaining <= 0) {
                            original.cancelThrottle();
                            performWork();
                            return;
                        }

                        if (!original[throttleTimeoutSymbol])
                            original[throttleTimeoutSymbol] = setTimeout(performWork, remaining);
                    };
                }
            });
        }
    });

    Object.defineProperty(Function.prototype, "cancelThrottle",
    {
        value()
        {
            if (!this[throttleTimeoutSymbol])
                return;

            clearTimeout(this[throttleTimeoutSymbol]);
            this[throttleTimeoutSymbol] = undefined;
        }
    });
})();

function appendWebInspectorSourceURL(string)
{
    if (string.includes("//# sourceURL"))
        return string;
    return "\n//# sourceURL=__WebInspectorInternal__\n" + string;
}

function appendWebInspectorConsoleEvaluationSourceURL(string)
{
    if (string.includes("//# sourceURL"))
        return string;
    return "\n//# sourceURL=__WebInspectorConsoleEvaluation__\n" + string;
}

function isWebInspectorInternalScript(url)
{
    return url === "__WebInspectorInternal__";
}

function isWebInspectorConsoleEvaluationScript(url)
{
    return url === "__WebInspectorConsoleEvaluation__";
}

function isWebKitInjectedScript(url)
{
    return url && url.startsWith("__InjectedScript_") && url.endsWith(".js");
}

function isWebKitInternalScript(url)
{
    if (isWebInspectorConsoleEvaluationScript(url))
        return false;

    if (isWebKitInjectedScript(url))
        return true;

    return url && url.startsWith("__Web") && url.endsWith("__");
}

function isFunctionStringNativeCode(str)
{
    return str.endsWith("{\n    [native code]\n}");
}

function isTextLikelyMinified(content)
{
    const autoFormatMaxCharactersToCheck = 5000;
    const autoFormatWhitespaceRatio = 0.2;

    let whitespaceScore = 0;
    let size = Math.min(autoFormatMaxCharactersToCheck, content.length);

    for (let i = 0; i < size; i++) {
        let char = content[i];

        if (char === " ")
            whitespaceScore++;
        else if (char === "\t")
            whitespaceScore += 4;
        else if (char === "\n")
            whitespaceScore += 8;
    }

    let ratio = whitespaceScore / size;
    return ratio < autoFormatWhitespaceRatio;
}

function doubleQuotedString(str)
{
    return "\"" + str.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
}

function insertionIndexForObjectInListSortedByFunction(object, list, comparator, insertionIndexAfter)
{
    if (insertionIndexAfter) {
        return list.upperBound(object, comparator);
    } else {
        return list.lowerBound(object, comparator);
    }
}

function insertObjectIntoSortedArray(object, array, comparator)
{
    array.splice(insertionIndexForObjectInListSortedByFunction(object, array, comparator), 0, object);
}

function decodeBase64ToBlob(base64Data, mimeType)
{
    mimeType = mimeType || "";

    const sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset)
            bytes[i] = byteCharacters[offset].charCodeAt(0);

        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, {type: mimeType});
}

function textToBlob(text, mimeType)
{
    return new Blob([text], {type: mimeType});
}

function blobAsText(blob, callback)
{
    console.assert(blob instanceof Blob);
    let fileReader = new FileReader;
    fileReader.addEventListener("loadend", () => { callback(fileReader.result); });
    fileReader.readAsText(blob);
}

if (!window.handlePromiseException) {
    window.handlePromiseException = function handlePromiseException(error)
    {
        console.error("Uncaught exception in Promise", error);
    };
}

/* Models/CallingContextTree.js */

/*
 * Copyright (C) 2016 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

WI.CallingContextTree = class CallingContextTree
{
    constructor(type)
    {
        this._type = type || WI.CallingContextTree.Type.TopDown;

        this.reset();
    }

    // Public

    get type() { return this._type; }
    get totalNumberOfSamples() { return this._totalNumberOfSamples; }

    reset()
    {
        this._root = new WI.CallingContextTreeNode(-1, -1, -1, "<root>", null);
        this._totalNumberOfSamples = 0;
    }

    totalDurationInTimeRange(startTime, endTime)
    {
        return this._root.filteredTimestampsAndDuration(startTime, endTime).duration;
    }

    updateTreeWithStackTrace({timestamp, stackFrames}, duration)
    {
        this._totalNumberOfSamples++;

        let node = this._root;
        node.addTimestampAndExpressionLocation(timestamp, duration, null);

        switch (this._type) {
        case WI.CallingContextTree.Type.TopDown:
            for (let i = stackFrames.length; i--; ) {
                let stackFrame = stackFrames[i];
                node = node.findOrMakeChild(stackFrame);
                node.addTimestampAndExpressionLocation(timestamp, duration, stackFrame.expressionLocation || null, i === 0);
            }
            break;
        case WI.CallingContextTree.Type.BottomUp:
            for (let i = 0; i < stackFrames.length; ++i) {
                let stackFrame = stackFrames[i];
                node = node.findOrMakeChild(stackFrame);
                node.addTimestampAndExpressionLocation(timestamp, duration, stackFrame.expressionLocation || null, i === 0);
            }
            break;
        case WI.CallingContextTree.Type.TopFunctionsTopDown:
            for (let i = stackFrames.length; i--; ) {
                node = this._root;
                for (let j = i + 1; j--; ) {
                    let stackFrame = stackFrames[j];
                    node = node.findOrMakeChild(stackFrame);
                    node.addTimestampAndExpressionLocation(timestamp, duration, stackFrame.expressionLocation || null, j === 0);
                }
            }
            break;
        case WI.CallingContextTree.Type.TopFunctionsBottomUp:
            for (let i = 0; i < stackFrames.length; i++) {
                node = this._root;
                for (let j = i; j < stackFrames.length; j++) {
                    let stackFrame = stackFrames[j];
                    node = node.findOrMakeChild(stackFrame);
                    node.addTimestampAndExpressionLocation(timestamp, duration, stackFrame.expressionLocation || null, j === 0);
                }
            }
            break;
        default:
            console.assert(false, "This should not be reached.");
            break;
        }
    }

    toCPUProfilePayload(startTime, endTime)
    {
        let cpuProfile = {};
        let roots = [];
        let numSamplesInTimeRange = this._root.filteredTimestampsAndDuration(startTime, endTime).timestamps.length;

        this._root.forEachChild((child) => {
            if (child.hasStackTraceInTimeRange(startTime, endTime))
                roots.push(child.toCPUProfileNode(numSamplesInTimeRange, startTime, endTime));
        });

        cpuProfile.rootNodes = roots;
        return cpuProfile;
    }

    forEachChild(callback)
    {
        this._root.forEachChild(callback);
    }

    forEachNode(callback)
    {
        this._root.forEachNode(callback);
    }

    // Testing.

    static __test_makeTreeFromProtocolMessageObject(messageObject)
    {
        let tree = new WI.CallingContextTree;
        let stackTraces = messageObject.params.samples.stackTraces;
        for (let i = 0; i < stackTraces.length; i++)
            tree.updateTreeWithStackTrace(stackTraces[i]);
        return tree;
    }

    __test_matchesStackTrace(stackTrace)
    {
        // StackTrace should have top frame first in the array and bottom frame last.
        // We don't look for a match that traces down the tree from the root; instead,
        // we match by looking at all the leafs, and matching while walking up the tree
        // towards the root. If we successfully make the walk, we've got a match that
        // suffices for a particular test. A successful match doesn't mean we actually
        // walk all the way up to the root; it just means we didn't fail while walking
        // in the direction of the root.
        let leaves = this.__test_buildLeafLinkedLists();

        outer:
        for (let node of leaves) {
            for (let stackNode of stackTrace) {
                for (let propertyName of Object.getOwnPropertyNames(stackNode)) {
                    if (stackNode[propertyName] !== node[propertyName])
                        continue outer;
                }
                node = node.parent;
            }
            return true;
        }
        return false;
    }

    __test_buildLeafLinkedLists()
    {
        let result = [];
        let parent = null;
        this._root.__test_buildLeafLinkedLists(parent, result);
        return result;
    }
};

WI.CallingContextTree.Type = {
    TopDown: Symbol("TopDown"),
    BottomUp: Symbol("BottomUp"),
    TopFunctionsTopDown: Symbol("TopFunctionsTopDown"),
    TopFunctionsBottomUp: Symbol("TopFunctionsBottomUp"),
};

/* Models/CallingContextTreeNode.js */

/*
 * Copyright (C) 2016 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

WI.CallingContextTreeNode = class CallingContextTreeNode
{
    constructor(sourceID, line, column, name, url, hash)
    {
        this._children = {};
        this._sourceID = sourceID;
        this._line = line;
        this._column = column;
        this._name = name;
        this._url = url;
        this._uid = WI.CallingContextTreeNode.__uid++;

        this._timestamps = [];
        this._durations = [];
        this._leafTimestamps = [];
        this._leafDurations = [];
        this._expressionLocations = {}; // Keys are "line:column" strings. Values are arrays of timestamps in sorted order.

        this._hash = hash || WI.CallingContextTreeNode._hash(this);
    }

    // Static and Private

    static _hash(stackFrame)
    {
        return stackFrame.name + ":" + stackFrame.sourceID + ":" + stackFrame.line + ":" + stackFrame.column;
    }

    // Public

    get sourceID() { return this._sourceID; }
    get line() { return this._line; }
    get column() { return this._column; }
    get name() { return this._name; }
    get uid() { return this._uid; }
    get url() { return this._url; }
    get hash() { return this._hash; }

    hasChildrenInTimeRange(startTime, endTime)
    {
        for (let propertyName of Object.getOwnPropertyNames(this._children)) {
            let child = this._children[propertyName];
            if (child.hasStackTraceInTimeRange(startTime, endTime))
                return true;
        }
        return false;
    }

    hasStackTraceInTimeRange(startTime, endTime)
    {
        console.assert(startTime <= endTime);
        if (startTime > endTime)
            return false;

        let timestamps = this._timestamps;
        let length = timestamps.length;
        if (!length)
            return false;

        let index = timestamps.lowerBound(startTime);
        if (index === length)
            return false;
        console.assert(startTime <= timestamps[index]);

        let hasTimestampInRange = timestamps[index] <= endTime;
        return hasTimestampInRange;
    }

    filteredTimestampsAndDuration(startTime, endTime)
    {
        let lowerIndex = this._timestamps.lowerBound(startTime);
        let upperIndex = this._timestamps.upperBound(endTime);

        let totalDuration = 0;
        for (let i = lowerIndex; i < upperIndex; ++i)
            totalDuration += this._durations[i];

        return {
            timestamps: this._timestamps.slice(lowerIndex, upperIndex),
            duration: totalDuration,
        };
    }

    filteredLeafTimestampsAndDuration(startTime, endTime)
    {
        let lowerIndex = this._leafTimestamps.lowerBound(startTime);
        let upperIndex = this._leafTimestamps.upperBound(endTime);

        let totalDuration = 0;
        for (let i = lowerIndex; i < upperIndex; ++i)
            totalDuration += this._leafDurations[i];

        return {
            leafTimestamps: this._leafTimestamps.slice(lowerIndex, upperIndex),
            leafDuration: totalDuration,
        };
    }

    hasChildren()
    {
        return !isEmptyObject(this._children);
    }

    findOrMakeChild(stackFrame)
    {
        let hash = WI.CallingContextTreeNode._hash(stackFrame);
        let node = this._children[hash];
        if (node)
            return node;
        node = new WI.CallingContextTreeNode(stackFrame.sourceID, stackFrame.line, stackFrame.column, stackFrame.name, stackFrame.url, hash);
        this._children[hash] = node;
        return node;
    }

    addTimestampAndExpressionLocation(timestamp, duration, expressionLocation, leaf)
    {
        console.assert(!this._timestamps.length || this._timestamps.lastValue <= timestamp, "Expected timestamps to be added in sorted, increasing, order.");
        this._timestamps.push(timestamp);
        this._durations.push(duration);

        if (leaf) {
            this._leafTimestamps.push(timestamp);
            this._leafDurations.push(duration);
        }

        if (!expressionLocation)
            return;

        let {line, column} = expressionLocation;
        let hashCons = line + ":" + column;
        let timestamps = this._expressionLocations[hashCons];
        if (!timestamps) {
            timestamps = [];
            this._expressionLocations[hashCons] = timestamps;
        }
        console.assert(!timestamps.length || timestamps.lastValue <= timestamp, "Expected timestamps to be added in sorted, increasing, order.");
        timestamps.push(timestamp);
    }

    forEachChild(callback)
    {
        for (let propertyName of Object.getOwnPropertyNames(this._children))
            callback(this._children[propertyName]);
    }

    forEachNode(callback)
    {
        callback(this);
        this.forEachChild(function(child) {
            child.forEachNode(callback);
        });
    }

    equals(other)
    {
        return this._hash === other.hash;
    }

    toCPUProfileNode(numSamples, startTime, endTime)
    {
        let children = [];
        this.forEachChild((child) => {
            if (child.hasStackTraceInTimeRange(startTime, endTime))
                children.push(child.toCPUProfileNode(numSamples, startTime, endTime));
        });
        let cpuProfileNode = {
            id: this._uid,
            functionName: this._name,
            url: this._url,
            lineNumber: this._line,
            columnNumber: this._column,
            children: children
        };

        let timestamps = [];
        let frameStartTime = Number.MAX_VALUE;
        let frameEndTime = Number.MIN_VALUE;
        for (let i = 0; i < this._timestamps.length; i++) {
            let timestamp = this._timestamps[i];
            if (startTime <= timestamp && timestamp <= endTime) {
                timestamps.push(timestamp);
                frameStartTime = Math.min(frameStartTime, timestamp);
                frameEndTime = Math.max(frameEndTime, timestamp);
            }
        }

        cpuProfileNode.callInfo = {
            callCount: timestamps.length, // Totally not callCount, but oh well, this makes life easier because of field names.
            startTime: frameStartTime,
            endTime: frameEndTime,
            totalTime: (timestamps.length / numSamples) * (endTime - startTime)
        };

        return cpuProfileNode;
    }

    // Testing.

    __test_buildLeafLinkedLists(parent, result)
    {
        let linkedListNode = {
            name: this._name,
            url: this._url,
            parent: parent
        };
        if (this.hasChildren()) {
            this.forEachChild((child) => {
                child.__test_buildLeafLinkedLists(linkedListNode, result);
            });
        } else {
            // We're a leaf.
            result.push(linkedListNode);
        }
    }
};

WI.CallingContextTreeNode.__uid = 0;

/* Models/WrappedPromise.js */

/*
 * Copyright (C) 2015, 2016 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

WI.WrappedPromise = class WrappedPromise
{
    constructor(work)
    {
        this._settled = false;
        this._promise = new Promise((resolve, reject) => {
            this._resolveCallback = resolve;
            this._rejectCallback = reject;

            // Allow work to resolve or reject the promise by shimming our
            // internal callbacks. This ensures that this._settled gets set properly.
            if (work && typeof work === "function")
                return work(this.resolve.bind(this), this.reject.bind(this));
        });
    }

    // Public

    get settled()
    {
        return this._settled;
    }

    get promise()
    {
        return this._promise;
    }

    resolve(value)
    {
        if (this._settled)
            throw new Error("Promise is already settled, cannot call resolve().");

        this._settled = true;
        this._resolveCallback(value);
    }

    reject(value)
    {
        if (this._settled)
            throw new Error("Promise is already settled, cannot call reject().");

        this._settled = true;
        this._rejectCallback(value);
    }
};

/* Test/TestSuite.js */

/*
 * Copyright (C) 2015 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

TestSuite = class TestSuite
{
    constructor(harness, name) {
        if (!(harness instanceof TestHarness))
            throw new Error("Must pass the test's harness as the first argument.");

        if (typeof name !== "string" || !name.trim().length)
            throw new Error("Tried to create TestSuite without string suite name.");

        this.name = name;
        this._harness = harness;

        this.testcases = [];
        this.runCount = 0;
        this.failCount = 0;
    }

    // Use this if the test file only has one suite, and no handling
    // of the value returned by runTestCases() is needed.
    runTestCasesAndFinish()
    {
        throw new Error("Must be implemented by subclasses.");
    }

    runTestCases()
    {
        throw new Error("Must be implemented by subclasses.");
    }

    get passCount()
    {
        return this.runCount - this.failCount;
    }

    get skipCount()
    {
        if (this.failCount)
            return this.testcases.length - this.runCount;
        else
            return 0;
    }

    addTestCase(testcase)
    {
        if (!testcase || !(testcase instanceof Object))
            throw new Error("Tried to add non-object test case.");

        if (typeof testcase.name !== "string" || !testcase.name.trim().length)
            throw new Error("Tried to add test case without a name.");

        if (typeof testcase.test !== "function")
            throw new Error("Tried to add test case without `test` function.");

        if (testcase.setup && typeof testcase.setup !== "function")
            throw new Error("Tried to add test case with invalid `setup` parameter (must be a function).");

        if (testcase.teardown && typeof testcase.teardown !== "function")
            throw new Error("Tried to add test case with invalid `teardown` parameter (must be a function).");

        this.testcases.push(testcase);
    }

    // Protected

    logThrownObject(e)
    {
        let message = e;
        let stack = "(unknown)";
        if (e instanceof Error) {
            message = e.message;
            if (e.stack)
                stack = e.stack;
        }

        if (typeof message !== "string")
            message = JSON.stringify(message);

        let sanitizedStack = this._harness.sanitizeStack(stack);

        let result = `!! EXCEPTION: ${message}`;
        if (stack)
            result += `\nStack Trace: ${sanitizedStack}`;

        this._harness.log(result);
    }
};

AsyncTestSuite = class AsyncTestSuite extends TestSuite
{
    runTestCasesAndFinish()
    {
        let finish = () => { this._harness.completeTest(); };

        this.runTestCases()
            .then(finish)
            .catch(finish);
    }

    runTestCases()
    {
        if (!this.testcases.length)
            throw new Error("Tried to call runTestCases() for suite with no test cases");
        if (this._startedRunning)
            throw new Error("Tried to call runTestCases() more than once.");

        this._startedRunning = true;

        this._harness.log("");
        this._harness.log(`== Running test suite: ${this.name}`);

        // Avoid adding newlines if nothing was logged.
        let priorLogCount = this._harness.logCount;
        let result = this.testcases.reduce((chain, testcase, i) => {
            if (testcase.setup) {
                chain = chain.then(() => {
                    this._harness.log("-- Running test setup.");
                    if (testcase.setup[Symbol.toStringTag] === "AsyncFunction")
                        return testcase.setup();
                    return new Promise(testcase.setup);
                });
            }

            chain = chain.then(() => {
                if (i > 0 && priorLogCount + 1 < this._harness.logCount)
                    this._harness.log("");

                priorLogCount = this._harness.logCount;
                this._harness.log(`-- Running test case: ${testcase.name}`);
                this.runCount++;
                if (testcase.test[Symbol.toStringTag] === "AsyncFunction")
                    return testcase.test();
                return new Promise(testcase.test);
            });

            if (testcase.teardown) {
                chain = chain.then(() => {
                    this._harness.log("-- Running test teardown.");
                    if (testcase.teardown[Symbol.toStringTag] === "AsyncFunction")
                        return testcase.teardown();
                    return new Promise(testcase.teardown);
                });
            }
            return chain;
        }, Promise.resolve());

        return result.catch((e) => {
            this.failCount++;
            this.logThrownObject(e);

            throw e; // Reject this promise by re-throwing the error.
        });
    }
};

SyncTestSuite = class SyncTestSuite extends TestSuite
{
    addTestCase(testcase)
    {
        if ([testcase.setup, testcase.teardown, testcase.test].some((fn) => fn && fn[Symbol.toStringTag] === "AsyncFunction"))
            throw new Error("Tried to pass a test case with an async `setup`, `test`, or `teardown` function, but this is a synchronous test suite.")

        super.addTestCase(testcase);
    }

    runTestCasesAndFinish()
    {
        this.runTestCases();
        this._harness.completeTest();
    }

    runTestCases()
    {
        if (!this.testcases.length)
            throw new Error("Tried to call runTestCases() for suite with no test cases");
        if (this._startedRunning)
            throw new Error("Tried to call runTestCases() more than once.");

        this._startedRunning = true;

        this._harness.log("");
        this._harness.log(`== Running test suite: ${this.name}`);

        let priorLogCount = this._harness.logCount;
        for (let i = 0; i < this.testcases.length; i++) {
            let testcase = this.testcases[i];
            if (i > 0 && priorLogCount + 1 < this._harness.logCount)
                this._harness.log("");

            priorLogCount = this._harness.logCount;

            // Run the setup action, if one was provided.
            if (testcase.setup) {
                this._harness.log("-- Running test setup.");
                try {
                    let result = testcase.setup.call(null);
                    if (result === false) {
                        this._harness.log("!! SETUP FAILED");
                        return false;
                    }
                } catch (e) {
                    this.logThrownObject(e);
                    return false;
                }
            }

            this._harness.log("-- Running test case: " + testcase.name);
            this.runCount++;
            try {
                let result = testcase.test.call(null);
                if (result === false) {
                    this.failCount++;
                    return false;
                }
            } catch (e) {
                this.failCount++;
                this.logThrownObject(e);
                return false;
            }

            // Run the teardown action, if one was provided.
            if (testcase.teardown) {
                this._harness.log("-- Running test teardown.");
                try {
                    let result = testcase.teardown.call(null);
                    if (result === false) {
                        this._harness.log("!! TEARDOWN FAILED");
                        return false;
                    }
                } catch (e) {
                    this.logThrownObject(e);
                    return false;
                }
            }
        }

        return true;
    }
};

/* Test/TestHarness.js */

/*
 * Copyright (C) 2015-2017 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

TestHarness = class TestHarness extends WI.Object
{
    constructor()
    {
        super();

        this._logCount = 0;
        this._failureObjects = new Map;
        this._failureObjectIdentifier = 1;

        // Options that are set per-test for debugging purposes.
        this.forceDebugLogging = false;

        // Options that are set per-test to ensure deterministic output.
        this.suppressStackTraces = false;
    }

    completeTest()
    {
        throw new Error("Must be implemented by subclasses.");
    }

    addResult()
    {
        throw new Error("Must be implemented by subclasses.");
    }

    debugLog()
    {
        throw new Error("Must be implemented by subclasses.");
    }

    // If 'callback' is a function, it will be with the arguments
    // callback(error, result, wasThrown). Otherwise, a promise is
    // returned that resolves with 'result' or rejects with 'error'.

    // The options object accepts the following keys and values:
    // 'remoteObjectOnly': if true, do not unwrap the result payload to a
    // primitive value even if possible. Useful if testing WI.RemoteObject directly.
    evaluateInPage(string, callback, options={})
    {
        throw new Error("Must be implemented by subclasses.");
    }

    debug()
    {
        throw new Error("Must be implemented by subclasses.");
    }

    createAsyncSuite(name)
    {
        return new AsyncTestSuite(this, name);
    }

    createSyncSuite(name)
    {
        return new SyncTestSuite(this, name);
    }

    get logCount()
    {
        return this._logCount;
    }

    log(message)
    {
        ++this._logCount;

        if (this.forceDebugLogging)
            this.debugLog(message);
        else
            this.addResult(message);
    }

    json(object, filter)
    {
        this.log(JSON.stringify(object, filter || null, 2));
    }

    assert(condition, message)
    {
        if (condition)
            return;

        let stringifiedMessage = TestHarness.messageAsString(message);
        this.log("ASSERT: " + stringifiedMessage);
    }

    expectThat(actual, message)
    {
        this._expect(TestHarness.ExpectationType.True, !!actual, message, actual);
    }

    expectFalse(actual, message)
    {
        this._expect(TestHarness.ExpectationType.False, !actual, message, actual);
    }

    expectNull(actual, message)
    {
        this._expect(TestHarness.ExpectationType.Null, actual === null, message, actual, null);
    }

    expectNotNull(actual, message)
    {
        this._expect(TestHarness.ExpectationType.NotNull, actual !== null, message, actual);
    }

    expectEqual(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.Equal, expected === actual, message, actual, expected);
    }

    expectNotEqual(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.NotEqual, expected !== actual, message, actual, expected);
    }

    expectShallowEqual(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.ShallowEqual, Object.shallowEqual(actual, expected), message, actual, expected);
    }

    expectNotShallowEqual(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.NotShallowEqual, !Object.shallowEqual(actual, expected), message, actual, expected);
    }

    expectEqualWithAccuracy(actual, expected, accuracy, message)
    {
        console.assert(typeof expected === "number");
        console.assert(typeof actual === "number");

        this._expect(TestHarness.ExpectationType.EqualWithAccuracy, Math.abs(expected - actual) <= accuracy, message, actual, expected, accuracy);
    }

    expectLessThan(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.LessThan, actual < expected, message, actual, expected);
    }

    expectLessThanOrEqual(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.LessThanOrEqual, actual <= expected, message, actual, expected);
    }

    expectGreaterThan(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.GreaterThan, actual > expected, message, actual, expected);
    }

    expectGreaterThanOrEqual(actual, expected, message)
    {
        this._expect(TestHarness.ExpectationType.GreaterThanOrEqual, actual >= expected, message, actual, expected);
    }

    pass(message)
    {
        let stringifiedMessage = TestHarness.messageAsString(message);
        this.log("PASS: " + stringifiedMessage);
    }

    fail(message)
    {
        let stringifiedMessage = TestHarness.messageAsString(message);
        this.log("FAIL: " + stringifiedMessage);
    }

    // Use this to expect an exception. To further examine the exception,
    // chain onto the result with .then() and add your own test assertions.
    // The returned promise is rejected if an exception was not thrown.
    expectException(work)
    {
        if (typeof work !== "function")
            throw new Error("Invalid argument to catchException: work must be a function.");

        let expectAndDumpError = (e) => {
            this.expectNotNull(e, "Should produce an exception.");
            if (e)
                this.log(e.toString());
        }

        let error = null;
        let result = null;
        try {
            result = work();
        } catch (caughtError) {
            error = caughtError;
        } finally {
            // If 'work' returns a promise, it will settle (resolve or reject) by itself.
            // Invert the promise's settled state to match the expectation of the caller.
            if (result instanceof Promise) {
                return result.then((resolvedValue) => {
                    expectAndDumpError(null);
                    return Promise.reject(resolvedValue);
                }, (e) => { // Don't chain the .catch as it will log the value we just rejected.
                    expectAndDumpError(e);
                    return Promise.resolve(e);
                });
            }

            // If a promise is not produced, turn the exception into a resolved promise, and a
            // resolved value into a rejected value (since an exception was expected).
            expectAndDumpError(error);
            return error ? Promise.resolve(error) : Promise.reject(result);
        }
    }

    // Protected

    static messageAsString(message)
    {
        if (message instanceof Element)
            return message.textContent;

        return typeof message !== "string" ? JSON.stringify(message) : message;
    }

    static sanitizeURL(url)
    {
        if (!url)
            return "(unknown)";

        let lastPathSeparator = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
        let location = lastPathSeparator > 0 ? url.substr(lastPathSeparator + 1) : url;
        if (!location.length)
            location = "(unknown)";

        // Clean up the location so it is bracketed or in parenthesis.
        if (url.indexOf("[native code]") !== -1)
            location = "[native code]";

        return location;
    }

    static sanitizeStackFrame(frame, i)
    {
        // Most frames are of the form "functionName@file:///foo/bar/File.js:345".
        // But, some frames do not have a functionName. Get rid of the file path.
        let nameAndURLSeparator = frame.indexOf("@");
        let frameName = nameAndURLSeparator > 0 ? frame.substr(0, nameAndURLSeparator) : "(anonymous)";

        let lastPathSeparator = Math.max(frame.lastIndexOf("/"), frame.lastIndexOf("\\"));
        let frameLocation = lastPathSeparator > 0 ? frame.substr(lastPathSeparator + 1) : frame;
        if (!frameLocation.length)
            frameLocation = "unknown";

        // Clean up the location so it is bracketed or in parenthesis.
        if (frame.indexOf("[native code]") !== -1)
            frameLocation = "[native code]";
        else
            frameLocation = "(" + frameLocation + ")";

        return `#${i}: ${frameName} ${frameLocation}`;
    }

    sanitizeStack(stack)
    {
        if (this.suppressStackTraces)
            return "(suppressed)";

        if (!stack || typeof stack !== "string")
            return "(unknown)";

        return stack.split("\n").map(TestHarness.sanitizeStackFrame).join("\n");
    }

    // Private

    _expect(type, condition, message, ...values)
    {
        console.assert(values.length > 0, "Should have an 'actual' value.");

        if (!message || !condition) {
            values = values.map(this._expectationValueAsString.bind(this));
            message = message || this._expectationMessageFormat(type).format(...values);
        }

        if (condition) {
            this.pass(message);
            return;
        }

        message += "\n    Expected: " + this._expectedValueFormat(type).format(...values.slice(1));
        message += "\n    Actual: " + values[0];

        this.fail(message);
    }

    _expectationValueAsString(value)
    {
        let instanceIdentifier = (object) => {
            let id = this._failureObjects.get(object);
            if (!id) {
                id = this._failureObjectIdentifier++;
                this._failureObjects.set(object, id);
            }
            return "#" + id;
        };

        const maximumValueStringLength = 200;
        const defaultValueString = String(new Object); // [object Object]

        // Special case for numbers, since JSON.stringify converts Infinity and NaN to null.
        if (typeof value === "number")
            return value;

        try {
            let valueString = JSON.stringify(value);
            if (valueString.length <= maximumValueStringLength)
                return valueString;
        } catch { }

        try {
            let valueString = String(value);
            if (valueString === defaultValueString && value.constructor && value.constructor.name !== "Object")
                return value.constructor.name + " instance " + instanceIdentifier(value);
            return valueString;
        } catch {
            return defaultValueString;
        }
    }

    _expectationMessageFormat(type)
    {
        switch (type) {
        case TestHarness.ExpectationType.True:
            return "expectThat(%s)";
        case TestHarness.ExpectationType.False:
            return "expectFalse(%s)";
        case TestHarness.ExpectationType.Null:
            return "expectNull(%s)";
        case TestHarness.ExpectationType.NotNull:
            return "expectNotNull(%s)";
        case TestHarness.ExpectationType.Equal:
            return "expectEqual(%s, %s)";
        case TestHarness.ExpectationType.NotEqual:
            return "expectNotEqual(%s, %s)";
        case TestHarness.ExpectationType.ShallowEqual:
            return "expectShallowEqual(%s, %s)";
        case TestHarness.ExpectationType.NotShallowEqual:
            return "expectNotShallowEqual(%s, %s)";
        case TestHarness.ExpectationType.EqualWithAccuracy:
            return "expectEqualWithAccuracy(%s, %s, %s)";
        case TestHarness.ExpectationType.LessThan:
            return "expectLessThan(%s, %s)";
        case TestHarness.ExpectationType.LessThanOrEqual:
            return "expectLessThanOrEqual(%s, %s)";
        case TestHarness.ExpectationType.GreaterThan:
            return "expectGreaterThan(%s, %s)";
        case TestHarness.ExpectationType.GreaterThanOrEqual:
            return "expectGreaterThanOrEqual(%s, %s)";
        default:
            console.error("Unknown TestHarness.ExpectationType type: " + type);
            return null;
        }
    }

    _expectedValueFormat(type)
    {
        switch (type) {
        case TestHarness.ExpectationType.True:
            return "truthy";
        case TestHarness.ExpectationType.False:
            return "falsey";
        case TestHarness.ExpectationType.NotNull:
            return "not null";
        case TestHarness.ExpectationType.NotEqual:
        case TestHarness.ExpectationType.NotShallowEqual:
            return "not %s";
        case TestHarness.ExpectationType.EqualWithAccuracy:
            return "%s +/- %s";
        case TestHarness.ExpectationType.LessThan:
            return "less than %s";
        case TestHarness.ExpectationType.LessThanOrEqual:
            return "less than or equal to %s";
        case TestHarness.ExpectationType.GreaterThan:
            return "greater than %s";
        case TestHarness.ExpectationType.GreaterThanOrEqual:
            return "greater than or equal to %s";
        default:
            return "%s";
        }
    }
};

TestHarness.ExpectationType = {
    True: Symbol("expect-true"),
    False: Symbol("expect-false"),
    Null: Symbol("expect-null"),
    NotNull: Symbol("expect-not-null"),
    Equal: Symbol("expect-equal"),
    NotEqual: Symbol("expect-not-equal"),
    ShallowEqual: Symbol("expect-shallow-equal"),
    NotShallowEqual: Symbol("expect-not-shallow-equal"),
    EqualWithAccuracy: Symbol("expect-equal-with-accuracy"),
    LessThan: Symbol("expect-less-than"),
    LessThanOrEqual: Symbol("expect-less-than-or-equal"),
    GreaterThan: Symbol("expect-greater-than"),
    GreaterThanOrEqual: Symbol("expect-greater-than-or-equal"),
};

/* Test/ProtocolTestHarness.js */

/*
 * Copyright (C) 2015 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

ProtocolTestHarness = class ProtocolTestHarness extends TestHarness
{
    // TestHarness Overrides

    completeTest()
    {
        if (this.dumpActivityToSystemConsole)
            InspectorFrontendHost.unbufferedLog("completeTest()");

        this.evaluateInPage("TestPage.closeTest();");
    }

    addResult(message)
    {
        let stringifiedMessage = TestHarness.messageAsString(message);

        if (this.dumpActivityToSystemConsole)
            InspectorFrontendHost.unbufferedLog(stringifiedMessage);

        // Unfortunately, every string argument must be escaped because tests are not consistent
        // with respect to escaping with single or double quotes. Some exceptions use single quotes.
        this.evaluateInPage(`TestPage.log(unescape("${escape(stringifiedMessage)}"));`);
    }

    debugLog(message)
    {
        let stringifiedMessage = TestHarness.messageAsString(message);

        if (this.dumpActivityToSystemConsole)
            InspectorFrontendHost.unbufferedLog(stringifiedMessage);

        this.evaluateInPage(`TestPage.debugLog(unescape("${escape(stringifiedMessage)}"));`);
    }

    evaluateInPage(expression, callback)
    {
        let args = {
            method: "Runtime.evaluate",
            params: {expression}
        };

        if (typeof callback === "function")
            InspectorProtocol.sendCommand(args, callback);
        else
            return InspectorProtocol.awaitCommand(args);
    }

    debug()
    {
        this.dumpActivityToSystemConsole = true;
        this.dumpInspectorProtocolMessages = true;
    }
};

/* Test/TestUtilities.js */

/*
 * Copyright (C) 2017 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

//
// This can be used to get a promise for any function that takes a callback.
//
// For example:
//
//    object.getValues(arg1, arg2, (callbackArg1, callbackArg2) => {
//        ...
//    });
//
// Can be promisified like so:
//
//    promisify((cb) => { object.getValues(arg1, arg2, cb); }).then([callbackArg1, callbackArg2]) {
//        ...
//    });
//
// Or more naturally with await:
//
//    let [callbackArg1, callbackArg2] = await promisify((cb) => { object.getValues(arg1, arg2, cb); });
//

function promisify(func) {
    return new Promise((resolve, reject) => {
        try {
            func((...args) => { resolve(args); });
        } catch (e) {
            reject(e);
        }
    });
}

function sanitizeURL(url) {
    return url.replace(/^.*?LayoutTests\//, "");
}

/* Test/InspectorProtocol.js */

/*
 * Copyright (C) 2012 Samsung Electronics. All rights reserved.
 * Copyright (C) 2014, 2015 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

InspectorProtocol = {};
InspectorProtocol._dispatchTable = [];
InspectorProtocol._placeholderRequestIds = [];
InspectorProtocol._requestId = -1;
InspectorProtocol.eventHandler = {};

InspectorProtocol.sendCommand = function(methodOrObject, params, handler)
{
    // Allow new-style arguments object, as in awaitCommand.
    let method = methodOrObject;
    if (typeof methodOrObject === "object")
        ({method, params, handler} = methodOrObject);
    else if (!params)
        params = {};

    this._dispatchTable[++this._requestId] = handler;
    let messageObject = {method, params, id: this._requestId};
    this._sendMessage(messageObject);

    return this._requestId;
};

InspectorProtocol.awaitCommand = function(args)
{
    let {method, params} = args;
    let messageObject = {method, params, id: ++this._requestId};

    return this.awaitMessage(messageObject);
};

InspectorProtocol.awaitMessage = function(messageObject)
{
    // Send a raw message to the backend. Mostly used to test the backend's error handling.
    return new Promise((resolve, reject) => {
        let requestId = messageObject.id;

        // If the caller did not provide an id, then make one up so that the response
        // can be used to settle a promise.
        if (typeof requestId !== "number") {
            requestId = ++this._requestId;
            this._placeholderRequestIds.push(requestId);
        }

        this._dispatchTable[requestId] = {resolve, reject};
        this._sendMessage(messageObject);
    });
};

InspectorProtocol.awaitEvent = function(args)
{
    let event = args.event;
    if (typeof event !== "string")
        throw new Error("Event must be a string.");

    return new Promise((resolve, reject) => {
        InspectorProtocol.eventHandler[event] = function(message) {
            InspectorProtocol.eventHandler[event] = undefined;
            resolve(message);
        };
    });
};

InspectorProtocol._sendMessage = function(messageObject)
{
    let messageString = typeof messageObject !== "string" ? JSON.stringify(messageObject) : messageObject;

    if (ProtocolTest.dumpInspectorProtocolMessages)
        InspectorFrontendHost.unbufferedLog(`frontend: ${messageString}`);

    InspectorFrontendHost.sendMessageToBackend(messageString);
};

InspectorProtocol.addEventListener = function(eventTypeOrObject, listener)
{
    let event = eventTypeOrObject;
    if (typeof eventTypeOrObject === "object")
        ({event, listener} = eventTypeOrObject);

    if (typeof event !== "string")
        throw new Error("Event name must be a string.");

    if (typeof listener !== "function")
        throw new Error("Event listener must be callable.");

    // Convert to an array of listeners.
    let listeners = InspectorProtocol.eventHandler[event];
    if (!listeners)
        listeners = InspectorProtocol.eventHandler[event] = [];
    else if (typeof listeners === "function")
        listeners = InspectorProtocol.eventHandler[event] = [listeners];

    // Prevent registering multiple times.
    if (listeners.includes(listener))
        throw new Error("Cannot register the same listener more than once.");

    listeners.push(listener);
};

InspectorProtocol.checkForError = function(responseObject)
{
    if (responseObject.error) {
        ProtocolTest.log("PROTOCOL ERROR: " + JSON.stringify(responseObject.error));
        ProtocolTest.completeTest();
        throw "PROTOCOL ERROR";
    }
};

InspectorProtocol.dispatchMessageFromBackend = function(messageObject)
{
    // This matches the debug dumping in InspectorBackend, which is bypassed
    // by InspectorProtocol. Return messages should be dumped by InspectorBackend.
    if (ProtocolTest.dumpInspectorProtocolMessages)
        InspectorFrontendHost.unbufferedLog("backend: " + JSON.stringify(messageObject));

    // If the message has an id, then it is a reply to a command.
    let messageId = messageObject.id;

    // If the id is 'null', then it may be an error response.
    if (messageId === null)
        messageId = InspectorProtocol._placeholderRequestIds.shift();

    // If we could figure out a requestId, then dispatch the message.
    if (typeof messageId === "number") {
        let handler = InspectorProtocol._dispatchTable[messageId];
        if (!handler)
            return;

        if (typeof handler === "function")
            handler(messageObject);
        else if (typeof handler === "object") {
            let {resolve, reject} = handler;
            if ("error" in messageObject)
                reject(messageObject.error);
            else
                resolve(messageObject.result);
        }
    } else {
        // Otherwise, it is an event.
        let eventName = messageObject["method"];
        let handler = InspectorProtocol.eventHandler[eventName];
        if (!handler)
            return;

        if (typeof handler === "function")
            handler(messageObject);
        else if (handler instanceof Array) {
            handler.map((listener) => { listener.call(null, messageObject); });
        } else if (typeof handler === "object") {
            let {resolve, reject} = handler;
            if ("error" in messageObject)
                reject(messageObject.error);
            else
                resolve(messageObject.result);
        }
    }
};

/* Test/TestStub.js */

/*
 * Copyright (C) 2012 Samsung Electronics. All rights reserved.
 * Copyright (C) 2014, 2015 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

InspectorFrontendAPI = {};
InspectorFrontendAPI.dispatchMessageAsync = InspectorProtocol.dispatchMessageFromBackend;

window.ProtocolTest = new ProtocolTestHarness();

window.addEventListener("message", (event) => {
    try {
        eval(event.data);
    } catch (e) {
        alert(e.stack);
        ProtocolTest.completeTest();
        throw e;
    }
});
