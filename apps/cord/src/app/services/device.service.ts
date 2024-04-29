import { Injectable } from '@angular/core';
import { IDevice } from '../api/science/idevice';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  get device(): IDevice {
    const browser = DeviceService.getBrowser();

    return {
      operatingSystem: DeviceService.getOperatingSystem(),
      browser: browser.name,
      browserVersion: browser.version,
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height
    };
  }

  private static getBrowser() {
    const nAgt = navigator.userAgent;
    let browserName = '';
    let fullVersion = '';
    let nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
      browserName = 'Opera';
      fullVersion = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
      browserName = 'Microsoft Internet Explorer';
      fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
      browserName = 'Chrome';
      fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
      browserName = 'Safari';
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
      browserName = 'Firefox';
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) != -1) fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(' ')) != -1) fullVersion = fullVersion.substring(0, ix);

    return {
      name: browserName,
      version: fullVersion
    };
  }

  private static getOperatingSystem() {
    if (navigator.userAgent.indexOf('Win') != -1) return 'Win';
    if (navigator.userAgent.indexOf('Mac') != -1) return 'MacOS';
    if (navigator.userAgent.indexOf('X11') != -1) return 'UNIX';
    if (navigator.userAgent.indexOf('Linux') != -1) return 'Linux';

    return 'Unknown OS';
  }
}
