# iOS Build Fixes Applied

## Проблема 1: RCTAppDependencyProvider.h not found

**Ошибка:**
```
'RCTAppDependencyProvider.h' file not found
```

**Причина:** Xcode не мог найти автогенерированные файлы в `ios/build/generated/ios/`

**Решение:** Добавлены пути поиска заголовочных файлов в `project.pbxproj`

**Файл:** `ios/LifeWeeks.xcodeproj/project.pbxproj`

**Изменения:**
```
HEADER_SEARCH_PATHS = (
    "$(inherited)",
    "$(SRCROOT)/build/generated/ios",
);
```

Добавлено в обе конфигурации: Debug и Release.

---

## Проблема 2: folly/coro/Coroutine.h not found

**Ошибка:**
```
fatal error: 'folly/coro/Coroutine.h' file not found
#include <folly/coro/Coroutine.h>
         ^~~~~~~~~~~~~~~~~~~~~~~~
```

**Причина:** В React Native 0.82 библиотека Folly собирается с флагом `FOLLY_CFG_NO_COROUTINES=1`, но в заголовочном файле `folly/Expected.h` есть условный include корутин который срабатывает неправильно.

**Решение:** Добавлен post_install hook в Podfile для установки флага компиляции во всех targets.

**Файл:** `ios/Podfile`

**Изменения:**
```ruby
post_install do |installer|
  react_native_post_install(
    installer,
    config[:reactNativePath],
    :mac_catalyst_enabled => false,
  )

  # Fix for Folly Expected.h coroutine issue
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'FOLLY_CFG_NO_COROUTINES=1'
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20'
    end
  end
end
```

После изменений выполнить:
```bash
cd ios
pod install
```

---

## Проблема 3: Code Signing

**Ошибка:**
```
Signing for "LifeWeeks" requires a development team
```

**Причина:** Xcode требует настройку подписи кода для запуска на устройстве или симуляторе.

**Решение:** Добавлены настройки автоматической подписи для симулятора.

**Файл:** `ios/LifeWeeks.xcodeproj/project.pbxproj`

**Изменения:**
```
CODE_SIGN_IDENTITY = "-";
CODE_SIGN_STYLE = Automatic;
DEVELOPMENT_TEAM = "";
```

Добавлено в обе конфигурации: Debug и Release.

---

## Запуск проекта

После применения всех исправлений:

### На симуляторе:
```bash
npm run ios
```

### На конкретном симуляторе:
```bash
npm run ios -- --simulator="iPhone 15"
```

### На физическом устройстве:
Требуется настроить `DEVELOPMENT_TEAM` в Xcode:
1. Открыть `ios/LifeWeeks.xcworkspace` в Xcode
2. Выбрать проект LifeWeeks
3. Выбрать target LifeWeeks
4. Signing & Capabilities → Team → выбрать свою команду

---

---

## Проблема 4: react-native-reanimated несовместимость с React Native 0.82

**Ошибки:**
```
fatal error: 'hermes/inspector/chrome/Registration.h' file not found
fatal error: 'yoga/style/Style.h' file not found
error: no matching constructor for initialization of 'RawProps'
```

**Причина:** React Native 0.82 - очень новая версия (февраль 2025), которая включает существенные изменения в архитектуре Yoga и Hermes. react-native-reanimated (даже версии 3.3.0-3.5.4) ещё не полностью поддерживает эти изменения.

**Решение:** Временно удалён react-native-reanimated до выхода совместимой версии.

**Изменения:**

1. **Файл:** `babel.config.js`
   ```javascript
   module.exports = {
     presets: ['module:@react-native/babel-preset'],
     // Удалён: plugins: ['react-native-reanimated/plugin'],
   };
   ```

2. **Удалён пакет:**
   ```bash
   npm uninstall react-native-reanimated
   ```

3. **Переустановлены pods:**
   ```bash
   cd ios
   pod install
   ```

**Примечание:** react-native-reanimated можно будет добавить обратно, когда выйдет версия с поддержкой React Native 0.82+.

---

## Результат

✅ Все ошибки компиляции исправлены
✅ Проект успешно собирается
✅ Приложение запускается на симуляторе

**Сборка:**
```bash
npm run ios
```

**Вывод:**
```
success Successfully built the app
success Successfully launched the app
```
