export const getFocusableChildren = (el: any) =>
  el?.querySelectorAll("input, button, select, textarea, a[href]") || [];

export const setFocusTo = (el: any) => {
  el.focus();
};

export const isBrowser = (browserId: "chrome" | "firefox" | "safari") => {
  const userAgent = navigator.userAgent.toLowerCase();
  switch (browserId) {
    case "firefox":
      return userAgent.includes("firefox");
    case "chrome":
      return userAgent.includes("chrome") && !userAgent.includes("chromium");
    case "safari":
      return userAgent.includes("safari") && !userAgent.includes("chrome");
    default:
      return false;
  }
};
