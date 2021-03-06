/* ==================================== */
/* ====== Swift Selection Search ====== */
/* ==================================== */

"use strict";

const DEBUG = false;
if (DEBUG) {
	var log = console.log;
}

const consts = {
	PopupOpenBehaviour_Off: "off",
	PopupOpenBehaviour_Auto: "auto",
	PopupOpenBehaviour_Keyboard: "keyboard",
	PopupOpenBehaviour_HoldAlt: "hold-alt",
	PopupOpenBehaviour_MiddleMouse: "middle-mouse",

	PopupLocation_Selection: "selection",
	PopupLocation_Cursor: "cursor",

	MouseButtonBehaviour_ThisTab: "this-tab",
	MouseButtonBehaviour_NewTab: "new-tab",
	MouseButtonBehaviour_NewBgTab: "new-bg-tab",
	MouseButtonBehaviour_NewTabNextToThis: "new-tab-next",
	MouseButtonBehaviour_NewBgTabNextToThis: "new-bg-tab-next",
	MouseButtonBehaviour_NewWindow: "new-window",
	MouseButtonBehaviour_NewBgWindow: "new-bg-window",

	AutoCopyToClipboard_Off: "off",
	AutoCopyToClipboard_Always: "always",

	ItemHoverBehaviour_Nothing: "nothing",
	ItemHoverBehaviour_Highlight: "highlight",
	ItemHoverBehaviour_HighlightAndMove: "highlight-and-move",

	ContextMenuEnginesFilter_All: "all",
	ContextMenuEnginesFilter_SameAsPopup: "same-as-popup",

	sssIcons: {
		copyToClipboard: {
			name: "Copy to clipboard",
			description: '[SSS] Adds a "Copy selection to clipboard" icon to the popup.',
			iconPath: "res/sss-engine-icons/copy.svg",
		},
		openAsLink: {
			name: "Open as link",
			description: '[SSS] Adds an "Open selection as link" icon to the popup.',
			iconPath: "res/sss-engine-icons/open-link.svg",
		},
		separator: {
			name: "Separator",
			description: '[SSS] Adds a separator.',
			iconPath: "res/sss-engine-icons/separator.png",
		}
	}
};

const defaultSettings = {
	popupOpenBehaviour: consts.PopupOpenBehaviour_Auto,
	middleMouseSelectionClickMargin: 14,
	popupLocation: consts.PopupLocation_Cursor,
	minSelectedCharacters: 0,
	allowPopupOnEditableFields: false,
	hidePopupOnPageScroll: true,
	hidePopupOnRightClick: true,
	hidePopupOnSearch: true,
	popupOpenHotkey: "accel-shift-space",
	popupDisableHotkey: "accel-shift-x",
	mouseLeftButtonBehaviour: consts.MouseButtonBehaviour_ThisTab,
	mouseMiddleButtonBehaviour: consts.MouseButtonBehaviour_NewBgTab,
	popupAnimationDuration: 200,
	autoCopyToClipboard: consts.AutoCopyToClipboard_Off,
	useSingleRow: true,
	nPopupIconsPerRow: 4,
	popupItemSize: 24,
	popupItemPadding: 2,
	popupItemVerticalPadding: 1,
	popupItemHoverBehaviour: consts.ItemHoverBehaviour_HighlightAndMove,
	popupItemBorderRadius: 0,
	popupBackgroundColor: "#FFFFFF",
	popupHighlightColor: "#3399FF",
	popupPaddingX: 3,
	popupPaddingY: 1,
	popupOffsetX: 0,
	popupOffsetY: 0,
	popupBorderRadius: 2,
	enableEnginesInContextMenu: true,
	contextMenuItemBehaviour: consts.MouseButtonBehaviour_NewBgTab,
	contextMenuEnginesFilter: consts.ContextMenuEnginesFilter_SameAsPopup,

	searchEngines: [
		{
			type: "sss",
			id: "copyToClipboard",
			isEnabled: true,
		},
		{
			type: "sss",
			id: "openAsLink",
			isEnabled: true,
		},
		{
			type: "sss",
			id: "separator",
			isEnabled: true,
		},
		{
			type: "custom",
			name: "Google",
			iconUrl: "https://www.google.com/favicon.ico",
			searchUrl: "https://www.google.com/search?q={searchTerms}",
			isEnabled: true,
		},
		{
			type: "custom",
			name: "YouTube",
			iconUrl: "https://www.youtube.com/yts/img/favicon_144-vfliLAfaB.png",
			searchUrl: "https://www.youtube.com/results?search_query={searchTerms}",
			isEnabled: true,
		},
		{
			type: "custom",
			name: "IMDB",
			iconUrl: "https://www.imdb.com/favicon.ico",
			searchUrl: "http://www.imdb.com/find?s=all&q={searchTerms}",
			isEnabled: true,
		},
		{
			type: "custom",
			name: "Wikipedia (en)",
			iconUrl: "https://www.wikipedia.org/favicon.ico",
			searchUrl: "https://en.wikipedia.org/wiki/Special:Search?search={searchTerms}",
			isEnabled: true,
		}
	],

	searchEnginesCache: {
		"https://www.google.com/favicon.ico"                        : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEHklEQVRYhb2WXWwUVRTH56XBotQn33wQBXlTov3gQWtErKB9IGkptPYBxYox6INRa0LQQELRYqEJ8NAPLMQ0bCuBVqzQZhGpH91YJGYJaYMW0O1XZnb6xc7u7Nxz9u+D203vzGx3tlZPcl723j2///m4d66ieDRd1/OIqIqIWolokJl1ZraSHiaiweRapa7reV7jZjTTNNcRURszx+DRmDlKRCdN01y7ZDCAlUKIBmYmr2AXIUIIcTgUCuVmm/XjzHxzqWAXIUHTNNd4gluW9RQza26BaHwURvsXmHn/bYS3bYZasgHqi0UIl5Vg+r23YJxuBo3+lU6ECmC9l8wdcJoYw+z+j6BuKoT6QsHivqkQs598CJoYcxWRthKTk5P3u5U91tcD7ZXizGCba6XPwbzS59oO15kQQjTYNxtnTmUNXuhz9ftd2yGEqLeXfp192mN9PWkDT9VUItJyDLFvziHWcx6RluOYerNKhh+pAxKJdPMgpFYQUZvU8/FRaC8/6wDr1VsRvxZwDQoA8cEBhHeU4t7xz9PuSTGIWhVFURQAD9ovmUjjOw749J7XkJibyxg4YUQy7gEAZjY0TVulEFGVFCA6AtG7ArO1j6Tg4W2bwTNTngJnY0S0XSGiVknZnToIfw6EPwfGsYegbclH7NKFZYcnBTQpRDQo/fhrSUqA8Ocgfm41IMR/JSCgMLO+8EfR/7AkgG5ULhpk48GIZ79yU06EmVWFmS1JwOUVkgD+Y9+yCWj/SUKBmeP/q4C2q3FXAWFJgL0FwR3LJqAz4KiA6hzC6y9JAkb7n4DF2Q/hbZUdAq4OyXGIKOByDD9NwS/0rMYzvq3oGvFnLcA3YDkETMzIV/P8MZTGPBG9g6g/F3VdTyPfV4Z8XxlKul5HODbtGX4vlkB5oyHBdzZFHfuIqELRdT2PmaXVowMHUvB5r+79ADPxzFexRUDtmZgj+w5n/w0AD8x/jE4uXByPqCg++6pDROnXu9E/di0t/Nb0Xezq9mHjwVkJXt5oIBp3lL954ed4LbM8aRfv9jsEzHv5t++i4XobOm9dxFe/X8KJYDve8O9Fga8c+b4yFJ2qxfOfhVICfhiW37XMbJmm+Zj9QXLYntGXw91pRWTygvadKD7yi+PsA4AQ4pDjRQRgJTPfsG/u/fNHFJ+tzlpAUUcFWoLdDjgz/wbgvnSP0jXJ16tkE4aGvT8fRWFHuSf47u8+xtDUiBt8EsCjrvAFlVjvJgL4ZzhPD53Hnu8PYEt3DTZ0VqCoowIlXbtQc3kfTgTbMTx12+2vYOZJy7KeXBRuq0TQNdISLFn2xTO3WygUyhVC1NtPR5ZgSwhxCOl67rUaRNSavDi8gg0ianYctX9jmqatIqLtRNRERAFmVpk5nnSViALJtQrM33Ae7G92y3s6IRzKLQAAAABJRU5ErkJggg==",
		"https://www.youtube.com/yts/img/favicon_144-vfliLAfaB.png" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA0klEQVRoge2YwQ2EIBREfwmUYCmWYCmWsB1YgqVQEiXMXiDxgCskCEx2XjJHdR75UcFMCCGEqABmDmYrzD4x/hIU5npNus8KM9eyaGmZLqkpXrOSveOfyh8TlHzKQTM2VeMEs210sYpsOYEwQbHSBNrxSZHA6LwnAAAhkAsk9p1cIOEcuUCCXgAAzpNcILEsEtAIVQu0ekZ3AdrXKO2HjPpXolMkMDo5AfotJfemnmmMsuWjAPfBVpTwE5S8i/9ZfuZxKi5eKPfK8XrTkkIIIf6CLwP44M2GNwfzAAAAAElFTkSuQmCC",
		"https://www.imdb.com/favicon.ico"                          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE20lEQVRogdWVyW+TVxTFL0hGLKh1LVVCCtgk7226qdRFV911A5VA6qJAQklLNyUQoFIRkxgKAcQkiELiKAlx4ozEGezEsePY2NgJBAJpQqJMTQhVW3VUp3/hdFH5q5/fF7LtW/wWPu/e8875ZH+mZz0Mk6HxbsbfS9JIxrsZ9DTA+OsbaSRPAwx60sX4c0EayZMuBo11Mv6Yk0Yy1smgxx2M32elkTzuYNBoO+O3GWkko+0MGmlj/DotjWSkjUEjLYxfpqSRjLQwKONn/DwpjSTjZ1C6mfHThDSSdDOD0k2MH59LI0k3MSjlY/wwLo0k5WNQspHx/VNpJMlGBj1oYHw3Jo3kQQOD4vWMbx9JI4nXM2i4jvFqVFpMRoogPA6L/R868WpUwluxWdFzz16NSu1MeByr6sLjwBefuZBo91j7+f7eis1KLjuG6xg0XMtYyUiLRKsHRGRR5HZgJSNx7IBL0YkIGxzrsJKRmE8I7YyIsJKRtnouxw64bP2z+usYrmVQzMt4mZYW8Ra9wMu0fQEist3JPVurQHbOrkDW++twkZIxS8zLoKEaxnJKWgz79QLLKYmjn9oXGPZ7Vj1bTukFllMSGxzr1vR49+2NypzzjfVKzuWUxFANg4aqGUtJaRFr1gssJSWOfmIf8u6Fzdj5/ibbs6WkXmApKVHkdiharNmzqn8uXx17U8k6VM2gyF3GYkJaRH15BbY6sJiQOFKqXuDctB5EhCOlLhRtdShalsWEXmAxIa35LFGfR/Mv2eVEyS6noh0pdSlZI3cZNFjFWIhLi2ijXmAhLlGed0E2RG6Y/GALcb3AQtymQKNH8y8vddlquVkHqxgUrmTMx6RFpEEtULjVgfmYRPl+1ax4579PJ/d7mtWyzMf0AvMxicK8ApEGj+Zfvt9lq+VmDVcyaOAOYy4qLQbr9QJzUYnDH6tm+Z/ttLmoXmAuqhcYrPfY+ttpuVkH7jCo/zZjNiIswnVutcAWB2YjAof3qWb+6wXabyJ/Zjai/z/MRgQKt6gFwnVubffwPpetlpu1/zaDQrcYM2Fh0V+rF5gJCxwqUc3s5vJnZsJ6gZmwXqC/1q3tHipx2Wq5WUO3GBS8yZgeEBb9Xj3Y9IBAWZ7Z9IAabs8HzjVnsppWwOvWdstKXLZabtbgTQb13WC8CAmLUI1e4EVIoKxYNXsRUsOVFbvWnMlq+a/bUI1b27XzKyt2KVn7bjCo9zpjKigsgtVqgW0FDkwFBQ7uVc2mggLbCv57ksFqt+1MfoH88ESETGuhtrt7hxO7d6hvtYN7XUrW3usM6rnGmOwVFn1VeoHJXoGDe9QLJnvVAn1VbtuZ/LB22Pnbca+iQMnac41BgauMiW5h0VOpF5joFvh8t3pBvrbazOsCvfPWRqSaCm13P9ruVP5jtr+3Sck50S0QuMqgwBXG84D439Jd6UbSV2h7FrjCoK7LjGddwki6LjPofgVjvFMYyf0KBnVeYjxpF0bSeYlBHRcZY23CSDouMqj9AuNxizCS9gsMajvPeOQXRtJ2nkGt5xijTcJIWs8xqOUsY8QnjKTlLIP8Zxjpe8JI/GcY1Hya8bBeGEnzaQY1nWKk6oSRNJ1ikO8kI1krjMR3kkGNJxgPvMJIGk8wqOE4I14tjKThOIPqv2SYzD/ZLZPkdY1wuAAAAABJRU5ErkJggg==",
		"https://www.wikipedia.org/favicon.ico"                     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADH0lEQVRoge1Z7Y3sIAwkVdAGXdACHaQDWkgFFJEKUgIl0AJV4PdrIuAIOMmusnvvTrJ00jrB4xl/oAjR+Usp0SdYL8aPDfoSmKeDuwXi6aBugXg6mNsgng7k/wbwdBC3QTwdwB+ApwP4A4B/tNaklCKlFGmtyRhTWP67tZZSSmx/7z2t63roD9/Re+FnjPkJwHtP1lpSStE0TU2TUtKyLOS9p5QSbdtG8zwXPkIIEkLQNE00zzOt60opJQohkHOOtNY//LXW5JyjEMLhe/Pz4deUUIyRrLV7EPnDMcYmjeu6kpSyeGZZlqZvCKFIknPuUB7Lsux+Wuvm+c0aiDGSMaYAkNPWMmttwQDk0Hu3tfYwKUgMkpdnnVXE27YVWVVKdQ/z3heZPWLMe09SSlJKHQYFc86REOKQzS6AGCPN87xnVAhB27axWOjJY1kWEkLstdE7H0WLmjsFoNa2EIKUUt1DoW+wVrOA7B/puVZAT4osAMhCzkIvGy0WcvrRWTjZN8aQlHLI+nCQOeeKgLTWQxaklHtBgwXvPasZgCmu7xBAjHGXBWxUfHUPt9ayM4o64TDFApDLAgBGmQELeS1gsHEShi7FiY0FIJcFbFSExphisPV6eUuyvQF3GgACygGMshlCKNaF3iTPDdnn+J4CgBbIWS2OQI9a4rquw8F1GUBKaZ+0kMbooLqYR9NXa81m6hKAbdsKWfQKLZcQhwXvPQkhWIV+GQA0msvoqNggHyxk+RxpsQB/TqHfAoAFC9YabBhEyCY60pH0wBZncN0GkLOA7lIPnFrLdUeqawG1cjb7lwFgo2zdFdBJamnVHQm/Y3CNVpSXAsChkIWUcl/ysALXnQSyyjtSjHFfG0ZL4ksBpJSKayd6N6Zoa4fB/aJmARf4q3FcBhBCKIpZSjnc9fM2jC7Gudy8BUDr3jxNU3fbxDM58DNrw0sBtHTNGUL1XOAubW8BgBsb5MDZ9XPmuBvq2wAgo5y7a24o9jPPvA1ACIGstafaIDrS1db5UgBP21d/pfkd38h+BYBvBNH6WP81IJrBfwuIbvCfCqYX4z8UwrBWOPp89wAAAABJRU5ErkJggg==",
	}
};

let isFirstLoad = true;
let browserVersion = 0;
const sss = {};

// show message related to update to WebExtensions
browser.runtime.onInstalled.addListener(details => {
	if (details.reason == "install"
	|| (details.reason == "update" && !details.previousVersion.startsWith("3.")))
	{
		browser.tabs.create({ url : "/res/msg-pages/update-to-webextensions.html" });
	}
});

browser.runtime.getBrowserInfo().then(browserInfo => {
	browserVersion = parseInt(browserInfo.version.split(".")[0]);
	if (DEBUG) { log("Firefox is version " + browserVersion); }

	// clear all settings (for test purposes)
	// browser.storage.local.clear();
	// browser.storage.sync.clear();

	// register with content script messages and changes to settings
	browser.runtime.onMessage.addListener(onContentScriptMessage);
	browser.storage.onChanged.addListener(onSettingsChanged);

	// Get settings. Setup happens when they are ready.
	browser.storage.local.get().then(onSettingsAcquired, getErrorHandler("Error getting settings for setup."));
});

/* ------------------------------------ */
/* -------------- SETUP --------------- */
/* ------------------------------------ */

// Main SSS setup. Called when settings are acquired. Prepares everything.
function onSettingsAcquired(settings)
{
	let doSaveSettings;

	// if settings object is empty, use defaults
	if (settings === undefined || isObjectEmpty(settings)) {
		if (DEBUG) { log("Empty settings! Using defaults."); }
		settings = defaultSettings;
		doSaveSettings = true;
	} else {
		doSaveSettings = isFirstLoad && runBackwardsCompatibilityUpdates(settings);
	}

	if (doSaveSettings) {
		browser.storage.local.set(settings);
		return;	// calling "set" will trigger this whole function again, so quit before wasting time
	}

	// save settings and also keep subsets of it for content-script-related purposes
	sss.settings = settings;
	sss.settingsForContentScript = getPopupSettingsForContentScript(settings);
	sss.activationSettingsForContentScript = getActivationSettingsForContentScript(settings);

	if (isFirstLoad) {
		if (DEBUG) { log("loading ", settings); }
	}

	setup_ContextMenu();
	setup_PopupHotkeys();
	setup_Popup();

	if (isFirstLoad) {
		if (DEBUG) { log("Swift Selection Search has started!"); }
	}

	isFirstLoad = false;
}

function getActivationSettingsForContentScript(settings)
{
	let activationSettings = {
		popupLocation: settings.popupLocation,
		popupOpenBehaviour: settings.popupOpenBehaviour,
		middleMouseSelectionClickMargin: settings.middleMouseSelectionClickMargin
	};
	return activationSettings;
}

function getPopupSettingsForContentScript(settings)
{
	let popupSettings = Object.assign({}, settings);	// shallow copy
	popupSettings.searchEngines = settings.searchEngines.filter(engine => engine.isEnabled);	// keep only enabled engines
	popupSettings.searchEnginesCache = {};

	// get icon cache for enabled engines only
	for (const engine of popupSettings.searchEngines)
	{
		if (engine.iconUrl) {
			let iconCache = settings.searchEnginesCache[engine.iconUrl];
			if (iconCache) {
				popupSettings.searchEnginesCache[engine.iconUrl] = iconCache;
			}
		}
	}
	return popupSettings;
}

// Also called from settings.
function runBackwardsCompatibilityUpdates(settings)
{
	// add settings that were not available in older versions
	let shouldSave = false;
	shouldSave |= createSettingIfNonExistent(settings, "popupItemVerticalPadding");
	shouldSave |= createSettingIfNonExistent(settings, "allowPopupOnEditableFields");
	shouldSave |= createSettingIfNonExistent(settings, "popupBorderRadius");
	shouldSave |= createSettingIfNonExistent(settings, "popupItemBorderRadius");
	shouldSave |= createSettingIfNonExistent(settings, "minSelectedCharacters");
	shouldSave |= createSettingIfNonExistent(settings, "middleMouseSelectionClickMargin");
	shouldSave |= createSettingIfNonExistent(settings, "hidePopupOnRightClick");

	for (let engine of settings.searchEngines)
	{
		if (engine.iconUrl === undefined && engine.type === "browser") {
			engine.iconUrl = engine.iconSrc;
			delete engine.iconSrc;
			delete engine.id;
			shouldSave = true;
		}
	}

	return shouldSave;
}

function createSettingIfNonExistent(settings, settingName)
{
	if (settings[settingName] === undefined) {
		settings[settingName] = defaultSettings[settingName];
		return true;
	}
	return false;
}

// Called from settings.
function getDefaultSettings() { return defaultSettings; }
function getConsts() { return consts; }
function isDebugModeActive() { return DEBUG; }
function getBrowserVersion() { return browserVersion; }

function onSettingsChanged(changes, area)
{
	if (area !== "local" || isObjectEmpty(changes)) {
		return;
	}

	if (DEBUG) { log("onSettingsChanged in " + area); }
	if (DEBUG) { log(changes); }

	browser.storage.local.get().then(onSettingsAcquired, getErrorHandler("Error getting settings after onSettingsChanged."));
}

function getErrorHandler(text)
{
	if (DEBUG) {
		return error => { log(`${text} (${error})`); };
	} else {
		return undefined;
	}
}

function isObjectEmpty(obj)
{
	for (const key in obj) {
		return false;	// has at least one element
	}
	return false;
}

function onContentScriptMessage(msg, sender, callbackFunc)
{
	if (msg.type !== "log") {
		if (DEBUG) { log("msg.type: " + msg.type); }
	}

	switch (msg.type)
	{
		case "getActivationSettings":
			callbackFunc(sss.activationSettingsForContentScript);
			break;

		case "getPopupSettings":
			callbackFunc(sss.settingsForContentScript);
			break;

		case "engineClick":
			onSearchEngineClick(msg.engine, msg.clickType, msg.selection, msg.hostname);
			break;

		case "log":
			if (DEBUG) { log("[content script log]", msg.log); }
			break;

		default: break;
	}
}

/* ------------------------------------ */
/* ----------- CONTEXT MENU ----------- */
/* ------------------------------------ */

function setup_ContextMenu()
{
	browser.contextMenus.onClicked.removeListener(onContextMenuItemClicked);
	browser.contextMenus.removeAll();

	if (sss.settings.enableEnginesInContextMenu !== true) {
		return;
	}

	let engines = sss.settings.searchEngines.filter(engine => engine.type !== "sss");

	if (sss.settings.contextMenuEnginesFilter === consts.ContextMenuEnginesFilter_SameAsPopup) {
		engines = engines.filter(engine => engine.isEnabled);
	}

	// define parent menu
	browser.contextMenus.create({
		id: "sss",
		title: "Search for “%s”",
		contexts: ["selection"],
	});

	// define submenu (one per engine)
	for (const engine of engines)
	{
		let contextMenuOption = {
			parentId: "sss",
			id: engine.searchUrl,
			title: engine.name,
			contexts: ["selection"],
		};

		// icons unsupported on 55 and below
		if (browserVersion >= 56) {
			let icon;
			if (engine.iconUrl.startsWith("data:")) {
				icon = engine.iconUrl;
			} else {
				icon = sss.settings.searchEnginesCache[engine.iconUrl];
				if (icon === undefined) {
					icon = engine.iconUrl;
				}
			}

			contextMenuOption.icons = {
				"32": icon,
			};
		}

		browser.contextMenus.create(contextMenuOption);
	}

	browser.contextMenus.onClicked.addListener(onContextMenuItemClicked);
}

function onContextMenuItemClicked(info, tab)
{
	let engine = sss.settings.searchEngines.find(engine => engine.searchUrl === info.menuItemId);
	if (engine !== undefined) {
		let hostname = new URL(info.pageUrl).hostname;
		let searchUrl = getSearchQuery(engine, info.selectionText, hostname);
		openUrl(searchUrl, sss.settings.contextMenuItemBehaviour);
	}
}

/* ------------------------------------ */
/* ------------ SHORTCUTS ------------- */
/* ------------------------------------ */

function setup_PopupHotkeys()
{
	// clear any old registrations
	if (browser.commands.onCommand.hasListener(onHotkey)) {
		browser.commands.onCommand.removeListener(onHotkey);
	}

	if (sss.settings.popupOpenBehaviour !== consts.PopupOpenBehaviour_Off) {
		browser.commands.onCommand.addListener(onHotkey);
	}
}

function onHotkey(command)
{
	if (command === "open-popup") {
		if (DEBUG) { log("open-popup"); }
		getCurrentTab(tab => browser.tabs.sendMessage(tab.id, { type: "showPopup" }));
	} else if (command === "toggle-auto-popup") {
		if (DEBUG) { log("toggle-auto-popup, sss.settings.popupOpenBehaviour: " + sss.settings.popupOpenBehaviour); }
		// toggles value between Auto and Keyboard
		if (sss.settings.popupOpenBehaviour === consts.PopupOpenBehaviour_Auto) {
			browser.storage.local.set({ popupOpenBehaviour: consts.PopupOpenBehaviour_Keyboard });
		} else if (sss.settings.popupOpenBehaviour === consts.PopupOpenBehaviour_Keyboard) {
			browser.storage.local.set({ popupOpenBehaviour: consts.PopupOpenBehaviour_Auto });
		}
	}
}

/* ------------------------------------ */
/* -------------- POPUP --------------- */
/* ------------------------------------ */

function setup_Popup()
{
	// browser.tabs.onUpdated.removeListener(onTabUpdated);
	browser.webNavigation.onDOMContentLoaded.removeListener(onDOMContentLoaded);

	if (sss.settings.popupOpenBehaviour !== consts.PopupOpenBehaviour_Off) {
		// browser.tabs.onUpdated.addListener(onTabUpdated);
		browser.webNavigation.onDOMContentLoaded.addListener(onDOMContentLoaded);
		browser.tabs.query({}).then(installOnOpenTabs, getErrorHandler("Error querying tabs."));
	}
}

function onDOMContentLoaded(details)
{
	injectContentScript(details.tabId, details.frameId);
}

function installOnOpenTabs(tabs)
{
	// if (DEBUG) { log("installOnOpenTabs"); }
	for (const tab of tabs) {
		injectContentScriptIfNeeded(tab.id, undefined, true);	// inject on all frames if possible
	}
}

// function onTabUpdated(tabId, changeInfo, tab)
// {
// 	// if (DEBUG) { log("onTabUpdated " + changeInfo.status + " "+ tabId); }
// 	if (changeInfo.status === "loading") {
// 		injectContentScriptIfNeeded(tabId);
// 	}
// }

function injectContentScriptIfNeeded(tabId, frameId, allFrames)
{
	// if (DEBUG) { log("injecting on "+ tabId); }

	// try sending message to see if content script exists. if it errors then inject it
	browser.tabs.sendMessage(tabId, { type: "isAlive" }).then(
		msg => {
			if (msg === undefined) {
				injectContentScript(tabId, frameId, allFrames);
			}
		},
		_ => injectContentScript(tabId, frameId, allFrames)
	);
}

function injectContentScript(tabId, frameId, allFrames)
{
	if (DEBUG) { log("injectContentScript " + tabId + " frameId: " + frameId + " allFrames: " + allFrames); }

	let errorHandler = getErrorHandler(`Error injecting page content script in tab ${tabId}.`);
	browser.tabs.executeScript(tabId, { runAt: "document_start", frameId: frameId, allFrames: allFrames, code: "const DEBUG = " + DEBUG + ";"        }).then(result =>
	browser.tabs.executeScript(tabId, { runAt: "document_start", frameId: frameId, allFrames: allFrames, file: "/content-scripts/selectionchange.js" }).then(result =>
	browser.tabs.executeScript(tabId, { runAt: "document_start", frameId: frameId, allFrames: allFrames, file: "/content-scripts/page-script.js"     }).then(null
	, errorHandler)
	, errorHandler)
	, errorHandler);
}

function onSearchEngineClick(engineObject, clickType, searchText, hostname)
{
	if (engineObject.type === "sss") {
		if (engineObject.id === "copyToClipboard") {
			getCurrentTab(tab => browser.tabs.sendMessage(tab.id, { type: "copyToClipboard" }));
		} else if (engineObject.id === "openAsLink") {
			// trim text and add http protocol as default if text doesn't have it
			searchText = searchText.trim();
			if (!searchText.includes("://") && !searchText.startsWith("about:")) {
				searchText = "http://" + searchText;
			}

			searchText = encodeURI(searchText);

			if (DEBUG) { log("open as link: " + searchText); }

			if (clickType === "leftClick") {
				openUrl(searchText, sss.settings.mouseLeftButtonBehaviour);
			} else if (clickType === "middleClick") {
				openUrl(searchText, sss.settings.mouseMiddleButtonBehaviour);
			} else if (clickType === "ctrlClick") {
				openUrl(searchText, consts.MouseButtonBehaviour_NewBgTab);
			}
		}
	} else {
		let engine = sss.settings.searchEngines.find(engine => engine.searchUrl === engineObject.searchUrl);

		if (clickType === "leftClick") {
			openUrl(getSearchQuery(engine, searchText, hostname), sss.settings.mouseLeftButtonBehaviour);
		} else if (clickType === "middleClick") {
			openUrl(getSearchQuery(engine, searchText, hostname), sss.settings.mouseMiddleButtonBehaviour);
		} else if (clickType === "ctrlClick") {
			openUrl(getSearchQuery(engine, searchText, hostname), consts.MouseButtonBehaviour_NewBgTab);
		}
	}
}

function getSearchQuery(engine, searchText, hostname)
{
	let query = engine.searchUrl;
	query = query.replace("{searchTerms}", encodeURIComponent(searchText));
	query = query.replace("{hostname}", hostname);
	return query;
}

function openUrl(urlToOpen, openingBehaviour)
{
	getCurrentTab(tab =>
	{
		const lastTabIndex = 9999;
		let options = { url: urlToOpen };
		if (browserVersion >= 57 && openingBehaviour !== consts.MouseButtonBehaviour_NewWindow && openingBehaviour !== consts.MouseButtonBehaviour_NewBgWindow) {
			options["openerTabId"] = tab.id;
		}

		switch (openingBehaviour)
		{
			case consts.MouseButtonBehaviour_ThisTab:
				browser.tabs.update(options);
				break;
			case consts.MouseButtonBehaviour_NewTab:
				options["index"] = lastTabIndex + 1;
				browser.tabs.create(options);
				break;
			case consts.MouseButtonBehaviour_NewBgTab:
				options["index"] = lastTabIndex + 1;
				options["active"] = false;
				browser.tabs.create(options);
				break;
			case consts.MouseButtonBehaviour_NewTabNextToThis:
				options["index"] = tab.index + 1;
				browser.tabs.create(options);
				break;
			case consts.MouseButtonBehaviour_NewBgTabNextToThis:
				options["index"] = tab.index + 1;
				options["active"] = false;
				browser.tabs.create(options);
				break;
			case consts.MouseButtonBehaviour_NewWindow:
				browser.windows.create(options);
				break;
			case consts.MouseButtonBehaviour_NewBgWindow:
				// options["focused"] = false;	// crashes because it's unsupported by Firefox
				browser.windows.create(options);
				break;
		}
	});
}

function getCurrentTab(callback)
{
	browser.tabs.query({currentWindow: true, active: true}).then(
		tabs => callback(tabs[0]),
		getErrorHandler("Error getting current tab.")
	);
}

/* ------------------------------------ */
/* ------------------------------------ */
/* ------------------------------------ */
