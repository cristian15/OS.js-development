/*!
 * OS.js - JavaScript Operating System
 *
 * Copyright (c) 2011-2015, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
(function(Application, Window, Utils, API, VFS, GUI) {
  'use strict';

  var timeout;
  function createDroppable(root, onDrop) {
    onDrop = onDrop || function() {};

    API.createDroppable(root, {
      onEnter: function(ev) {
        ev.stopPropagation();
        Utils.$addClass(root, 'ide-hover');
      },
      onOver: function(ev) {
        ev.stopPropagation();
        Utils.$addClass(root, 'ide-hover');
      },
      onLeave: function() {
        Utils.$removeClass(root, 'ide-hover');
      },
      onDrop: function(ev) {
        Utils.$removeClass(root, 'ide-hover');
      },
      onItemDropped: function(ev, el, item, args) {
        ev.stopPropagation();
        ev.preventDefault();

        timeout = clearTimeout(timeout);
        timeout = setTimeout(function() {
          Utils.$removeClass(root, 'ide-hover');
          onDrop(item.data);
        }, 10);
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationIDEDesignerWindow(app, metadata) {
    Window.apply(this, ['ApplicationIDEDesignerWindow', {
      tag: 'designer',
      gravity: 'center',
      icon: metadata.icon,
      title: metadata.name,
      width: 400,
      height: 400
    }, app]);

    this._restored = false;

    this.selectedElement = null;
  }

  ApplicationIDEDesignerWindow.prototype = Object.create(Window.prototype);
  ApplicationIDEDesignerWindow.constructor = Window.prototype;

  ApplicationIDEDesignerWindow.prototype.init = function(wmRef, app) {
    var root = Window.prototype.init.apply(this, arguments);
    var self = this;

    // Load and set up scheme (GUI) here
    createDroppable(root, function(data) {
      app.onElementDropped(null, 'application-window', data.tagName);
    });

    return root;
  };

  ApplicationIDEDesignerWindow.prototype.destroy = function() {
    this.selectedElement = null;

    Window.prototype.destroy.apply(this, arguments);
  };

  ApplicationIDEDesignerWindow.prototype.clear = function() {
  };

  ApplicationIDEDesignerWindow.prototype.getElement = function(xpath) {
    var target = null;
    try {
      target = OSjs.Applications.ApplicationIDE.getElementByXpath(xpath, this._$root);
    } catch ( e ) {}
    return target;
  };

  ApplicationIDEDesignerWindow.prototype.selectElement = function(el, clicked) {
    if ( this.selectedElement ) {
      Utils.$removeClass(this.selectedElement, 'ide-selected');
    }
    this.selectedElement = el;
    Utils.$addClass(this.selectedElement, 'ide-selected');
  };

  ApplicationIDEDesignerWindow.prototype.load = function() {
    var app = this._app;
    var project = app.currentProject;
    var windowName = project.getFragmentName();

    this._setTitle(windowName + '@' + project.name, true);
    this.render();
  };

  ApplicationIDEDesignerWindow.prototype.render = function() {
    var self = this;

    var app = this._app;
    var project = app.currentProject;
    var windowName = project.getFragmentName();

    var root = this._$root;
    Utils.$empty(root);
    project.scheme.render(this, windowName, root);

    var elements = OSjs.Applications.ApplicationIDE.Elements;
    var thispath = OSjs.Applications.ApplicationIDE.getXpathByElement(this._$root);

    function traverse(el) {
      if ( el.children ) {
        el.children.forEach(function(sel) {
          sel.setAttribute('data-ide-window', windowName);

          var tagName = sel.tagName.toLowerCase();
          if ( elements[tagName] ) {
            var cn = elements[tagName].isContainer;
            if ( cn ) {
              sel.setAttribute('data-ide-container', 'true');

              if ( cn === true ) {
                createDroppable(sel, function(data) {
                  var xpath = OSjs.Applications.ApplicationIDE.getXpathByElement(sel, self._$root);
                  app.onElementDropped(xpath, tagName, data.tagName);
                });
              } else {
                sel.getElementsByTagName(cn).forEach(function(cel) {
                  createDroppable(cel, function(data) {
                    var xpath = OSjs.Applications.ApplicationIDE.getXpathByElement(cel, self._$root);
                    app.onElementDropped(xpath, tagName, data.tagName);
                  });
                });
              }

            } else {
              sel.setAttribute('data-ide-element', 'true');
            }
          }

          traverse(sel);
        });
      }
    }

    traverse(root);
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationIDE = OSjs.Applications.ApplicationIDE || {};
  OSjs.Applications.ApplicationIDE.DesignerWindow = ApplicationIDEDesignerWindow;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);