# Virtuální poradna ČENDA

AI právní poradce pro občany České republiky.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Anthropic Claude API (claude-sonnet-4-20250514)

## Vývoj
```bash
npm install
npm run dev
```

## Deploy
Projekt je nakonfigurován pro Railway — push na `main` větev spustí automatický deploy.

## Funkce
- Právní poradenství v 8 oblastech (exekuce, rozvod, práce, bydlení…)
- Strukturované odpovědi se zdroji a § zákonů
- ČAK disclaimer po každé odpovědi
- Carousel navazujících otázek
