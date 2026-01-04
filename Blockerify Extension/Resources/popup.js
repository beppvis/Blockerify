console.log("Hello World!", browser);




function isShortsPage(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/shorts') || urlObj.pathname.startsWith('/shorts/') || urlObj.pathname.includes("shorts");
  } catch (e) {
    return false;
  }
}

