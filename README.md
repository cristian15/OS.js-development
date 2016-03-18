# OS.js Development Packages

This repository contains Development packages for [OS.js](https://github.com/os-js/OS.js).

Follow [the official instructions](https://os.js.org/doc/manuals/man-package-manager.html) on how to add this repository.

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/os-js/OS.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Tips](https://img.shields.io/gratipay/os-js.svg)](https://gratipay.com/os-js/)
[![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=andersevenrud%40gmail%2ecom&lc=NO&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)
[![Support](https://img.shields.io/badge/patreon-support-orange.svg)](https://www.patreon.com/user?u=2978551&ty=h&u=2978551)

## IDE

This is my second attempt at creating a Interface Designer and IDE for OS.js.

*Last time I actually deleted my entire work (which was almost complete) by accident... And I did not commit it anywhere*... yeah!

![ScreenShot](https://raw.githubusercontent.com/os-js/OS.js-development/master/doc/ide.png)

#### Status

In progress, basic interface designing works. You can create, save and load projects.

**Does not work properly in firefox due to a [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=568313) in the browser**

#### TODO

* [x] Simple project loading
* [x] Window Rendering
* [x] GUI Element toolbar
* [x] Proper project loading and sessions
* [x] Project saving
* [x] Multiple window support (not finished: adding)
* [x] Adding elements
* [x] Removing elements
* [x] Parameter viewing
* [x] Parameter setting
* [x] File Browser (not finished)
* [ ] Source Editor Window
* [ ] Menu Editor
* [ ] Dropdown Editor
* [x] Metadata Editor (not finished)
* [x] Inline fragment support
* [ ] Element movement in the property window
* [ ] Add tooltips/overlays (helpers) on elements that does not render (like when you don't set your flexboxes right)
* [ ] Add all elements and correct properties


**BUGS**

* [ ] Save currently selected tab element so desiging tabs are less of a pain
* [ ] Set default window attributes (width/height does not reflect actual result by default)
* [ ] Update className on metadata change (**do not change this one at the moment, name your project correctly from the start**)
* [ ] https://bugzilla.mozilla.org/show_bug.cgi?id=568313
