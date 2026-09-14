name: DOĞAÇLA Safkan Mobil Build (React Native)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Repodaki Kodu Al
      uses: actions/checkout@v4

    - name: Node.js Kurulumu (Stabil)
      uses: actions/setup-node@v4
      with:
        node-version: 18

    - name: Java Kurulumu (Android İçin)
      uses: actions/setup-java@v4
      with:
        distribution: 'zulu'
        java-version: '17'

    - name: 1. React Native (Expo) Ortamını Hazırla
      run: |
        npx create-expo-app dogacla-mobil --template blank
        cd dogacla-mobil
        
        # Sunucu çökmesini önlemek için RAM limitini artırıyoruz
        export NODE_OPTIONS="--max-old-space-size=8192"
        
        # Çakışma olmaması için sürümleri zorla sabitliyoruz
        npx expo install expo-av react-native-svg firebase lucide-react-native
        npm install nativewind@2.0.11 tailwindcss@3.3.2 --legacy-peer-deps
        
        npx tailwindcss init
        
        cat << 'EOF' > tailwind.config.js
        module.exports = {
          content: ["./App.js", "./App.jsx"],
          theme: { extend: {} },
          plugins: [],
        }
        EOF
        
        cat << 'EOF' > babel.config.js
        module.exports = function(api) {
          api.cache(true);
          return {
            presets: ['babel-preset-expo'],
            plugins: ["nativewind/babel"],
          };
        };
        EOF
        
        wget -O ./assets/icon.png "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dogacla_logsu.png"
        
        cat << 'EOF' > app.json
        {
          "expo": {
            "name": "DOĞAÇLA",
            "slug": "dogacla-mobile",
            "version": "1.0.0",
            "orientation": "portrait",
            "icon": "./assets/icon.png",
            "userInterfaceStyle": "dark",
            "splash": {
              "image": "./assets/icon.png",
              "resizeMode": "contain",
              "backgroundColor": "#0a0a0a"
            },
            "android": {
              "adaptiveIcon": {
                "foregroundImage": "./assets/icon.png",
                "backgroundColor": "#0a0a0a"
              },
              "package": "com.actiontime.dogacla"
            }
          }
        }
        EOF

    - name: 2. Kodu Entegre Et
      run: |
        cp App.jsx dogacla-mobil/App.js

    - name: 3. Android Kodlarını Üret ve Derle
      run: |
        cd dogacla-mobil
        export NODE_OPTIONS="--max-old-space-size=8192"
        npx expo prebuild --platform android --clean
        
        cd android
        chmod +x gradlew
        ./gradlew assembleRelease --no-daemon --stacktrace

    - name: 4. APK'yı Yükle
      uses: actions/upload-artifact@v4
      with:
        name: Dogacla-Oyun-Native-APK
        path: dogacla-mobil/android/app/build/outputs/apk/release/app-release.apk
