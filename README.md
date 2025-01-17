# Active Learning and Teaching App :iphone:
[![iOS](https://img.shields.io/badge/-iOS-black?style=flat&logo=apple&link=https://github.com/Active-Learning-and-Teaching/ALT/releases)](https://github.com/Active-Learning-and-Teaching/ALT/releases)
[![Android](https://img.shields.io/badge/-Android-grey?style=flat&logo=android&link=https://github.com/Active-Learning-and-Teaching/ALT/releases)](https://github.com/Active-Learning-and-Teaching/ALT/releases)
[![React Native](https://img.shields.io/badge/-ReactNative-black?style=flat&logo=react)]()
[![Firebase](https://img.shields.io/badge/-Firebase-blue?style=flat&logo=firebase)]()

An open-source mobile application to facilitate teaching and learning in courses, including taking quizzes and feedbacks efficiently in classes.

<!-- <img width="731" alt="Screenshot 2021-04-30 at 18 16 51" src="https://user-images.githubusercontent.com/42066451/116697230-8e4b4c80-a9e0-11eb-860d-6fca12a876f5.png"> -->

<img width="1440" alt="Screenshot 2021-08-10 at 04 30 57" src="https://user-images.githubusercontent.com/42066451/128784943-4d3ad9d0-d575-4dfc-9be7-6522114db8ef.png">


## Folder Structure 📁

```
├── App
│   ├── App.js
│   ├── Assets
│   ├── Components
│   ├── Databases
│   ├── NotificationCenter.tsx
│   ├── Utils
│   ├── __tests__
│   ├── android
│   ├── app.json
│   ├── babel.config.js
│   ├── config.json
│   ├── firebase.json
│   ├── functions
│   ├── index.js
│   ├── ios
│   ├── metro.config.js
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   └── patches
├── Architecture.jpeg
├── README.md
```

## Setup 📥

1. Clone the repository to local machine
```sh
git clone https://github.com/SDOS-Winter2021/Team_1_ALT.git
```
2. Install Node Modules
```sh
cd App
npm install --legacy-peer-deps
```
3. Install CocoaPods
```sh
cd ios
pod install
```
4. Download the following files from the Firebase project and place them in their respective folder.
 - `App/config.json`
 - `App/android/app/google-services.json`
 - `App/ios/GoogleService-Info.plist`

## Build ⚙️

### iOS   
`npx react-native run-ios` 

### Android       
`npx react-native run-android`

## Release ⬇️
You can install the latest stable version of the app from Releases. The Android app is available as APK and iOS app is available through TestFlight.
