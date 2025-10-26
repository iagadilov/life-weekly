# 🔧 Xcode Build Fix - Инструкция

## ✅ Что уже сделано в терминале:

1. ✅ Переустановлены CocoaPods
2. ✅ Сгенерированы все необходимые файлы
3. ✅ Очищен DerivedData кеш
4. ✅ Удалена папка build

## 🎯 Что нужно сделать СЕЙЧАС в Xcode:

### Шаг 1: Полностью закрыть Xcode
```
⌘Q (Command + Q)
```

### Шаг 2: Переоткрыть проект
```bash
# В терминале:
open ios/LifeWeeks.xcworkspace
```

⚠️ **ВАЖНО:** Открывайте `.xcworkspace`, НЕ `.xcodeproj`!

### Шаг 3: Дождаться полной загрузки проекта
Xcode должен:
- Индексировать файлы (progress bar вверху)
- Загрузить все Pods
- Подождите ~30 секунд

### Шаг 4: Clean Build Folder
```
Product → Clean Build Folder
Или: ⇧⌘K (Shift + Command + K)
```

### Шаг 5: Build проект
```
Product → Build
Или: ⌘B (Command + B)
```

---

## 📊 Ожидаемый результат:

### Если все ОК:
- ✅ Build Succeeded
- ✅ 0 errors
- ✅ ~144 warnings (это нормально)

### Если ошибка осталась:

**Проверьте эти настройки:**

#### 1. Build Settings → Header Search Paths

1. Кликните на проект `LifeWeeks` (синяя иконка)
2. Выберите таргет `LifeWeeks`
3. Tab `Build Settings`
4. Найдите через поиск: `HEADER_SEARCH_PATHS`
5. Убедитесь что есть:
   ```
   $(inherited)
   "${PODS_ROOT}/Headers/Public"
   "${PODS_ROOT}/Headers/Public/**"
   $(SRCROOT)/../node_modules/react-native/Libraries
   ```

#### 2. Build Settings → Library Search Paths

Найдите: `LIBRARY_SEARCH_PATHS`

Должно быть:
```
$(inherited)
"${PODS_CONFIGURATION_BUILD_DIR}/DoubleConversion"
```

#### 3. Framework Search Paths

Найдите: `FRAMEWORK_SEARCH_PATHS`

Должно быть:
```
$(inherited)
"${PODS_CONFIGURATION_BUILD_DIR}"
```

---

## 🔥 Если НИЧЕГО не помогает:

### Nuclear Option: Полный сброс

```bash
# В терминале (закрыть Xcode перед этим):

# 1. Убить все процессы
killall Xcode
killall Simulator
killall node

# 2. Полная очистка
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf node_modules
rm -rf ~/Library/Caches/CocoaPods

# 3. Переустановка всего
npm install
cd ios
pod repo update
pod install
cd ..

# 4. Открыть Xcode
open ios/LifeWeeks.xcworkspace
```

---

## 🎯 Альтернатива: Build через терминал

Если Xcode продолжает ругаться, попробуйте:

```bash
# Из корня проекта:
xcodebuild \
  -workspace ios/LifeWeeks.xcworkspace \
  -scheme LifeWeeks \
  -configuration Debug \
  -sdk iphonesimulator \
  clean build
```

Если это сработает - значит проблема в настройках Xcode IDE.

---

## 📸 Что присылать если не работает:

1. Screenshot Issue Navigator (⌘8)
2. Screenshot конкретной ошибки (кликнуть на нее)
3. Screenshot Build Settings → Header Search Paths

---

## 💡 Быстрая проверка что все на месте:

```bash
# В терминале:
ls -la ios/Pods/DoubleConversion
ls -la ios/build/generated/ios/RCTAppDependencyProvider.h
```

Оба должны существовать!
