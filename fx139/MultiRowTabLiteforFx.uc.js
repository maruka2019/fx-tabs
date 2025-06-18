// ==UserScript==
// @name           MultiRowTabLiteforFx.uc.js
// @namespace      Based on Alice0775's zzzz-MultiRowTab_LiteforFx48.uc.js
// @description    多段タブもどき実験版 CSS入れ替えまくりLiteバージョン
// @include        main
// @compatibility  Firefox138+
// @version        2025/04/07 12:00
// ==/UserScript==
"use strict";

MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {
if (!window.gBrowser) { return; }

    // -- Config --
    // 同じ様なCSSを書いた場合「userChrome.css」が優先されます。

    const                                   	    	 // 多段タブOn/Off タブバーの段数
    MultiRowTab_OnOff_and_TabBar_Rows =     	-1   	,// [-1]  = 多段タブOn 段数無制限
                                            	    	 //  0    = 多段タブOff
                                            	    	 //  1    = 多段タブOn 通常は1段にしてタブバーをマウスオーバーした際に2段目以降を指定した段数まで表示する。 ※「TabBar_Rows_on_MouseOver」で段数を指定します。
                                            	    	 //  2～  = 多段タブOn 段数を指定
    TabBar_Rows_on_MouseOver =              	3   	,// 通常は1段にしてタブバーをマウスオーバーした際に表示したい段数を指定する。 前提条件:「MultiRowTab_OnOff_and_TabBar_Rows」を「1」に設定する。
    TabBar_DisplayTime_on_MouseOver =       	1   	,// マウスオーバーで2段目以降を表示した際の表示時間(秒)が設定出来ます。設定した数値分(秒)表示してから1段に戻ります。

                                            	    	 // タブバーの位置
    TabBar_Position =                       	0   	,// [0] = ツールバーの上 デフォルト
                                            	    	 //  1  = ツールバーの下
                                            	    	 //  2  = サイトコンテンツの下

                                            	    	 // タブバーの位置をツールバーの下に設定した上でタブバーとブックマークツールバーの位置を入れ替えたい人用
                                            	    	 // 前提条件:「TabBar_Position」を「1」に設定する。
    Bookmark_Toolbar_Position =             	true	,// [true] = メニューバー、ナビゲーションツールバー、ブックマークツールバー、タブバー
                                            	    	 //  false = メニューバー、ナビゲーションツールバー、タブバー、ブックマークツールバー

                                            	    	 // タブの高さ UI密度
    UI_Density_Compact =                    	29   	,// デフォルト29px コンパクト
    UI_Density_Normal =                     	36   	,// デフォルト36px 通常
    UI_Density_Touch =                      	41   	,// デフォルト41px タッチ

                                            	    	 // タブの横幅
    Tab_Min_Width =                         	140   	,// デフォルト76px  最小値
    Tab_Max_Width =                         	140   	,// デフォルト225px 最大値
                                            	    	 // 指定する数値を両方同じにすると横幅が固定化します。

                                            	    	 // タブを閉じるボタン
    Tab_Close_Button =                      	3   	,// [0] = デフォルト
                                            	    	 //  1  = 非表示
                                            	    	 //  2  = すべてのタブに表示
                                            	    	 //  3  = タブをマウスオーバーで表示
                                            	    	 //  4  = アクティブタブは常に表示、非アクティブタブはマウスオーバーで表示 ※垂直タブモードのデフォルトです。

                                            	    	 // タブの見た目 ProtonUI
    Proton_Margins =                        	true	,// [true] = ProtonUI、デフォルト
                                            	    	 //  false = Firefox90以前の設定で「browser.proton.enabled」を「false」にした時の見た目にする。
                                            	    	 //          タブの周囲にある空白を0にしてUI密度の高さに設定するのでデフォルトより横に4px広がって高さが8px低くなります。

                                            	    	 // タブの横に境界線
    Tab_Separators  =                       	false	,// [false] = 表示しない
                                            	    	 //  true   = 表示する
                                            	    	 // Firefox90以前の設定で「browser.proton.enabled」を「false」にすると表示出来ていた境界線のCSSを抽出して調整しています。

                                            	    	 // タイトルバーボタン[－□×]を隠くしてその分タブバーの横幅を広く使う。
                                            	    	 // 前提条件:「TabBar_Position」を「0」に設定する。
    TitleBar_Button_Autohide =              	false	,// [false] = 使用しない
                                            	    	 //  true   = 使用する 普段はタイトルバーボタン[－□×]の外枠を小さくして透明化、表示したい場合はタブバーの右上にあるトリガー領域(36px×6px)をマウスオーバーで元のサイズに戻して透明化を解除。
    TitleBar_Button_DisplayTime =           	0.6   	,// マウスオーバーで元のサイズに戻して透明化を解除した後の表示時間(秒)が設定出来ます。設定した数値分(秒)表示してから隠れます。

                                            	    	 // タブバーを初めから指定した段数の高さにする。
                                            	    	 // 前提条件:「MultiRowTab_OnOff_and_TabBar_Rows」を「2」以上に設定する。
    Set_the_TabBar_to_the_Specified_Height =	false	,// [false] = 使用しない
                                            	    	 //  true   = 使用する  タブバーを初めから指定した段数の高さにしてタブは左上から通常通り並ぶ感じになります。

                                            	    	 // タブをドラッグ＆ドロップの移動中に表示する「.tabDropIndicator」の差し替え
                                            	    	 // 前提条件:「MultiRowTab_OnOff_and_TabBar_Rows」を「0」以外に設定する。
    Tab_Drop_Indicator =                    	false	,// [false] = しない ピン📍アイコン デフォルト
                                            	    	 //  true   = する   赤線アイコン(2px×29px)

                                            	    	 // ピン留めタブの位置
                                            	    	 // 前提条件:「MultiRowTab_OnOff_and_TabBar_Rows」を「0」以外に設定する。
    Separate_Tabs_and_PinnedTabs =          	false	,// [false] = デフォルト
                                            	    	 //  true   = ピン留めタブをタブの行から分離して上に出来る行へ移動する。

                                            	    	 // ピン留めタブの横幅を調整
                                            	    	 // 前提条件:「Separate_Tabs_and_PinnedTabs」を「true」に設定する。
    PinnedTab_Width =                       	false	,// [false] = しない デフォルト
                                            	    	 //  true   = する   ピン留めタブの横幅をタブの横幅と同じ様に調整出来ます。
    PinnedTab_Min_Width =                   	76   	,// デフォルト76px  最小値
    PinnedTab_Max_Width =                   	225   	,// デフォルト225px 最大値
                                            	    	 // 指定する数値を両方同じにすると横幅が固定化します。

                                            	    	 // ピン留めタブ タブを閉じるボタン
                                            	    	 // 前提条件:「Separate_Tabs_and_PinnedTabs」を「true」に設定する。
    PinnedTab_Close_Button =                	0   	,// [0] = デフォルト
                                            	    	 //  1  = すべてのタブに表示
                                            	    	 //  2  = タブをマウスオーバーで表示
                                            	    	 //  3  = アクティブタブは常に表示、非アクティブタブはマウスオーバーで表示 ※垂直タブモードのデフォルトです。

                                            	    	 // タブバーのドラッグ領域
    Left_Drag_Area =                        	0   	,// デフォルト40px 左のドラッグ領域
    Right_Drag_Area =                       	0   	,// デフォルト40px 右のドラッグ領域
    Maximize_Left_Drag_Area =               	false	,// [false] = デフォルト
                                            	    	 //  true   = ウィンドウを最大化した時、非表示になる左のドラッグ領域が表示出来ます。
    Fullscreen_Drag_Area =                  	false	,// [false] = デフォルト
                                            	    	 //  true   = フルスクリーンにした時、非表示になる左右のドラッグ領域が表示出来ます。
                                            	    	 // タイトルバーを表示している場合「.titlebar-spacer」を表示してもドラッグ領域として機能しないので何もしない様にしました。

    // -- Config End --

    css = `

    #TabsToolbar:not([collapsed="true"]) {

      :root[uidensity="compact"] & {
        --tab-min-height: ${UI_Density_Compact}px;
      }
      :root:not([uidensity]) & {
        --tab-min-height: ${UI_Density_Normal}px;
      }
      :root[uidensity="touch"] & {
        --tab-min-height: ${UI_Density_Touch}px;
      }

      #tabbrowser-tabs {
        min-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);

        ${MultiRowTab_OnOff_and_TabBar_Rows != 0 ? `
          &[overflow] {
            padding-inline: 0 !important;
            & > #tabbrowser-arrowscrollbox {
              & > .tabbrowser-tab[pinned] {
                display: flex;
                margin-inline-start: 0 !important;
                position: static !important;
              }
              &::part(scrollbox) {
                padding-inline: 0;
              }
            }
            & + #new-tab-button {
              display: none;
            }
          }

          ${Tab_Drop_Indicator ? `
            & > .tab-drop-indicator {
              background: url(
                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAdCAIAAAAPVCo9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY3growJEQ5+SUQEAOb1EM8kwskcAAAAASUVORK5CYII=
              ) no-repeat center;
            }
          ` : ``}

          #tabbrowser-arrowscrollbox {
            &::part(scrollbox) {
              & > slot {
                flex-wrap: wrap;
              }

              ${MultiRowTab_OnOff_and_TabBar_Rows != -1 ? `
                ${MultiRowTab_OnOff_and_TabBar_Rows == 1 ? `
                  ${TabBar_Rows_on_MouseOver == 0 || TabBar_Rows_on_MouseOver == 1 ? `
                    max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * 2);
                  ` : `
                    max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${TabBar_Rows_on_MouseOver});
                  `}
                  &:not(:hover) {
                    max-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) !important;
                    ${Proton_Margins ? `scrollbar-width: none;` : ``}
                    transition: all 0s ease-in-out ${TabBar_DisplayTime_on_MouseOver}s;
                  }
                ` : `
                  ${Set_the_TabBar_to_the_Specified_Height ? `
                    min-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${MultiRowTab_OnOff_and_TabBar_Rows});
                    & > slot {
                      max-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
                    }
                  ` : `
                    max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${MultiRowTab_OnOff_and_TabBar_Rows});
                  `}
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

            ${Separate_Tabs_and_PinnedTabs ? `
              &:has(> .tabbrowser-tab[fadein][pinned]) {
                &::part(scrollbox) {
                  & > slot::after {
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
                  .tab-background:after {
                    content: "📌";
                    font-size: 11px;
                    right: -2px;
                    position: absolute;
                    top: -2px;
                  }

                  ${PinnedTab_Width ? `
                    flex: 100 100;
                    max-width: ${PinnedTab_Max_Width}px;
                    min-width: ${PinnedTab_Min_Width}px;
                    .tab-throbber, .tab-icon-pending, .tab-icon-image, .tab-sharing-icon-overlay, .tab-icon-overlay {
                      margin-inline-end: 5.5px !important;
                    }

                    ${PinnedTab_Close_Button == 1 ? `
                      .tab-close-button {
                        display: flex;
                      }
                    ` : PinnedTab_Close_Button == 2 ? `
                      .tab-close-button {
                        display: none;
                      }
                      &:hover .tab-close-button {
                        display: flex;
                      }
                    ` : PinnedTab_Close_Button == 3 ? `
                      &:not([selected]):hover,
                      &[selected] {
                        .tab-close-button {
                          display: flex;
                        }
                      }
                    ` : ``}

                  ` : ``}

                }
              }
            ` : ``}

            #tabbrowser-tabs[haspinnedtabs]:not([positionpinnedtabs]):not([orient="vertical"]) > & {
              &  > .tabbrowser-tab:nth-child(1 of :not([pinned], [hidden])) {
                margin-inline-start: 0 !important;
              }
            }

          }
        ` : ``}
      }

      .tabbrowser-tab[fadein]:not([pinned]) {
        max-width: ${Tab_Max_Width}px;
        min-width: ${Tab_Min_Width}px;

        ${Tab_Close_Button == 1 ? `
          .tab-close-button {
            display: none;
          }
        ` : Tab_Close_Button == 2 ? `
          .tab-close-button {
            display: flex;
          }
        ` : Tab_Close_Button == 3 ? `
          .tab-close-button {
            display: none;
          }
          &:hover .tab-close-button {
            display: flex;
          }
        ` : Tab_Close_Button == 4 ? `
          &:not([selected]):hover {
            .tab-close-button {
              display: flex;
            }
          }
        ` : ``}

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
            display: flex;
            content: "";
          }
        }
      ` : ``}

      ${Proton_Margins ? `` : `
        .tabbrowser-tab,
        .toolbarbutton-1 {
          padding: 0;
        }
        .tabbrowser-tab,
        #tabs-newtab-button {
          height: var(--tab-min-height);
        }
        .tabbrowser-tab {
          .tab-background {
            box-shadow: none;
            margin-block: 0;
          }
          .tab-label-container {
            height: var(--tab-min-height);
            max-height: 24px;
          }
          .tab-close-button {
            height: 20px !important;
            padding-block: 3px !important;
          }
          &[usercontextid] > .tab-stack > .tab-background > .tab-context-line {
            margin-block-start: 1px !important;
          }
        }
      `}

    ${TabBar_Position == 0 ? `
      .titlebar-buttonbox-container {
        height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
      }

      ${TitleBar_Button_Autohide ? `
        & > .titlebar-buttonbox-container {
          background-color: color-mix(in srgb, currentColor 20%, transparent);
          position: fixed;
          right: 0;
          &:not(:hover) {
            height: 6px;
            .titlebar-button {
              padding: 0;
            }
            &,& .titlebar-button {
              opacity: 0;
              transition: all 0s ease-in-out ${TitleBar_Button_DisplayTime}s;
            }
          }
        }
      ` : ``}

    }` : `

      ${TabBar_Position == 1 || TabBar_Position == 2 ? `
        & > .titlebar-buttonbox-container {
            display: none;
        }}
        #nav-bar {
          &:not(.browser-titlebar) {
            :root[customtitlebar] #toolbar-menubar[autohide="true"] ~ &,
            :root[inFullscreen] #toolbar-menubar ~ & {
              & > .titlebar-buttonbox-container {
                display: flex;
              }
            }
          }
          .titlebar-button {
            padding-block: 0;
          }
        }
      ` : ``}

      body:has(> #navigator-toolbox:not([tabs-hidden])) {
        ${TabBar_Position == 1 ? `
          script, toolbar:not(#TabsToolbar ${Bookmark_Toolbar_Position ? `` : `, #PersonalToolbar`}) {
            order: -1;
          }
        ` : TabBar_Position == 2 ? `
          & > #fullscr-toggler[hidden] + tabbox,
          :root[inFullscreen] & > tabbox:hover {
            border-top: 0.01px solid var(--chrome-content-separator-color);
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
                display: flex;
              }
            }
            & > tabbox:not(:hover) {
              border-top: 0.01px solid transparent;
              & > #navigator-toolbox {
                display: none;
              }
            }
          }
        ` : ``}
      }

    `}

    toolbar[id$="bar"].browser-titlebar {
      .titlebar-spacer {
        &[type="pre-tabs"] {
          width: ${Left_Drag_Area}px;
        }
        &[type="post-tabs"] {
          width: ${Right_Drag_Area}px;
        }
        ${Maximize_Left_Drag_Area ? `
          :root[customtitlebar]:not([sizemode="normal"], [inFullscreen]) &[type="pre-tabs"] {
            display: flex;
          }
        ` : ``}
        ${Fullscreen_Drag_Area ? `
          :root[customtitlebar][inFullscreen] & {
            display: flex;
          }
        ` : ``}
      }
      #navigator-toolbox[tabs-hidden] & {
        #new-tab-button {
          display: none;
        }
      }
    }

    `,
    sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
    uri = Services.io.newURI("data:text/css;charset=UTF=8," + encodeURIComponent(css));
    ["0", "2", "dragend", "SSTabRestored", "TabAttrModified"].find(eventType => {
      if(!sss.sheetRegistered(uri, eventType)) sss.loadAndRegisterSheet(uri, eventType);
      if (MultiRowTab_OnOff_and_TabBar_Rows > 0) {
        gBrowser.tabContainer.addEventListener(eventType, (e) => {
          e.target.scrollIntoView({ behavior: "instant", block: "nearest" })
        })
      }
    })

    if (TabBar_Position == 2) {
      document.body.appendChild(
        document.createXULElement("tabbox")
      ).appendChild(
        document.importNode(document.getElementById("navigator-toolbox"))
      ).appendChild(
        document.adoptNode(document.getElementById("TabsToolbar"))
      )
    }

    gBrowser.tabContainer._getDropIndex = function(event) {
        let tabToDropAt = getTabFromEventTarget(event, false);
        const tabPos = gBrowser.tabContainer.getIndexOfItem(tabToDropAt);

        if (window.getComputedStyle(this).direction == "ltr") {
            let rect = tabToDropAt.getBoundingClientRect();
            if (event.clientX < rect.x + rect.width / 2)
                return tabPos;
            else 
                return tabPos + 1;
            
        } else {
            let rect = tabToDropAt.getBoundingClientRect();
            if (event.clientX > rect.x + rect.width / 2)
                return tabPos;
            else
                return tabPos + 1;
        }
    };

    // We set this to check if the listeners were added before
    let listenersActive = false;

    // This sets when to apply the fix (by default a new row starts after the 23th open tab, unless you changed the min-size of tabs)
    gBrowser.tabContainer.addEventListener("dragstart", () => {
        // Multiple tab select fix
        gBrowser.visibleTabs.forEach(t => t.style.transform = "");

        // Event handling
        if (!listenersActive) {
            gBrowser.tabContainer.getDropEffectForTabDrag = function(){};
            gBrowser.tabContainer._getDropEffectForTabDrag = function(){};
            gBrowser.tabContainer.on_dragover = (dragoverEvent) => performTabDragOver(dragoverEvent);
            gBrowser.tabContainer._onDragOver = (dragoverEvent) => performTabDragOver(dragoverEvent);
            gBrowser.tabContainer.ondrop = (dropEvent) => performTabDropEvent(dropEvent);
            listenersActive = true;
        }
    });
}

var lastKnownIndex = null;
var lastGroupStart = null;
var lastGroupEnd = null;

/**
 * Gets the tab from the event target.
 * @param {*} event The event.
 * @returns The tab if it was part of the target or its parents, otherwise null
 */
function getTabFromEventTarget(event, { ignoreTabSides = false } = {}) {
    let { target } = event;
    if (target.nodeType != Node.ELEMENT_NODE) {
        target = target.parentElement;
    }
    let tab = target?.closest("tab") || target?.closest("tab-group");
    const selectedTab = gBrowser.selectedTab;
    if (tab && ignoreTabSides) {
        let { width, height } = tab.getBoundingClientRect();
        if (
            event.screenX < tab.screenX + width * 0.25 ||
            event.screenX > tab.screenX + width * 0.75 ||
            ((event.screenY < tab.screenY + height * 0.25 ||
                event.screenY > tab.screenY + height * 0.75) &&
                gBrowser.tabContainer.verticalMode)
        ) {
            return selectedTab;
        }
    }
    if (!tab) {
        return selectedTab;
    }
    return tab;
}

/**
 * Performs the tab drag over event.
 * @param {*} event The drag over event.
 */
function performTabDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    let ind = gBrowser.tabContainer._tabDropIndicator;

    let effects = orig_getDropEffectForTabDrag(event);
    let tab;
    if (effects == "link") {
        tab = getTabFromEventTarget(event, true);
        if (tab) {
            if (!gBrowser.tabContainer._dragTime)
                gBrowser.tabContainer._dragTime = Date.now();
            if (!tab.hasAttribute("pendingicon") && // annoying fix
                Date.now() >= gBrowser.tabContainer._dragTime + gBrowser.tabContainer._dragOverDelay)
                gBrowser.tabContainer.selectedItem = tab;
            ind.hidden = true;
            return;
        }
    }

    if (!tab) {
        tab = getTabFromEventTarget(event, false);
    }
    
    let newIndex = gBrowser.tabContainer._getDropIndex(event);
    if (newIndex == null)
        return;

    // Update the last known index and group position
    lastKnownIndex = newIndex;
    
    if (tab.nodeName == "tab-group" && !lastGroupStart) {
        lastGroupStart = tab.querySelector("tab:first-of-type")._tPos;
        lastGroupEnd = tab.querySelector("tab:last-of-type")._tPos;
    }

    let tabs = document.querySelectorAll("tab");
    let ltr = (window.getComputedStyle(gBrowser.tabContainer).direction == "ltr");
    let rect = gBrowser.tabContainer.arrowScrollbox.getBoundingClientRect();
    let newMarginX, newMarginY;
    if (newIndex == tabs.length) {
        let tabRect = tabs[newIndex - 1].getBoundingClientRect();
        if (ltr)
            newMarginX = tabRect.right - rect.left;
        else
            newMarginX = rect.right - tabRect.left;
        newMarginY = tabRect.top + tabRect.height - rect.top - rect.height; // multirow fix

        if (CSS.supports("offset-anchor", "left bottom")) // Compatibility fix for FF72+
            newMarginY += rect.height / 2 - tabRect.height / 2;
        
    } else if (newIndex != null || newIndex != 0) {
        let tabRect = tabs[newIndex].getBoundingClientRect();
        if (ltr)
            newMarginX = tabRect.left - rect.left;
        else
            newMarginX = rect.right - tabRect.right;
        newMarginY = tabRect.top + tabRect.height - rect.top - rect.height; // multirow fix

        if (CSS.supports("offset-anchor", "left bottom")) // Compatibility fix for FF72+
            newMarginY += rect.height / 2 - tabRect.height / 2;
    }

    newMarginX += ind.clientWidth / 2;
    if (!ltr)
        newMarginX *= -1;

    ind.hidden = false;

    ind.style.transform = "translate(" + Math.round(newMarginX) + "px," + Math.round(newMarginY) + "px)"; // multirow fix
    ind.style.marginInlineStart = (-ind.clientWidth) + "px";
}

/**
 * Performs the tab drop event.
 * @param {*} event The drop event.
 */
function performTabDropEvent(event) {
    let newIndex;
    let dt = event.dataTransfer;
    let dropEffect = dt.dropEffect;
    let draggedTab;
    if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
        draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        if (!draggedTab) {
            return;
        }
    }

    if (draggedTab && dropEffect != "copy" && draggedTab.container == gBrowser.tabContainer) {
        newIndex = gBrowser.tabContainer._getDropIndex(event);

        /* fix for moving multiple selected tabs and tab groups */
        let selectedTabs = gBrowser.selectedTabs;
        if (lastGroupStart) {
            selectedTabs = [draggedTab?.closest("tab-group")];
            if (lastKnownIndex >= lastGroupStart && lastKnownIndex <= lastGroupEnd) {
                newIndex = lastGroupStart;
            } else if (lastKnownIndex == lastGroupEnd + 1) {
                newIndex = lastGroupStart + 1;
            }
        }

        if (selectedTabs[selectedTabs.length - 1] == null){
            newIndex = lastKnownIndex;
        } else if (newIndex > selectedTabs[selectedTabs.length - 1]._tPos + 1)
            newIndex--;
        else if (newIndex >= selectedTabs[0]._tPos)
            newIndex = -1;

        if (newIndex == -1) {
            newIndex = lastKnownIndex;
        }
        
        const tabToMoveAt = gBrowser.tabContainer.getItemAtIndex(newIndex);
        console.log("tabToMoveAt", tabToMoveAt);
        console.log("newIndex", newIndex);
        selectedTabs.forEach(t => gBrowser.moveTabBefore(t, tabToMoveAt));

        // Restart global vars
        lastKnownIndex = null;
        lastGroupStart = null;
        lastGroupEnd = null;
    }
}

// copy of the original and overrided _getDropEffectForTabDrag method
function orig_getDropEffectForTabDrag(event) {
    let dt = event.dataTransfer;

    let isMovingTabs = dt.mozItemCount > 0;
    for (let i = 0; i < dt.mozItemCount; i++) {
        // tabs are always added as the first type
        let types = dt.mozTypesAt(0);
        if (types[0] != TAB_DROP_TYPE) {
            isMovingTabs = false;
            break;
        }
    }

    if (isMovingTabs) {
        let sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        if (XULElement.isInstance(sourceNode) &&
            sourceNode.localName == "tab" &&
            sourceNode.ownerGlobal.isChromeWindow &&
            sourceNode.ownerDocument.documentElement.getAttribute("windowtype") ==
            "navigator:browser" &&
            sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.container) {
            // Do not allow transfering a private tab to a non-private window
            // and vice versa.
            if (PrivateBrowsingUtils.isWindowPrivate(window) !=
                PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal))
                return "none";
        

            if (window.gMultiProcessBrowser !=
                sourceNode.ownerGlobal.gMultiProcessBrowser)
                return "none";
        

            if (window.gFissionBrowser != sourceNode.ownerGlobal.gFissionBrowser)
                return "none";
        

            return dt.dropEffect == "copy" ? "copy" : "move";
        }
    }

    if (Services.droppedLinkHandler.canDropLink(event, true)) 
        return "link";

    return "none";
}
