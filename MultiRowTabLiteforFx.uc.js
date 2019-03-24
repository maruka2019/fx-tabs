// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    多段タブもどき実験版 CSS入れ替えまくりLiteバージョン
// @include        main
// @compatibility  Firefox 66
// @author         Alice0775
// @version        2016/08/05 00:00 Firefox 48
// @version        2016/05/01 00:01 hide favicon if busy
// @version        2016/03/09 00:01 Bug 1222490 - Actually remove panorama for Fx45+
// @version        2016/02/09 00:01 workaround css for lwt
// @version        2016/02/09 00:00
// ==/UserScript==
"user strict";
MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {
    var css =`
    /* 多段タブ */
    tabs>arrowscrollbox{display:block;}
    tabs arrowscrollbox>scrollbox {
        display:flex;flex-wrap:wrap;
        max-height: calc(var(--tab-min-height) * 5); /* 段数 */
        overflow-x:hidden;overflow-y:auto;
    }
    [tabsintitlebar="true"] tabs scrollbar{-moz-window-dragging:no-drag;} /* タブが指定段数以上になると出てくるスクロールバーをマウスドラッグで上下出来るようにする */
    tabs tab[fadein]:not([pinned]) {
        flex-grow: 1 !important;
        min-width: 150px !important;/* 最小値 デフォルト  76px */
        max-width: 150px !important;/* 最大値 デフォルト 225px */
    }
    tabs tab,.tab-background {
        height: var(--tab-min-height);
        overflow: hidden;
        z-index: 1 !important;
    }
    tab>.tab-stack{width:100%;}
    [sizemode="fullscreen"] #TabsToolbar>#window-controls,
    .titlebar-buttonbox-container>.titlebar-buttonbox{display:block;}
    [sizemode="fullscreen"] #TabsToolbar>#window-controls>toolbarbutton {
        padding: 10px 12px !important;
    }
    .titlebar-buttonbox>.titlebar-button {
        padding: 10px 17px !important;
    }
    /* タブバー 左右のドラッグ領域 非表示
       左右 → hbox.titlebar-spacer 左 → hbox.titlebar-spacer[type="pre-tabs"] 右 → hbox.titlebar-spacer[type="post-tabs"] */
    hbox.titlebar-spacer,
    /* 非表示 */
    #alltabs-button,tabs [class^="scrollbutton"],tabs spacer,tab:not([fadein]) { display: none; }
    `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    var style = ' \
    tabs tab:not(stack) { \
        border-left: solid 1px hsla(0,0%,50%,.5) !important; \
        border-right: solid 1px hsla(0,0%,50%,.5) !important; \
    } \
    tabs tab:after,tabs tab:before{display:none!important;} \
    ';
    var sspi = document.createProcessingInstruction('xml-stylesheet',
    'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"');
    document.insertBefore(sspi, document.documentElement);
    gBrowser.tabContainer._animateTabMove = function(event){}
    gBrowser.tabContainer._finishAnimateTabMove = function(event){}
    gBrowser.tabContainer.lastVisibleTab = function() {
        var tabs = this.children;
        for (let i = tabs.length - 1; i >= 0; i--){
            if (!tabs[i].hasAttribute("hidden"))
                return i;
        }
        return -1;
    };
    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = this.children;
        for (let i = 0, len = tabs.length; i < len; i++){
            let tab_s= tabs[i].style;
            tab_s.removeProperty("border-left-color");
            tab_s.removeProperty("border-right-color");
        }
    };
    gBrowser.tabContainer.addEventListener("dragleave",gBrowser.tabContainer.clearDropIndicator, false);
    gBrowser.tabContainer._onDragOver = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clearDropIndicator();
        var newIndex = this._getDropIndex(event);
        if (newIndex == null)
            return;
        if (newIndex < this.children.length) {
            this.children[newIndex].style.setProperty("border-left-color","red","important");
        } else {
            newIndex = gBrowser.tabContainer.lastVisibleTab();
            if (newIndex >= 0)
                this.children[newIndex].style.setProperty("border-right-color","red","important");
        }
    };
    gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, false);
    gBrowser.tabContainer._getDropIndex = function(event, isLink) {
        var tabs = this.children;
        var tab = this._getDragTargetTab(event, isLink);
        if (!RTL_UI) {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
                if (event.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2
                 && event.screenY < tabs[i].boxObject.screenY + tabs[i].boxObject.height) // multirow fix
                
                    return i;
        } else {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
                if (event.screenX > tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2
                 && event.screenY < tabs[i].boxObject.screenY + tabs[i].boxObject.height) // multirow fix
                    return i;
        }
        return tabs.length;
    };
    gBrowser.tabContainer.onDrop = function(event) {
        this.clearDropIndicator();
        var dt = event.dataTransfer;
        var draggedTab;
        if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
            draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
            if (!draggedTab)
                return;
        }
        this._tabDropIndicator.collapsed = true;
        event.stopPropagation();
        if (draggedTab && draggedTab.parentNode == this) {
            let newIndex = this._getDropIndex(event, false);
            if (newIndex > draggedTab._tPos)
                newIndex--;
            gBrowser.moveTabTo(draggedTab, newIndex);
        }
    };
    gBrowser.tabContainer.addEventListener("drop",gBrowser.tabContainer.onDrop, false);
}