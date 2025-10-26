# Life Weekly

React Native приложение для визуализации жизни в неделях.

## Технологический стек

- React Native 0.82.1
- TypeScript
- React Navigation
- AsyncStorage
- React Native Gesture Handler
- React Native Screens
- React Native Safe Area Context
- React Native Haptic Feedback

## Установка

```bash
npm install
cd ios && pod install && cd ..
```

## Запуск

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Исправления сборки

Все исправления задокументированы в `claude/BUILD_FIXES_APPLIED.md`

Основные исправления:
- Настройка путей поиска заголовочных файлов для New Architecture
- Исправление конфликтов Folly coroutines
- Настройка code signing для симулятора
- Временное удаление react-native-reanimated из-за несовместимости с RN 0.82

## Статус

✅ iOS сборка работает
⏳ Android сборка (требует проверки)
