import { useState } from "react";
import QRCode from "react-qr-code";

export default function App() {
  return (
    <div>
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

function Header() {
  return <header>Chant</header>;
}

function Body() {
  const [deepLink, setDeepLink] = useState("No link generated yet....");
  const [platform, setPlatform] = useState(null);

  const code = generateRandomCode();
  const hostUrl = `https://deeplink-implementation.vercel.app/?code=${code}`;

  function isAndroid() {
    return /android/i.test(navigator.userAgent);
  }

  function isiOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function handleDeepLinkGeneration() {
    const href = window.location.href;
    const url = new URL(href);
    const host = url.host;
    console.log(host);

    if (!url.searchParams) {
      console.log("No search params found");
      return;
    }

    const params = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log(params);
    let baseUrl;
    if (isAndroid()) {
      baseUrl = "chant://register";
    } else if (isiOS) {
      baseUrl = "http://chant.page.link";
    }

    const deepLinkUrl = `${baseUrl}?code=${params.code}`;
    setDeepLink(deepLinkUrl);
  }

  function handleSignUp() {
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.geekyants.services.chant";
    const appStoreUrl = "https://apps.apple.com/in/app/chant/id1477159385";

    if (isAndroid()) {
      window.location.href = deepLink;
      setTimeout(() => (window.location.href = playStoreUrl), 2000);
      setPlatform("Android");
    } else if (isiOS()) {
      setPlatform("iOS");
      window.location.href = deepLink;
      setTimeout(() => (window.location.href = appStoreUrl), 2000);
    } else {
      alert("Please open this link on a mobile device.");
      setPlatform("Web");
    }
  }

  return (
    <div className="deep-link">
      <div className="deep-link-data">
        <QRCode bgColor="#383838" fgColor="#e9e0d4" value={hostUrl} />
        <h3>{deepLink}</h3>
        <p>{platform}</p>
      </div>

      <div className="action-buttons">
        <button onClick={handleDeepLinkGeneration}>Generate Deep Link</button>
        <button onClick={handleSignUp}>Open App</button>
      </div>
    </div>
  );
}

function Footer() {
  return <footer>© 2024 Vikas Kumar</footer>;
}

const generateRandomCode = () => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

//? Step: 1 The link generated on qr code will be the link to navigate to the web page
//? then based on platform the web page will generate an app link ( android ) or universal link ( ios )
//? If app is not installed the fallback url will take the user to playstore and before taking the user to playstore or app store we have to make a query to firebase or a server to store the reg code against device Id
//? Also they will have a fallback url
