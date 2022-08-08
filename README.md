# chrome-switchbot-controler

This Chrome extension SwitchBot can be used to control the terminal (power on or off).

- First install the SwitchBot app (iOS or Android) on your smartphone and register your device
- Next, tap 10 times where it says the app version to transition to the app settings screen.
- Next, you will see the developer options, tap to move on and get a token.

## Getting started

1. Install [the extension on the Chrome Web Store](https://chrome.google.com/webstore/detail/my-switchbot-controler/ajhnghbfoleadocfplnfkfnkcbcamehl)
2. Click the popup icon
3. Copy and paste the token you have just obtained, then press the Register button.
4. When the token is set correctly, the terminal under your control will be displayed, allowing you to turn it on or off.
5. Success !!!!

## Development

```
yarn
yarn build
yarn dev
```

Then `dist` directory will be created on the project root. Please load it on `chrome://extensions`.

## License

This repository is under [MIT license](https://opensource.org/licenses/MIT).

## Aritcle

[Zenn - SwitchBot 用の Chrome 拡張機能を作りました](https://zenn.dev/noripi10/articles/0e14d8dbea85cd)
