// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    多段タブもどき実験版 CSS入れ替えまくりLiteバージョン
// @include        main
// @compatibility  Firefox 72
// @author         Alice0775
// @version        2016/08/05 00:00 Firefox 48
// @version        2016/05/01 00:01 hide favicon if busy
// @version        2016/03/09 00:01 Bug 1222490 - Actually remove panorama for Fx45+
// @version        2016/02/09 00:01 workaround css for lwt
// @version        2016/02/09 00:00
// ==/UserScript==
"use strict";
MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {

    /* #toolbar-menubar を #titlebar から #navigator-toolbox へ移動 */
    document.getElementById("titlebar").parentNode.insertBefore(document.getElementById("toolbar-menubar"),document.getElementById("titlebar"));

    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* ツールバー 並べ替え */
    #toolbar-menubar { -moz-box-ordinal-group: 1 !important; } /* メニューバー */
    #titlebar { -moz-box-ordinal-group: 2 !important; }        /* タブバー */
    #nav-bar { -moz-box-ordinal-group: 3 !important; }         /* ナビゲーションツールバー */
    #PersonalToolbar { -moz-box-ordinal-group: 4 !important; } /* ブックマークツールバー */

    /* ツールバーの調節 */
    [tabsintitlebar="true"] #toolbar-menubar { height: 29px; }
    [tabsintitlebar="true"][sizemode="maximized"] #navigator-toolbox { padding-top: 8px !important; }
    #titlebar,#tabbrowser-tabs { -moz-appearance: none !important; }

    /* Windows10のタイトルバーとウィンドウの境界線を白でFirefoxのテーマが既定の時 タイトルバーボタンがバックグラウンドカラーとかぶって見えなくなる状態の対処 */
    #main-window:not([lwtheme="true"]) #TabsToolbar .titlebar-buttonbox .titlebar-button,
    #main-window:not([lwtheme="true"]) #window-controls toolbarbutton { color: rgb(24, 25, 26) !important; }
    #main-window:not([lwtheme="true"]) #TabsToolbar .titlebar-buttonbox .titlebar-button:not(.titlebar-close):hover,
    #main-window:not([lwtheme="true"]) #window-controls toolbarbutton:not([id="close-button"]):hover {
        background-color: var(--lwt-toolbarbutton-hover-background, hsla(0,0%,70%,.4)) !important; }

    /* タイトルバーボタンの位置調節 */
    #navigator-toolbox:not([style^="margin-top:"])[style=""][inFullscreen="true"] #window-controls,
    [tabsintitlebar="true"] .titlebar-buttonbox-container { display: block; position: fixed; right:0; }
    [tabsintitlebar="true"][sizemode="normal"] .titlebar-buttonbox-container { top: 1px; }
    [tabsintitlebar="true"][sizemode="maximized"] .titlebar-buttonbox-container { top: 8px; }
    #navigator-toolbox:not([style^="margin-top:"])[style=""][inFullscreen="true"] #window-controls { top: 0; }

    /* タイトルバーボタンとナビゲーションツールバーのボタン類が被らないように右側にスペースを確保する */
    [tabsintitlebar="true"] #toolbar-menubar[autohide="true"][inactive="true"] ~ #nav-bar:not([inFullscreen="true"]) { padding-right: 139px !important; }
    #navigator-toolbox[inFullscreen="true"] #nav-bar { padding-right: 109px !important; }

    /* 多段タブ */
    tabs > arrowscrollbox { display: block; }
    scrollbox[part][orient="horizontal"] {
        display: flex;
        flex-wrap: wrap;
        max-height: calc(var(--tab-min-height) * 5); /* 段数(デフォルト5段) */
        overflow-x: hidden;
        overflow-y: auto; }
    /* tabs tab[fadein]:not([pinned]) { flex-grow: 1; } */
    tabs tab[fadein]:not([pinned]) {
        flex-grow: 1 !important;
        min-width: 150px !important;/* 最小値 デフォルト  76px */
        max-width: 150px !important;/* 最大値 デフォルト 225px */
    }
    tabs tab,.tab-background {
        height: var(--tab-min-height);
        overflow: hidden; }
    tab > .tab-stack { width: 100%; }

    /* タブが指定段数以上になると出てくるスクロールバーをマウスドラッグで上下出来るようにする */
    scrollbox[part][orient="horizontal"] > scrollbar { -moz-window-dragging: no-drag; }

    /* タブバー 左右のドラッグ領域 非表示
       左右 → hbox.titlebar-spacer
         左 → hbox.titlebar-spacer[type="pre-tabs"]
         右 → hbox.titlebar-spacer[type="post-tabs"] */
    hbox.titlebar-spacer
    ,
    /* 非表示 */
    #alltabs-button,tabs tab:not([fadein]),
    #toolbar-menubar[autohide="false"] + #titlebar #TabsToolbar .titlebar-buttonbox-container,
    [class="scrollbutton-up"],
    [class="scrollbutton-up"] ~ spacer,
    [class="scrollbutton-down"] { display: none; }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    var css =`
    tabs tab {
        border-left: solid 1px hsla(0,0%,50%,.5) !important;
        border-right: solid 1px hsla(0,0%,50%,.5) !important;
    }
    tabs tab:after,tabs tab:before { display: none !important; }
    `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);

    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = this.allTabs;
        for (let i = 0, len = tabs.length; i < len; i++) {
            tabs[i].style.removeProperty("border-left-color");
            tabs[i].style.removeProperty("border-right-color");
        }
    }
    gBrowser.tabContainer.addEventListener("dragleave", function(event) { this.clearDropIndicator(event); }, true);

    gBrowser.tabContainer.on_dragover = function(event) {
        this.clearDropIndicator();
        var effects = this._getDropEffectForTabDrag(event);
        var ind = this._tabDropIndicator;
        if (effects == "" || effects == "none") {
            ind.hidden = true;
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (effects == "link") {
            let tab = this._getDragTargetTab(event, true);
            if (tab) {
                if (!this._dragTime) {
                    this._dragTime = Date.now();
                }
                if (Date.now() >= this._dragTime + this._dragOverDelay) {
                    this.selectedItem = tab;
                }
                ind.hidden = true;
                return;
            }
        }
        let newIndex = this._getDropIndex(event, effects == "link");
        let children = this.allTabs;
        if (newIndex == children.length) {
            children[newIndex - 1].style.setProperty("border-right-color","red","important");
        } else {
            children[newIndex].style.setProperty("border-left-color","red","important");
        }
    }

    gBrowser.tabContainer.on_drop = function(event) {
        this.clearDropIndicator();
        var dt = event.dataTransfer;
        var dropEffect = dt.dropEffect;
        var draggedTab;
        let movingTabs;
        if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
            // tab copy or move
            draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
            // not our drop then
            if (!draggedTab) {
                return;
            }
            movingTabs = draggedTab._dragData.movingTabs;
            draggedTab.container._finishGroupSelectedTabs(draggedTab);
        }
        this._tabDropIndicator.hidden = true;
        event.stopPropagation();
        if (draggedTab && dropEffect == "copy") {
            // copy the dropped tab (wherever it's from)
            let newIndex = this._getDropIndex(event, false);
            let draggedTabCopy;
            for (let tab of movingTabs) {
                let newTab = gBrowser.duplicateTab(tab);
                gBrowser.moveTabTo(newTab, newIndex++);
                if (tab == draggedTab) {
                    draggedTabCopy = newTab;
                }
            }
            if (draggedTab.container != this || event.shiftKey) {
                this.selectedItem = draggedTabCopy;
            }
        } else if (draggedTab && draggedTab.container == this) {
            let oldTranslateX = Math.round(draggedTab._dragData.translateX);
            let tabWidth = Math.round(draggedTab._dragData.tabWidth);
            let translateOffset = oldTranslateX % tabWidth;
            let newTranslateX = oldTranslateX - translateOffset;
            if (oldTranslateX > 0 && translateOffset > tabWidth / 2) {
                newTranslateX += tabWidth;
            } else if (oldTranslateX < 0 && -translateOffset > tabWidth / 2) {
                newTranslateX -= tabWidth;
            }
            let dropIndex = this._getDropIndex(event, false);
            //  "animDropIndex" in draggedTab._dragData &&
            //  draggedTab._dragData.animDropIndex;
            let incrementDropIndex = true;
            if (dropIndex && dropIndex > movingTabs[0]._tPos) {
                dropIndex--;
                incrementDropIndex = false;
            }
            let animate = gBrowser.animationsEnabled;
            if (oldTranslateX && oldTranslateX != newTranslateX && animate) {
                for (let tab of movingTabs) {
                    tab.setAttribute("tabdrop-samewindow", "true");
                    tab.style.transform = "translateX(" + newTranslateX + "px)";
                    let onTransitionEnd = transitionendEvent => {
                        if (
                            transitionendEvent.propertyName != "transform" ||
                            transitionendEvent.originalTarget != tab
                        ) {
                            return;
                        }
                        tab.removeEventListener("transitionend", onTransitionEnd);
                        tab.removeAttribute("tabdrop-samewindow");
                        this._finishAnimateTabMove();
                        if (dropIndex !== false) {
                            gBrowser.moveTabTo(tab, dropIndex);
                            if (incrementDropIndex) {
                                dropIndex++;
                            }
                        }
                        gBrowser.syncThrobberAnimations(tab);
                    };
                    tab.addEventListener("transitionend", onTransitionEnd);
                }
            } else {
                this._finishAnimateTabMove();
                if (dropIndex !== false) {
                    for (let tab of movingTabs) {
                        gBrowser.moveTabTo(tab, dropIndex);
                        if (incrementDropIndex) {
                            dropIndex++;
                        }
                    }
                }
            }
        } else if (draggedTab) {
            let newIndex = this._getDropIndex(event, false);
            let newTabs = [];
            for (let tab of movingTabs) {
                let newTab = gBrowser.adoptTab(tab, newIndex++, tab == draggedTab);
                newTabs.push(newTab);
            }
            // Restore tab selection
            gBrowser.addRangeToMultiSelectedTabs(
                newTabs[0],
                newTabs[newTabs.length - 1]
            );
        } else {
            // Pass true to disallow dropping javascript: or data: urls
            let links;
            try {
                links = browserDragAndDrop.dropLinks(event, true);
            } catch (ex) {}
            if (!links || links.length === 0) {
                return;
            }
            let inBackground = Services.prefs.getBoolPref(
                "browser.tabs.loadInBackground"
            );
            if (event.shiftKey) {
                inBackground = !inBackground;
            }
            let targetTab = this._getDragTargetTab(event, true);
            let userContextId = this.selectedItem.getAttribute("usercontextid");
            let replace = !!targetTab;
            let newIndex = this._getDropIndex(event, true);
            let urls = links.map(link => link.url);
            let csp = browserDragAndDrop.getCSP(event);
            let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(
                event
            );
            (async () => {
                if (
                    urls.length >=
                    Services.prefs.getIntPref("browser.tabs.maxOpenBeforeWarn")
                ) {
                    // Sync dialog cannot be used inside drop event handler.
                    let answer = await OpenInTabsUtils.promiseConfirmOpenInTabs(
                        urls.length,
                        window
                    );
                    if (!answer) {
                        return;
                    }
                }
                gBrowser.loadTabs(urls, {
                    inBackground,
                    replace,
                    allowThirdPartyFixup: true,
                    targetTab,
                    newIndex,
                    userContextId,
                    triggeringPrincipal,
                    csp,
                });
            })();
        }
        if (draggedTab) {
            delete draggedTab._dragData;
        }
    }

    gBrowser.tabContainer._getDropIndex = function(event, isLink) {
        var tabs = this.allTabs;
        var tab = this._getDragTargetTab(event, isLink);
        if (!RTL_UI) {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                if (
                    event.screenY <
                    tabs[i].screenY + tabs[i].getBoundingClientRect().height
                ) {
                    if (
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                    ) {
                        return i;
                    }
                    if (
                        event.screenX >
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2 &&
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width
                    ) {
                        return i + 1;
                    }
                }
            }
        } else {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                if (
                    event.screenY <
                    tabs[i].screenY + tabs[i].getBoundingClientRect().height
                ) {
                    if (
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width &&
                        event.screenX >
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                    ) {
                        return i;
                    }
                    if (
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                    ) {
                        return i + 1;
                    }
                }
            }
        }
        return tabs.length;
    }

}
