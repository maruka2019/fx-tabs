// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    多段タブもどき実験版 CSS入れ替えまくりLiteバージョン
// @include        main
// @compatibility  Firefox 128esr, 131+
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
if (!window.gBrowser) { return; }

    // -- Config --
    // 同じ様なCSSを書いた場合「userChrome.css」が優先されます。

    const                                                // タブバーの段数
    TabBar_Rows =                           	true	,// [false] = 段数無制限
                                                         //  true   = 段数指定
    Max_Rows =                              	5   	,// 段数指定 デフォルト3段
                                                         // タブバーの段数「true」用 通常1段にしてタブバーをマウスオーバーで2段目以降を指定した段数まで表示
    MultiRowTab_on_MouseOver =              	false	,// [false] = 設定しない デフォルト
                                                         //  true   = 設定する
    TabBar_MouseOver_DisplayTime =          	1   	,// マウスオーバーで2段目以降を表示した後の表示時間(秒)が設定出来ます。設定した数値分(秒)表示してから1段に戻ります。

                                                         // タブの見た目 ProtonUI
    Proton_Margins =                        	true	,// [true] = ProtonUI、デフォルト
                                                         //  false = Firefox90以前の設定で「browser.proton.enabled」を「false」にした時の見た目にする。
                                                         //          タブの周囲にある空白を0にしてUI密度の高さに設定するのでデフォルトより横に4px広がって高さが8px低くなります。
                                                         // タブの横に境界線
    Tab_Separators  =                       	false	,// [false] = 表示しない
                                                         //  true   = 表示する
                                                         // Firefox90以前の設定で「browser.proton.enabled」を「false」にすると表示出来ていた境界線のCSSを抽出して調整しています。

                                                         // タブバーの位置
    TabBar_Position =                       	0   	,// [0] = ツールバーの上 デフォルト
                                                         //  1  = ツールバーの下
                                                         //  2  = ウインドウの下
                                                         // タブバーの位置デフォルト用 タイトルバーボタン[－□×]を隠くしてその分タブバーの横幅を広く使う。
    TitleBarButton_Autohide =               	false	,// [false] = 使用しない
                                                         //  true   = 使用する
                                                         // タイトルバーボタン[－□×]の外枠を小さくして透明化、タブバーの右上をマウスオーバーで元のサイズに戻して透明化を解除。
    TitleBarButton_DisplayTime =            	0.6   	,// マウスオーバーで元のサイズに戻して透明化を解除した後の表示時間(秒)が設定出来ます。設定した数値分(秒)表示してから隠れます。

                                                         // タブの高さ UI密度
    UI_Density_Compact =                    	29   	,// デフォルト29px コンパクト
    UI_Density_Normal =                     	36   	,// デフォルト36px 通常
    UI_Density_Touch =                      	41   	,// デフォルト41px タッチ

                                                         // タブの横幅
    Tab_Min_Width =                         	46   	,// デフォルト76px  最小値
    Tab_Max_Width =                         	46   	,// デフォルト225px 最大値
                                                         // 指定する数値を両方同じにすると横幅が固定化します。

                                                         // タブを閉じるボタン
    Tab_Close_Button =                      	1   	,// [0] = デフォルト
                                                         //  1  = 非表示
                                                         //  2  = すべてのタブに表示
                                                         //  3  = タブをマウスオーバーで表示
                                                         //  4  = アクティブタブは常に表示、非アクティブタブはマウスオーバーで表示 ※垂直タブモードのデフォルトです。

                                                         // タブをドラッグ＆ドロップの移動中に表示する「tabDropIndicator」の差し替え
    Tab_Drop_Indicator =                    	false	,// [false] = しない ピン📍アイコン デフォルト
                                                         //  true   = する   赤線アイコン(2px×29px)

                                                         // ピン留めタブの位置
    Separate_Tabs_and_PinnedTabs =          	false	,// [false] = デフォルト
                                                         //  true   = ピン留めタブをタブの行から分離して上に出来る行へ移動する。
                                                         // ピン留めタブの位置「true」用 ピン留めタブの横幅を調整
    PinnedTab_Width =                       	false	,// [false] = しない デフォルト
                                                         //  true   = する   タブの横幅の様にピン留めタブの横幅を調整する
    PinnedTab_Min_Width =                   	76   	,// デフォルト76px  最小値
    PinnedTab_Max_Width =                   	225   	,// デフォルト225px 最大値
                                                         // 指定する数値を両方同じにすると横幅が固定化します。

                                                         // タブバーのドラッグ領域
    Left_Drag_Area =                        	0   	,// デフォルト40px 左のドラッグ領域
    Right_Drag_Area =                       	0   	,// デフォルト40px 右のドラッグ領域
    Maximize_Left_Drag_Area =               	false	,// [false] = デフォルト
                                                         //  true   = ウィンドウを最大化した時、非表示になる左のドラッグ領域が表示出来ます。
    Fullscreen_Drag_Area =                  	false	,// [false] = デフォルト
                                                         //  true   = フルスクリーンにした時、非表示になる左右のドラッグ領域が表示出来ます。

                                                         // タブを一覧表示するボタン
    All_Tabs_Button =                       	false	,// [false] = 非表示
                                                         //  true   = 表示

                                                         // Firefox132以降？
                                                         // 垂直タブバーにマウスオーバーで横幅を開閉
    VerticalTabs_MouseOver_OpenClose =      	false	,// [false] しない デフォルト 垂直タブモードでサイドバーボタンを押すと横幅を広げたり狭めたりの開閉が出来ます。
                                                         //  true   する   垂直タブモードでサイドバーボタンを押してどちらを選んでもマウスオーバーで横幅を広げたり狭めたりの開閉が出来ます。

    // -- Config End --

    css = `

    #TabsToolbar:has([orient="horizontal"]) {

      :root[uidensity="compact"] & {
        --tab-min-height: ${UI_Density_Compact}px;
      }
      :root:not([uidensity]) & {
        --tab-min-height: ${UI_Density_Normal}px;
      }
      :root[uidensity="touch"] & {
         --tab-min-height: ${UI_Density_Touch}px;
      }

      ${Tab_Drop_Indicator ? `
        #tabbrowser-tabs > .tab-drop-indicator {
          background: url(
            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAdCAIAAAAPVCo9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY3growJEQ5+SUQEAOb1EM8kwskcAAAAASUVORK5CYII=
          ) no-repeat center !important;
        }
      ` : ``}

      .titlebar-spacer[type="pre-tabs"] {
        width: ${Left_Drag_Area}px;
      }
      .titlebar-spacer[type="post-tabs"] {
        width: ${Right_Drag_Area}px;
      }
      ${Maximize_Left_Drag_Area ? `
        .titlebar-spacer {
          :root[tabsintitlebar]:not([sizemode="normal"], [inFullscreen]) &[type="pre-tabs"] {
            display: block !important;
          }
        }
      ` : ``}
      ${Fullscreen_Drag_Area ? `
        .titlebar-spacer {
          :root[tabsintitlebar][inFullscreen] & {
            display: block !important;
          }
        }
      ` : ``}

      ${All_Tabs_Button ? `` : `
        #alltabs-button {
          display: none;
        }
      `}

      ${Separate_Tabs_and_PinnedTabs ? `
        #tabbrowser-tabs {
          padding: 0 !important;
          & + #new-tab-button {
            display: none !important;
          }

          #tabbrowser-arrowscrollbox {
            &:has(> .tabbrowser-tab[fadein][pinned]) {
              &::part(scrollbox) {
                &:has(+ spacer) > slot::after,
                .scrollbox-clip > &::after {
                  display: flow-root list-item;
                  content: "";
                  flex-basis: -moz-available;
                  height: 0;
                  overflow: hidden;
                }
              }
            }
            .tabbrowser-tab[fadein] {
              &:not([pinned]) {
                #tabbrowser-tabs[haspinnedtabs] & {
                  &, & + :not(#tabs-newtab-button) {
                    order: 1;
                  }
                }
              }

              &[pinned] {
                .tab-loading-burst:after {
                  content: "📌";
                  font-size: 11px;
                  right: -2px;
                  position: absolute;
                  top: -2px;
                }
              }

              ${PinnedTab_Width ? `
                &[pinned] {
                  flex: 100 100;
                  max-width: ${PinnedTab_Max_Width}px;
                  min-width: ${PinnedTab_Min_Width}px;
                }
                .tab-throbber, .tab-icon-pending, .tab-icon-image, .tab-sharing-icon-overlay, .tab-icon-overlay {
                  &[pinned] {
                    margin-inline-end: 5.5px !important;
                  }
                }
              ` : ``}

            }
          }
        }
      ` : ``}

      #tabbrowser-arrowscrollbox {
        &::part(scrollbox) {
          &:has(+ spacer) > slot,
          .scrollbox-clip > & {
            flex-wrap: wrap;
          }

          ${TabBar_Rows ? `

            ${MultiRowTab_on_MouseOver ? `
              max-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
              scrollbar-width: none;
              transition: all 0s ease-in-out ${TabBar_MouseOver_DisplayTime}s;
              &:hover {
                max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${Max_Rows}) !important;
                scrollbar-width: auto !important;
                transition: none 0s !important;
              }
            ` : `
              max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${Max_Rows});
            `}

            overflow: hidden auto;
            & scrollbar {
              -moz-window-dragging: no-drag;
            }
          ` : ``}

        }

        &::part(overflow-start-indicator),
        &::part(overflow-end-indicator),
        &::part(scrollbutton-up),
        &::part(scrollbutton-down) {
          display: none;
        }

        .tabbrowser-tab[fadein]:not([pinned]) {
          max-width: ${Tab_Max_Width}px;
          min-width: ${Tab_Min_Width}px;

          ${Tab_Close_Button == 1 ? `
            .tab-close-button {
              display: none !important;
            }
          ` : Tab_Close_Button == 2 ? `
            .tab-close-button {
              display: block !important;
            }
          ` : Tab_Close_Button == 3 ? `
            .tab-close-button {
              opacity: 0;
            }
            &:hover .tab-close-button {
              display: block !important;
              opacity: 1;
            }
          ` : Tab_Close_Button == 4 ? `
            .tab-close-button {
              opacity: 0;
            }
            &:hover .tab-close-button,
            .tab-close-button[selected] {
              display: block !important;
              opacity: 1;
            }
          ` : ``}
        }

        #tabbrowser-tabs[haspinnedtabs]:not([positionpinnedtabs]):not([orient="vertical"]) > & {
          &  > .tabbrowser-tab:nth-child(1 of :not([pinned], [hidden])) {
            margin-inline-start: 0 !important;
          }
        }

      }

      ${Tab_Separators ? `
        .titlebar-spacer[type="pre-tabs"] {
          border-inline-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
        }
        .tabbrowser-tab {
          &::after,
          &::before {
            border-left: 1px solid color-mix(in srgb, currentColor 50%, transparent);
            height: calc(var(--tab-min-height) - 15%);
            margin-block: auto;
          }
          &:hover::after,
          &[multiselected]::after,
          #tabbrowser-tabs:not([movingtab]) &:has(+ .tabbrowser-tab:hover)::after,
          #tabbrowser-tabs:not([movingtab]) &:has(+ [multiselected])::after {
            height: 100%;
          }
          &::after,
          #tabbrowser-tabs[movingtab] &[visuallyselected]::before {
            display: block;
            content: "";
          }
        }
      ` : ``}

      ${Proton_Margins ? `` : `
        .tabbrowser-tab,
        .toolbarbutton-1 {
          padding: 0 !important;
        }
        .tabbrowser-tab,
        #tabs-newtab-button {
          height: var(--tab-min-height) !important;
        }
        .tab-background {
          box-shadow: none !important;
          margin-block: 0 !important;
        }
        .tabbrowser-tab[usercontextid] > .tab-stack > .tab-background > .tab-context-line {
          margin-block-start: 1px !important;
        }
      `}

    ${TabBar_Position == 0 ? `
      .titlebar-buttonbox-container {
        height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
      }

      ${TitleBarButton_Autohide ? `
        .titlebar-buttonbox-container {
          background-color: color-mix(in srgb, currentColor 20%, transparent);
          height: 6px !important;
          opacity: 0;
          position: fixed;
          right: 0;
          transition: all 0s ease-in-out ${TitleBarButton_DisplayTime}s;
          z-index: 2147483647;
          .titlebar-button {
            opacity: 0;
            padding: 0;
            transition: all 0s ease-in-out ${TitleBarButton_DisplayTime}s;
          }
          &:hover {
            height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) !important;
            opacity: 1;
            transition: none 0s;
            .titlebar-button {
              opacity: 1;
              padding: 8px 17px;
              transition: none 0s;
            }
          }
        }
      ` : ``}

    }` : `}
      #nav-bar {
        :root:not([inFullscreen]) #toolbar-menubar:not([inactive]) + & {
          & > .titlebar-buttonbox-container {
            display: none;
          }
        }
        .titlebar-button {
          padding-block: 0;
        }
      }

      ${TabBar_Position == 2 ? `
        body {
          & > #fullscr-toggler[hidden] + tabbox,
          :root[inFullscreen] & > tabbox:hover {
            border-top: 0.5px solid var(--toolbar-bgcolor);
          }
          & > tabbox > #navigator-toolbox {
            border-block: none !important;
          }
          :root[inFullscreen] & {
            & > #navigator-toolbox {
              transition: none;
              &:has(~ tabbox:hover) {
                margin-top: 0 !important;
              }
              &:hover ~ tabbox > #navigator-toolbox {
                max-height: 100%;
            }}
            & > tabbox:not(:hover) {
              border-top: 0.5px solid transparent;
              & > #navigator-toolbox {
                max-height: 0;
              }
            }
          }
        }
      ` : ``}

    `}

    ${VerticalTabs_MouseOver_OpenClose ? `
      #sidebar-main:has(sidebar-main > [collapsed="false"]) {
        sidebar-main {
          #tabbrowser-arrowscrollbox {
            &[overflowing]:not([scrolledtoend]) {
              mask-image: none !important;
            }
          }
          &[expanded] {
            #tabbrowser-tabs[haspinnedtabs] {
              #vertical-pinned-tabs-container-separator {
                display: block !important;
              }
            }
          }
        }
        &:hover {
          sidebar-main {
            &[expanded] {
              #vertical-pinned-tabs-container-separator {
                width: 226px !important;
              }
              #tabbrowser-arrowscrollbox {
                .tabbrowser-tab {
                  .tab-close-button {
                    padding-inline-start: 4px !important;
                  }
                }
              }
            }
            &:not([expanded]) {
              #tabbrowser-tabs[haspinnedtabs] {
                #vertical-pinned-tabs-container {
                  display: flex !important;
                  flex-direction: column !important;
                }
              }
              .tabbrowser-tab {
                #vertical-pinned-tabs-container &,
                #tabbrowser-arrowscrollbox & {
                  width: 234px !important;
                  transition: none;
                  max-width: 234px !important;
                  .tab-background {
                    width: 226px !important;
                    max-width: 226px !important;
                  }
                  &:hover .tab-close-button,
                  .tab-close-button[selected],
                  .tab-label-container {
                    display: block !important;
                  }
                }
                #vertical-pinned-tabs-container & {
                  .tab-close-button {
                    padding-inline-start: 0px !important;
                  }
                }
                #tabbrowser-arrowscrollbox {
                  .tabbrowser-tab {
                    .tab-close-button {
                      padding-inline-end: 2px !important;
                    }
                  }
                }
                #tabbrowser-arrowscrollbox & {
                  #tabbrowser-tabs[overflow] & {
                    .tab-background {
                      width: 218px !important;
                    }
                  }
                }
                .tab-icon-image {
                  #vertical-pinned-tabs-container & {
                    margin-inline: 7px !important;
                  }
                  #tabbrowser-arrowscrollbox & {
                    padding-inline-end: 7.5px !important;
                  }
                }
              }
              [id*="tabs-newtab-button"] {
                width: 226px !important;
                .toolbarbutton-icon {
                  margin-inline-end: 2px !important;
                }
                .toolbarbutton-text {
                  display: block !important;
                }
              }
            }
          }
        }
        &:not(:hover) {
          * {
            font-size: 0 !important;
          }
          sidebar-main {
            width: 55px !important;
            #tabbrowser-arrowscrollbox::part(scrollbox),
            #vertical-pinned-tabs-container {
              scrollbar-width: none !important;
            }
            &[expanded] {
              #vertical-pinned-tabs-container {
                .tabbrowser-tab {
                 width: 38px !important;
                }
              }
              #vertical-pinned-tabs-container-separator {
                #tabbrowser-tabs[haspinnedtabs] & {
                  width: 36px !important;
                }
              }
              #tabbrowser-arrowscrollbox {
                .tabbrowser-tab {
                   width: 56px !important;
                  .tab-close-button {
                    display: none !important;
                  }
                }
              }
            }
          }
        }
      }
      #sidebar-main:has(sidebar-main:not([hidden]) > [collapsed="true"]) {
        &:not([expanded]) {
          width: 165px;
        }
      }
      .wrapper {
        :not(:hover) button-group:not(.bottom-actions) {
          moz-button {
            width: 55px !important;
          }
        }
        &:has(.bottom-actions) {
          moz-button {
            width: 170px !important;
          }
        }
      }
      button > span {
        &.button-background {
            width: 226px !important;
          &.labelled {
            & > img {
              margin-inline-start: 2px;
            }
          }
          &:not(.labelled) {
            width: 226px !important;
            max-width: 100%;
            & > img {
              margin-inline-start: 7px;
              & + label {
                text-align: start;
                width: 226px !important;
                & > slot:after {
                  font-size: var(--font-size-large);
                  font-weight: var(--font-weight);
                  margin-inline-start: 7px;
                }
              }
              &[src*="view-syncedtabs"] + label > slot:after {
                content: "他の端末からのタブ";
              }
              &[src*="view-history"] + label > slot:after {
                content: "履歴";
              }
              &[src*="bookmark-hollow"] + label > slot:after {
                content: "ブックマーク";
              }
              &[src*="category-general"] + label > slot:after {
                content: "サイドバーをカスタマイズ";
              }
            }
          }
        }
      }
    ` : ``}

    `,
    sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
    uri = Services.io.newURI("data:text/css;charset=UTF=8," + encodeURIComponent(css));
    ["0", "2", "dragend", "SSTabRestored", "TabAttrModified"].find(eventType => {
      if(!sss.sheetRegistered(uri, eventType)) sss.loadAndRegisterSheet(uri, eventType);
      if (TabBar_Rows == true) {
        gBrowser.tabContainer.addEventListener(eventType, (e) => {
          e.target.scrollIntoView({ behavior: "instant", block: "nearest" })
        })
      }
    })

    if (TabBar_Position == 1 || TabBar_Position == 2) {
      document.getElementById("nav-bar").appendChild(
        document.querySelector("#TabsToolbar > .titlebar-buttonbox-container")
      )
      document.getElementById("navigator-toolbox").prepend(
        document.getElementById("toolbar-menubar"),
        document.getElementById("nav-bar"),
        document.getElementById("PersonalToolbar"),
        document.adoptNode(document.getElementById("titlebar")),
      )
    }
    if (TabBar_Position == 2) {
      document.body.appendChild(
        document.createXULElement("tabbox")
      ).appendChild(
        document.importNode(document.getElementById("navigator-toolbox"))
      ).appendChild(
        document.adoptNode(document.getElementById("titlebar"))
      )
    }

    gBrowser.tabContainer.addEventListener("dragover", function(event) { this._on_dragover(event); }, false)
    gBrowser.tabContainer.addEventListener("drop", function(event) { this._on_drop(event); }, false)
    gBrowser.tabContainer.on_dragover = function(event) { return false; }
    gBrowser.tabContainer.on_drop = function(event) { return false; }

    gBrowser.tabContainer._on_dragover = function(event) {
      var effects = this.getDropEffectForTabDrag(event);

      var ind = this._tabDropIndicator;
      if (effects == "" || effects == "none") {
        ind.hidden = true;
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      var arrowScrollbox = this.arrowScrollbox;

      // autoscroll the tab strip if we drag over the scroll
      // buttons, even if we aren't dragging a tab, but then
      // return to avoid drawing the drop indicator
      var pixelsToScroll = 0;
      if (this.overflowing) {
        switch (event.originalTarget) {
          case arrowScrollbox._scrollButtonUp:
            pixelsToScroll = arrowScrollbox.scrollIncrement * -1;
            break;
          case arrowScrollbox._scrollButtonDown:
            pixelsToScroll = arrowScrollbox.scrollIncrement;
            break;
        }
        if (pixelsToScroll) {
          arrowScrollbox.scrollByPixels(
            (RTL_UI ? -1 : 1) * pixelsToScroll,
            true
          );
        }
      }

      if (this.verticalMode) {

      let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
      if (
        (effects == "move" || effects == "copy") &&
        this == draggedTab.container &&
        !draggedTab._dragData.fromTabList
      ) {
        ind.hidden = true;

        if (!this._isGroupTabsAnimationOver()) {
          // Wait for grouping tabs animation to finish
          return;
        }
        this._finishGroupSelectedTabs(draggedTab);

        if (effects == "move") {
          // Pinned tabs in expanded vertical mode are on a grid format and require
          // different logic to drag and drop
          if (this._isContainerVerticalPinnedExpanded(draggedTab)) {
            this._animateExpandedPinnedTabMove(event);
            return;
          }
          this._animateTabMove(event);
          return;
        }
      }

      this._finishAnimateTabMove();

      }

      if (effects == "link") {
        let tab = this._getDragTargetTab(event, { ignoreTabSides: true });
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

      var rect = arrowScrollbox.getBoundingClientRect();
      var newMargin, newMarginY;
      if (pixelsToScroll) {
        // if we are scrolling, put the drop indicator at the edge
        // so that it doesn't jump while scrolling
        let scrollRect = arrowScrollbox.scrollClientRect;
        let minMargin = this.verticalMode
          ? scrollRect.top - rect.top
          : scrollRect.left - rect.left;
        let maxMargin = this.verticalMode
          ? Math.min(minMargin + scrollRect.height, scrollRect.bottom)
          : Math.min(minMargin + scrollRect.width, scrollRect.right);
        if (RTL_UI) {
          [minMargin, maxMargin] = [
            this.clientWidth - maxMargin,
            this.clientWidth - minMargin,
          ];
        }
        newMargin = pixelsToScroll > 0 ? maxMargin : minMargin;
      } else {
        let newIndex = this._getDropIndex(event);
        let children = this.allTabs;
        if (newIndex == children.length) {
          let tabRect = this._getVisibleTabs().at(-1).getBoundingClientRect();
          if (this.verticalMode) {
            newMargin = tabRect.bottom - rect.top;
          } else if (RTL_UI) {
            newMargin = rect.right - tabRect.left;
          } else {
            newMargin = tabRect.right - rect.left;
          }
            newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
        } else {
          let tabRect = children[newIndex].getBoundingClientRect();
          if (this.verticalMode) {
            newMargin = rect.top - tabRect.bottom;
          } else if (RTL_UI) {
            newMargin = rect.right - tabRect.right;
          } else {
            newMargin = tabRect.left - rect.left;
          }
            newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
        }
      }

      ind.hidden = false;
      newMargin += this.verticalMode ? ind.clientHeight : ind.clientWidth / 2;
      if (RTL_UI) {
        newMargin *= -1;
      }
      ind.style.transform = this.verticalMode
        ? "translateY(" + Math.round(newMargin) + "px)"
        : "translate(" + Math.round(newMargin) + "px, " + Math.round(newMarginY) + "px)";
    }

    gBrowser.tabContainer._on_drop = function(event) {
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
        let newIndex = this._getDropIndex(event);
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
        let oldTranslateY = Math.round(draggedTab._dragData.translateY);
        let tabWidth = Math.round(draggedTab._dragData.tabWidth);
        let tabHeight = Math.round(draggedTab._dragData.tabHeight);
        let translateOffsetX = oldTranslateX % tabWidth;
        let translateOffsetY = oldTranslateY % tabHeight;
        let newTranslateX = oldTranslateX - translateOffsetX;
        let newTranslateY = oldTranslateY - translateOffsetY;

        // Update both translate axis for pinned vertical expanded tabs
        if (oldTranslateX > 0 && translateOffsetX > tabWidth / 2) {
          newTranslateX += tabWidth;
        } else if (oldTranslateX < 0 && -translateOffsetX > tabWidth / 2) {
          newTranslateX -= tabWidth;
        }
        if (oldTranslateY > 0 && translateOffsetY > tabHeight / 2) {
          newTranslateY += tabHeight;
        } else if (oldTranslateY < 0 && -translateOffsetY > tabHeight / 2) {
          newTranslateY -= tabHeight;
        }

        let dropIndex;
        if (draggedTab._dragData.fromTabList) {
          dropIndex = this._getDropIndex(event);
        } else {
          dropIndex = this.verticalMode ?
            "animDropIndex" in draggedTab._dragData &&
            draggedTab._dragData.animDropIndex
            : this._getDropIndex(event);
        }
        let incrementDropIndex = true;
        if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
        }

        let shouldTranslate;
        if (this._isContainerVerticalPinnedExpanded(draggedTab)) {
          shouldTranslate =
            ((oldTranslateX && oldTranslateX != newTranslateX) ||
              (oldTranslateY && oldTranslateY != newTranslateY)) &&
            !gReduceMotion;
        } else if (this.verticalMode) {
          shouldTranslate =
            oldTranslateY && oldTranslateY != newTranslateY && !gReduceMotion;
        } else {
          shouldTranslate =
            oldTranslateX && oldTranslateX != newTranslateX && !gReduceMotion;
        }

        if (shouldTranslate) {
          for (let tab of movingTabs) {
            tab.toggleAttribute("tabdrop-samewindow", true);
            tab.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
            let postTransitionCleanup = () => {
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
            if (gReduceMotion) {
              postTransitionCleanup();
            } else {
              let onTransitionEnd = transitionendEvent => {
                if (
                  transitionendEvent.propertyName != "transform" ||
                  transitionendEvent.originalTarget != tab
                ) {
                  return;
                }
                tab.removeEventListener("transitionend", onTransitionEnd);

                postTransitionCleanup();
              };
              tab.addEventListener("transitionend", onTransitionEnd);
            }
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
        // Move the tabs. To avoid multiple tab-switches in the original window,
        // the selected tab should be adopted last.
        const dropIndex = this._getDropIndex(event);
        let newIndex = dropIndex;
        let selectedTab;
        let indexForSelectedTab;
        for (let i = 0; i < movingTabs.length; ++i) {
          const tab = movingTabs[i];
          if (tab.selected) {
            selectedTab = tab;
            indexForSelectedTab = newIndex;
          } else {
            const newTab = gBrowser.adoptTab(tab, newIndex, tab == draggedTab);
            if (newTab) {
              ++newIndex;
            }
          }
        }
        if (selectedTab) {
          const newTab = gBrowser.adoptTab(
            selectedTab,
            indexForSelectedTab,
            selectedTab == draggedTab
          );
          if (newTab) {
            ++newIndex;
          }
        }

        // Restore tab selection
        gBrowser.addRangeToMultiSelectedTabs(
          gBrowser.tabs[dropIndex],
          gBrowser.tabs[newIndex - 1]
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

        let targetTab = this._getDragTargetTab(event, { ignoreTabSides: true });
        let userContextId = this.selectedItem.getAttribute("usercontextid");
        let replace = !!targetTab;
        let newIndex = this._getDropIndex(event);
        let urls = links.map(link => link.url);
        let csp = browserDragAndDrop.getCsp(event);
        let triggeringPrincipal =
          browserDragAndDrop.getTriggeringPrincipal(event);

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

    gBrowser.tabContainer._isContainerVerticalPinnedExpanded = function(tab) {
      return (
        this.verticalMode &&
        tab.hasAttribute("pinned") &&
        this.hasAttribute("expanded")
      );
    }

    gBrowser.tabContainer._animateExpandedPinnedTabMove = function(event) {
      let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
      let movingTabs = draggedTab._dragData.movingTabs;

      if (!this.hasAttribute("movingtab")) {
        this.toggleAttribute("movingtab", true);
        gNavToolbox.toggleAttribute("movingtab", true);
        if (!draggedTab.multiselected) {
          this.selectedItem = draggedTab;
        }
      }

      if (!("animLastScreenX" in draggedTab._dragData)) {
        draggedTab._dragData.animLastScreenX = draggedTab._dragData.screenX;
      }
      if (!("animLastScreenY" in draggedTab._dragData)) {
        draggedTab._dragData.animLastScreenY = draggedTab._dragData.screenY;
      }

      let screenX = event.screenX;
      let screenY = event.screenY;

      if (
        screenY == draggedTab._dragData.animLastScreenY &&
        screenX == draggedTab._dragData.animLastScreenX
      ) {
        return;
      }

      let tabs = this._getVisibleTabs().slice(0, gBrowser._numPinnedTabs);

      let directionX = screenX > draggedTab._dragData.animLastScreenX;
      let directionY = screenY > draggedTab._dragData.animLastScreenY;
      draggedTab._dragData.animLastScreenY = screenY;
      draggedTab._dragData.animLastScreenX = screenX;

      let tabWidth = draggedTab.getBoundingClientRect().width;
      let tabHeight = draggedTab.getBoundingClientRect().height;
      let shiftSizeX = tabWidth * movingTabs.length;
      let shiftSizeY = tabHeight;
      draggedTab._dragData.tabWidth = tabWidth;
      draggedTab._dragData.tabHeight = tabHeight;

      // In expanded vertical mode, 6 is the max number of pinned tabs per row
      const maxTabsPerRow = 6;

      // Move the dragged tab based on the mouse position.
      let firstTabInRow;
      let lastTabInRow;
      if (RTL_UI) {
        firstTabInRow =
          tabs.length >= maxTabsPerRow ? tabs[maxTabsPerRow - 1] : tabs.at(-1);
        lastTabInRow = tabs[0];
      } else {
        firstTabInRow = tabs[0];
        lastTabInRow =
          tabs.length >= maxTabsPerRow ? tabs[maxTabsPerRow - 1] : tabs.at(-1);
      }
      let firstMovingTabScreenX = movingTabs.at(-1).screenX;
      let firstMovingTabScreenY = movingTabs.at(-1).screenY;
      let lastMovingTabScreenX = movingTabs[0].screenX;
      let lastMovingTabScreenY = movingTabs[0].screenY;
      let translateX = screenX - draggedTab._dragData.screenX;
      let translateY = screenY - draggedTab._dragData.screenY;
      let firstBoundX = firstTabInRow.screenX - lastMovingTabScreenX;
      let firstBoundY = firstTabInRow.screenY - lastMovingTabScreenY;
      let lastBoundX =
        lastTabInRow.screenX +
        lastTabInRow.getBoundingClientRect().width -
        (firstMovingTabScreenX + tabWidth);
      let lastBoundY =
        tabs.at(-1).screenY +
        lastTabInRow.getBoundingClientRect().height -
        (firstMovingTabScreenY + tabHeight);
      translateX = Math.min(Math.max(translateX, firstBoundX), lastBoundX);
      translateY = Math.min(Math.max(translateY, firstBoundY), lastBoundY);

      for (let tab of movingTabs) {
        tab.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }

      draggedTab._dragData.translateX = translateX;
      draggedTab._dragData.translateY = translateY;

      // Determine what tab we're dragging over.
      // * Single tab dragging: Point of reference is the center of the dragged tab. If that
      //   point touches a background tab, the dragged tab would take that
      //   tab's position when dropped.
      // * Multiple tabs dragging: All dragged tabs are one "giant" tab with two
      //   points of reference (center of tabs on the extremities). When
      //   mouse is moving from top to bottom, the bottom reference gets activated,
      //   otherwise the top reference will be used. Everything else works the same
      //   as single tab dragging.
      // * We're doing a binary search in order to reduce the amount of
      //   tabs we need to check.

      tabs = tabs.filter(t => !movingTabs.includes(t) || t == draggedTab);
      let firstTabCenterX = lastMovingTabScreenX + translateX + tabWidth / 2;
      let lastTabCenterX = firstMovingTabScreenX + translateX + tabWidth / 2;
      let tabCenterX = directionX ? lastTabCenterX : firstTabCenterX;
      let firstTabCenterY = lastMovingTabScreenY + translateY + tabWidth / 2;
      let lastTabCenterY = firstMovingTabScreenY + translateY + tabWidth / 2;
      let tabCenterY = directionY ? lastTabCenterY : firstTabCenterY;

      let newIndex = -1;
      let oldIndex =
        "animDropIndex" in draggedTab._dragData
          ? draggedTab._dragData.animDropIndex
          : movingTabs[0]._tPos;

      let low = 0;
      let high = tabs.length - 1;
      let shiftNumber = maxTabsPerRow - movingTabs.length;

      let getTabShift = (tab, dropIndex) => {
        if (tab._tPos < draggedTab._tPos && tab._tPos >= dropIndex) {
          // If tab is at the end of a row, shift back and down
          let tabRow = Math.ceil((tab._tPos + 1) / maxTabsPerRow);
          let shiftedTabRow = Math.ceil(
            (tab._tPos + 1 + movingTabs.length) / maxTabsPerRow
          );
          if (tab._tPos && tabRow != shiftedTabRow) {
            return [
              RTL_UI
                ? tabWidth * shiftNumber + tabWidth / 2
                : -tabWidth * shiftNumber - tabWidth / 2,
              shiftSizeY,
            ];
          }
          return [RTL_UI ? -shiftSizeX : shiftSizeX, 0];
        }
        if (tab._tPos > draggedTab._tPos && tab._tPos < dropIndex) {
          // If tab is not index 0 and at the start of a row, shift across and up
          let tabRow = Math.floor(tab._tPos / maxTabsPerRow);
          let shiftedTabRow = Math.floor(
            (tab._tPos - movingTabs.length) / maxTabsPerRow
          );
          if (tab._tPos && tabRow != shiftedTabRow) {
            return [
              RTL_UI
                ? -tabWidth * shiftNumber - tabWidth / 2
                : tabWidth * shiftNumber + tabWidth / 2,
              -shiftSizeY,
            ];
          }
          return [RTL_UI ? shiftSizeX : -shiftSizeX, 0];
        }
        return [0, 0];
      };

      while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (tabs[mid] == draggedTab && ++mid > high) {
          break;
        }
        let shift = getTabShift(tabs[mid], oldIndex);
        screenX = tabs[mid].screenX + shift[0];
        screenY = tabs[mid].screenY + shift[1];

        if (screenY + tabHeight < tabCenterY) {
          low = mid + 1;
        } else if (screenY > tabCenterY) {
          high = mid - 1;
        } else if (screenX > tabCenterX) {
          high = mid - 1;
        } else if (screenX + tabWidth < tabCenterX) {
          low = mid + 1;
        } else {
          newIndex = tabs[mid]._tPos;
          break;
        }
      }

      if (newIndex >= oldIndex) {
        newIndex++;
      }

      if (newIndex < 0 || newIndex == oldIndex) {
        return;
      }
      draggedTab._dragData.animDropIndex = newIndex;

      // Shift background tabs to leave a gap where the dragged tab
      // would currently be dropped.
      for (let tab of tabs) {
        if (tab != draggedTab) {
          let [shiftX, shiftY] = getTabShift(tab, newIndex);
          tab.style.transform =
            shiftX || shiftY ? `translate(${shiftX}px, ${shiftY}px)` : "";
        }
      }
    }

}
