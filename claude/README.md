# Life Weeks - Development Guide

## 📋 О проекте

Life Weeks - минималистичное мобильное приложение для iOS и Android, которое визуализирует жизнь пользователя в виде сетки недель.

**Статус:** Phase 1 (Setup) завершен ✅

---

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
npm run ios
```

### Android

```bash
npm run android
```

---

## 📁 Структура проекта

```
src/
├── components/ui/          # Базовые UI компоненты
├── screens/                # Экраны приложения
├── navigation/             # React Navigation setup
├── services/               # Бизнес-логика (Storage, WeekCalculator)
├── context/                # Global state (Context API)
├── types/                  # TypeScript типы
├── theme/                  # Дизайн-система
├── utils/                  # Вспомогательные функции
└── constants/              # Конфигурация
```

---

## 🛠️ Технологии

- **React Native** 0.82.1 (bare workflow)
- **TypeScript** (strict mode)
- **React Navigation** v6
- **AsyncStorage** - локальное хранилище
- **date-fns** - работа с датами
- **react-native-reanimated** v3 - анимации
- **react-native-gesture-handler** - жесты

---

## 📚 Документация

### Основные файлы:

1. **[SETUP_PROGRESS.md](./SETUP_PROGRESS.md)** - прогресс разработки
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - архитектурные решения

---

## ✅ Что реализовано (Phase 1)

### Core Infrastructure

- ✅ Структура проекта
- ✅ TypeScript конфигурация (strict mode)
- ✅ Theme система (colors, typography, spacing)
- ✅ Navigation setup (React Navigation)
- ✅ Context API для state management

### Services

- ✅ **WeekCalculator** - расчет недель жизни
- ✅ **Storage** - AsyncStorage wrapper

### Utilities

- ✅ **date.ts** - работа с датами (date-fns)
- ✅ **haptics.ts** - тактильная обратная связь

### Types

- ✅ Все TypeScript типы и интерфейсы
- ✅ Navigation types
- ✅ Context types

---

## 🎯 Следующие шаги

### Phase 2: UI Components (TODO)

Создать базовые компоненты:
- Button
- Input
- Card
- WeekCell
- WeekGrid
- TodoItem
- ProgressBar

### Phase 3: Onboarding Screen (TODO)

- UI для первичной настройки
- Валидация и сохранение профиля

### Phase 4: Life Grid Screen (TODO)

- Сетка недель (52 в ряду)
- Scroll to current week
- Header с прогресс-баром

### Phase 5-8: Остальные экраны и polish (TODO)

---

## 🧪 Testing

```bash
# TypeScript check
npx tsc --noEmit

# Linting
npm run lint

# Tests (когда будут реализованы)
npm test
```

---

## 📝 Code Style

### TypeScript

- Строгая типизация (strict mode)
- Explicit return types для публичных функций
- No `any` types

### Naming Conventions

- **Components:** PascalCase (e.g., `WeekCell.tsx`)
- **Functions:** camelCase (e.g., `getCurrentWeekNumber`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `STORAGE_KEYS`)
- **Types:** PascalCase (e.g., `UserProfile`)

### Imports Order

```typescript
// 1. External libraries
import React from 'react';
import { View } from 'react-native';

// 2. Internal modules
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

// 3. Types
import type { Week } from '../types';
```

---

## 🎨 Theme Usage

```typescript
import { colors, typography, spacing } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.m,
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
  },
});
```

---

## 🔧 VS Code Settings (рекомендуется)

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 📱 Тестирование на устройствах

### iOS Simulator

```bash
# Открыть список устройств
npx react-native run-ios --list-devices

# Запустить на конкретном устройстве
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Android Emulator

```bash
# Запустить эмулятор
emulator -avd Pixel_5_API_33

# Запустить приложение
npm run android
```

---

## 🐛 Troubleshooting

### Metro bundler cache

```bash
npm start -- --reset-cache
```

### iOS Pods issues

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Android clean build

```bash
cd android
./gradlew clean
cd ..
```

---

## 📞 Контакты

Для вопросов и предложений по разработке - создавайте issues в репозитории.

---

**Версия:** 1.0.0-alpha
**Последнее обновление:** Phase 1 Complete
