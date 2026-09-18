# Pliki do ćwiczeń

Zbiór autorski i całkowicie syntetyczny, 2026-09-17. Nie zawiera danych klienta ani prawdziwego pomiaru. Możesz używać i modyfikować te pliki do ćwiczeń. Nie przedstawiaj ich jako realizacji terenowej.

## Mapowanie M06

- `m06-checkpoints.csv`: różnice model minus odniesienie, w metrach. To tabela błędów, a nie współrzędne punktów. Nie importuj dx/dy jako położenia geograficznego. Policz RMSE poziome sqrt(mean(dx²+dy²)) i pionowe sqrt(mean(dz²)). Wyniki: około 0,0791 m i 0,0632 m.
- `m06-stockpile.asc`: rzeczywisty plik ASCII Grid do otwarcia w GIS, 2 × 2 komórki po 5 × 5 m. Wysokości syntetyczne: 101, 102, 103 i 102 m. Baza obliczenia: 100 m. Suma objętości ponad bazą: 200 m³. Przy bazie 100,2 m: 180 m³.
- `m06-boundary.csv`: wielokąt WKT o powierzchni poziomego rzutu 1000 m² i obwodzie 140 m. Importuj jako tekst rozdzielany, geometrię z kolumny `wkt`. Nie traktuj go jako obrysu rastra: raster obejmuje tylko 100 m² wewnątrz większej strefy.

Współrzędne są lokalne i dydaktyczne; jednostka w planie oraz wysokości to metr. Nie przypisano EPSG, państwowego układu wysokości ani lokalizacji na Ziemi. W GIS zachowaj brak geograficznego odniesienia i pomiary kartezjańskie/planimetryczne w jednostkach lokalnych, zgodnie z możliwościami użytej wersji. Jeżeli narzędzie wymaga CRS, nie nadawaj fikcyjnego EPSG: wykonaj rachunek tabelaryczny i zapisz ograniczenie narzędzia. Pliki nie służą do ćwiczenia transformacji układów.

### Ćwiczenie dodatkowe w GIS

1. Otwórz raster i sprawdź w jego właściwościach 2 kolumny, 2 wiersze, komórkę 5 m i NoData -9999. Zapisz zrzut właściwości.
2. Dodaj wielokąt WKT i porównaj jego zasięg z rastrem. Zapisz, dlaczego nie wolno ekstrapolować objętości na cały wielokąt.
3. Przelicz cztery grubości ponad bazą w arkuszu i sprawdź sumę 200 m³; powtórz dla bazy 100,2 m.
4. Otwórz tabelę błędów jako tabelę bez geometrii. Dodaj kolumny dx²+dy² i dz², oblicz średnie i pierwiastki.
5. Zapisz projekt, tabelę i opis ograniczeń. Porównaj rachunki z kluczem M06. Dodatkowa praca w zewnętrznym GIS nie jest wliczona w czas prowadzonej ścieżki.

Nie dostarczono zdjęć lotniczych ani rzeczywistej ortomozaiki. Te pliki ćwiczą kontrolę formatów, jednostek, geometrii i rachunków, a nie pełną rekonstrukcję SfM.

## Inspekcje F06

- `f06-observations.csv`: trzy obserwacje z zadania F06. Oblicz kontrasty 12, 6 i 18 K, ale nie wyprowadzaj z nich przyczyny ani utraty energii.
- `field-report-template.csv`: nagłówki własnej tabeli przekazania. Uzupełnij ją dowodami, alternatywami, ograniczeniami i rolą następnego wykonawcy. Nie wymyślaj brakujących nazw rzeczywistych plików ani czasów.

## Od ćwiczeń do realnej praktyki

Przed samodzielnym świadczeniem usług potrzebne jest sprawdzenie pracy na rzeczywistych danych i w warunkach terenowych. Poniższe zadania służą rozmowie z kompetentnym instruktorem lub partnerem, nie stanowią uprawnień:

| Próba | Wymagany rezultat | Co ocenia partner |
|---|---|---|
| Dokumentacja PV | Odtworzenie topologii z rzeczywistego schematu i kart katalogowych | Zgodność ID, jednostek i interpretacji; brak nieuprawnionych czynności |
| Plan lotu | Brief, aktualne warunki operacji, ocena ryzyka, plan przerwania | Faktyczna legalność i wykonalność; samo przeczytanie kursu nie wystarcza |
| Pozyskanie RGB/IR | Próbny pas, rejestr warunków, oryginały, kontrola jakości | Ostrość, geometria, radiometria, powtarzalność, kompletność |
| Analiza | Obserwacje z hipotezami i próbą niezależnego potwierdzenia | Czy wniosek wynika z danych i czy prawidłowo odrzucono artefakty |
| Mapowanie | Legalny zbiór zdjęć, rekonstrukcja, niezależne punkty kontrolne | CRS, odniesienie wysokości, pokrycie, reszty, definicja produktu |
| Przekazanie | Raport, indeks, pliki źródłowe i rejestr ograniczeń | Możliwość odtworzenia wniosku oraz użycia plików przez odbiorcę |

Wynik zapisz z datą, nazwą zbioru, uwagami, poprawkami i osobą oceniającą. Krytyczny błąd bezpieczeństwa, fikcyjny dowód lub zatajenie braków blokują akceptację niezależnie od punktów. Partner ustala liczbę powtórzeń i zakres nadzoru po zobaczeniu twojej pracy. Kurs nie deklaruje zaliczenia tych prób.
