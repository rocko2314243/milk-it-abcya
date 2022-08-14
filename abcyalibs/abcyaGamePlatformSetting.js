
function initGamePlatformData(orientation) {
    var platformSettings = {};
    platformSettings.deviceType = null;
    platformSettings.browserType = null;
    platformSettings.tranformTypePrefix = "";
    platformSettings.allowsFullScreen = false;
    platformSettings.hasHomeButton = false;
    platformSettings.force43 = false;
    platformSettings.maxViewScale = 0;
    platformSettings.isMuted = false;
    platformSettings.allowsTouch = false;
    platformSettings.allowsMouseover = false;

    platformSettings.allowsPrint = false;
    platformSettings.touchSave = false;

    platformSettings.orientation = orientation;
    if (platformSettings.orientation === abcya.GameConstants.PORTRAIT) {
        platformSettings.orientationDimensions = {
            normal: {
                width: abcya.GameConstants.ORIENTATION_DIMS[1],
                height: abcya.GameConstants.ORIENTATION_DIMS[0]
            },
            widescreen: {
                width: abcya.GameConstants.ORIENTATION_DIMS[2],
                height: abcya.GameConstants.ORIENTATION_DIMS[0]
            }
        };
    }else{
        platformSettings.orientationDimensions = {
            normal: {
                width: abcya.GameConstants.ORIENTATION_DIMS[0],
                height: abcya.GameConstants.ORIENTATION_DIMS[1]
            },
            widescreen: {
                width: abcya.GameConstants.ORIENTATION_DIMS[0],
                height: abcya.GameConstants.ORIENTATION_DIMS[2]
            }
        };
    }

    if (typeof window.orientation !== 'undefined') { // Using orientation to check if we are on mobile
        platformSettings.isMobile = true;

    }else{ // We are on desktop
        platformSettings.maxViewScale = 1;
        platformSettings.isMobile = false;
        platformSettings.deviceType = abcya.GameConstants.DESKTOP;
    }

    setPlatformBrowserInfo(platformSettings);

    platformSettings.allowsFullScreen = (platformSettings.deviceType === abcya.GameConstants.ANDROID || platformSettings.deviceType === abcya.GameConstants.KINDLE);
    platformSettings.force43 = (platformSettings.deviceType === abcya.GameConstants.DESKTOP || platformSettings.deviceType === abcya.GameConstants.IPAD || platformSettings.orientation === abcya.GameConstants.PORTRAIT)
    platformSettings.allowsTouch = platformSettings.isMobile;
    platformSettings.allowsMouseover = !platformSettings.isMobile;

    return platformSettings;
}

/**
 * Pass in plaformSettings reference to set:
 * .browserType -> IE, Safari, etc...,
 * .transformTypePrefix -> prefix used in CSS transforms in GameMain resizing
 * .deviceType -> iphone, ipad, ??
 */
function setPlatformBrowserInfo(settingsObj) {
    if (settingsObj === void(0)) settingsObj = {};
    settingsObj.browserType = "default";
    settingsObj.tranformTypePrefix = "";
    settingsObj.deviceType = "";
    var ua = window.navigator.userAgent;

    // Device check, assuming desktop to start. //!!TODO: Need a plan/testing for windows touch/chromebook touch hybrids
    settingsObj.deviceType = "desktop";
    if (ua.match(/iPhone/i)) {
        settingsObj.deviceType = abcya.GameConstants.IPHONE;
    }else if (ua.match(/iPad/i)) {
        settingsObj.deviceType = abcya.GameConstants.IPAD;
    }else{
        if (ua.match(/android/i) !== null) {
            settingsObj.deviceType = abcya.GameConstants.ANDROID;
        }
        if (ua.match(/silk/i) !== null) {//!!TODO: Does silk triggon on android check, I think so?
            settingsObj.deviceType = abcya.GameConstants.KINDLE;
        }
    }

    //!! Going to tack on a isIE, type for IE has changed now has different variations
    settingsObj.isIE = false;
    // Browser Type & Prefix
    if (ua.match(/chrome/i)) {
        settingsObj.browserType = "chrome";
        settingsObj.tranformTypePrefix = "-webkit-";

    }else if (ua.match(/safari/i)) {
        settingsObj.browserType = "safari";
        settingsObj.tranformTypePrefix = "-webkit-";

    }else if (ua.match(/firefox/i)) {
        settingsObj.browserType = "firefox";
        settingsObj.tranformTypePrefix = "";

    }

    if (ua.match(/MSIE/i)) { // IE <= 10
        settingsObj.tranformTypePrefix = "-ms-";
        settingsObj.browserType = "ie";
        settingsObj.isIE = true;
    }

    if (ua.match(/Trident/i)) { // IE 11
        settingsObj.tranformTypePrefix = "-ms-";
        settingsObj.browserType = "ie-trident";
        settingsObj.isIE = true;
    }

    if (ua.match(/Edge/i)) { // IE Edge
        settingsObj.tranformTypePrefix = "-webkit-";
        settingsObj.browserType = "ie-edge";
        settingsObj.isIE = true;
    }

    if (settingsObj.isIE === true) {
        // Check for older Windows versions
        if (ua.match(/Windows NT 6.3/i)) {
            settingsObj.browserType = "ie-win8.1";
        }else if (ua.match(/Windows NT 6.2/i)) {
            settingsObj.browserType = "ie-win8";
        }else if (ua.match(/Windows NT 6.1/i)) {
            settingsObj.tranformTypePrefix = "-ms-";
            settingsObj.browserType = "ie-win7";
            settingsObj.isIE = true;
        }else if (ua.match(/Windows NT 6.0/i)) { // poor fella
            settingsObj.tranformTypePrefix = "-ms-";
            settingsObj.browserType = "ie-winVista";
            settingsObj.isIE = true;
        }else if (ua.match(/Windows NT 5.1/i)) {
            settingsObj.tranformTypePrefix = "-ms-";
            settingsObj.browserType = "ie-winXP";
            settingsObj.isIE = true;
        }
    }

    // iOS Homescreen or iOS app?
    //!! Should do a bit more checking here for alt phone types & make sure
    if (window.navigator.standalone === true) { // If running as homescreen on iOS
        settingsObj.browserType = "ios_homescreen";
        settingsObj.tranformTypePrefix = "-webkit-";
    }
    if (ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i)) {
        settingsObj.browserType = "ABCya_iOS";
        settingsObj.tranformTypePrefix = "-webkit-";
    }

    console.log("\n**Platform Browser Info**\ntype: " + settingsObj.browserType + "\nprefix: " + settingsObj.tranformTypePrefix + "\ndevice: " + settingsObj.deviceType);
    console.log("*** End Browser Info ***");
}

(function (window) {

    window.abcya = window.abcya || {};

    var GameConstants = {
        DESKTOP: 'desktop',
        IPAD: 'ipad',
        IPHONE: 'iphone',
        ANDROID: 'android',
        KINDLE: 'kindle',
        ABCYA_IOS: 'ABCya_iOS',
        ABCYA_ANDROID: 'ABCYa-android',

        PORTRAIT: "Portrait",
        LANDSCAPE: "Landscape",
        ORIENTATION_DIMS: [1024, 768, 576]

    };

    window.abcya.GameConstants = GameConstants;

}(window));
