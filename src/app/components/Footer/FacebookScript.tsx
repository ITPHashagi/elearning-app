import { useEffect } from "react";

function FacebookScript() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).fbAsyncInit = function () {
        (window as any).FB.init({
          xfbml: true,
          version: "v13.0",
        });
      };

      (function (d, s, id) {
        let js: HTMLScriptElement, fjs: HTMLElement | null;

        fjs = d.getElementsByTagName(s)[0] as HTMLElement;
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement; // Ép kiểu tại đây
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs?.parentNode?.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);

  return null;
}

export default FacebookScript;
