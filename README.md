# PV Asset Auditor Academy

Niezależna platforma e-learningowa: od podstaw elektryczności przez PV,
inspekcje UAV i termografię do mapowania, GIS oraz przekazania danych.

Platforma jest samodzielnym produktem edukacyjnym. Nie jest częścią żadnej
strony usługowej ani marki operatorskiej.

## Uruchomienie lokalne

Wymagany jest Node.js 22.12 lub nowszy.

```bash
npm ci
npm run dev
```

Pełna weryfikacja:

```bash
npm run check
```

## Publikacja

Push do `main` uruchamia testy, buduje statyczną aplikację Astro i publikuje
artefakt przez GitHub Pages. Produkcyjny adres:

<https://adamsnihur.github.io/pv-asset-auditor-academy/>

## Zakres

- 18 odrębnych lekcji w trzech ścieżkach, z przykładami i pracą własną;
- planowany czas pracy udokumentowany w `course-plan.json`, oparty na tekście,
  zadaniach i ocenianiu, nie na pomiarze aktywności użytkownika;
- źródła i macierz twierdzeń w katalogach każdej ścieżki;
- quizy z objaśnieniami: 80% pytań ogólnych i 100% krytycznych;
- zapis rezultatu ćwiczenia oraz jawna samoocena przed odblokowaniem kolejnej lekcji;
- wznowienie nauki i eksport własnych notatek, lokalnie w przeglądarce;
- syntetyczne CSV, raster ASCII Grid i szablon raportu do pobrania;
- istniejący podręcznik pogłębiony w siedmiu częściach;
- interaktywne laboratorium instalacji mikro i utility-scale;
- przekroje sześciu rodzin urządzeń: rozdzielnice nN i SN, transformator,
  falownik, tor DC oraz pomiar energii; 40 wybieralnych części, 24 etapy
  działania i sześć przykładów obliczeniowych ze źródłami;
- pracownia termowizji i UAV: osiem tematów z ćwiczeniami, trzy syntetyczne
  sceny IR, palety i skale, kalkulator geometrii, osiem pytań oraz karta obserwacji;
- wzory matematyczne, tabele, checklisty i studium końcowe;
- tryb jasny, ciemny, druk oraz reduced motion.

Dawne 220 godzin to koncepcja rozszerzonego programu obejmującego także teren,
laboratoria i ocenę instruktora. Nie jest to zweryfikowany czas treści dostarczonej
na platformie. Zaliczenie quizów i samooceny nie stanowi kwalifikacji zawodowej.
Próby praktyczne do uzgodnienia z partnerem opisano w
`public/assets/practice/README.md`.

## Weryfikacja dydaktyczna

`course-plan.json` łączy cele, lekcje, ćwiczenia, oceny oraz źródła. Katalogi
`src/content/field-course/*/catalog.json` dostarczają te same lekcje interfejsowi.
Testy kontrolują spójność tych danych, odpowiedzi, bramki bezpieczeństwa i postęp.
Pliki Markdown są zaufaną treścią repozytorium. Renderer nie jest przeznaczony
do wyświetlania niezaufanego HTML przesłanego przez kursantów.

Modele wnętrz są ilustracjami dydaktycznymi, a nie projektami wykonawczymi.
Widok rozsunięty pokazuje części i ich funkcje, nie sekwencję obsługi urządzenia.
Testy anatomii weryfikują rzeczywistą geometrię Three.js, wybieranie elementów,
odwracalność rozsunięcia oraz zgodność części z katalogiem treści.

Pracownia termowizji jest otwartym uzupełnieniem 18 lekcji. Nie zmienia ich
postępu. Symulacje nie są zapisami z kamery, a kalkulator geometrii nie dobiera
parametrów operacyjnych ani nie potwierdza jakości pomiaru. Źródła znajdują się
przy tematach; zakres weryfikacji opisano w `docs/thermal-workshop-validation.md`.
