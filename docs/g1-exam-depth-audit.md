# Audyt głębokości przygotowania G1, 24.09.2026

## Kontrakt nauki

Zakres potwierdzony przez użytkownika: **eksploatacja E i dozór D do 1 kV, czynności kontrolno-pomiarowe, fotowoltaika i magazyny energii**. Punktem wyjścia jest osoba bez wykształcenia elektrycznego, po podstawach E01–E06. Celem samokształcenia jest samodzielne wyjaśnianie mechanizmów, rozwiązywanie przypadków oraz uzasadnianie decyzji z tego zakresu. Rzeczywiste umiejętności wykonawcze wymagają dodatkowej praktyki i oceny instruktora.

Poprzednie G01–G12 były podstawą ogólną. Mapa pięciu obszarów E, dziewięciu D i szesnastu kategorii urządzeń wykazywała obecność tematów, ale nie dowodziła dostatecznej głębokości przygotowania do egzaminu. Nie uprawniała do deklarowania pełnej wiedzy ani gwarancji zdania. Niniejszy audyt koryguje tę interpretację.

## Podstawa porównania

- [Rozporządzenie kwalifikacyjne](https://eli.gov.pl/api/acts/DU/2022/1392/text.html), szczególnie §4, §6 i §10. Zakres tematyczny zależy od wniosku; egzamin obejmuje teorię i praktykę i odbywa się ustnie.
- Program komisji SEP Olsztyn: [eksploatacja E](https://www.sep.olsztyn.pl/wp-content/uploads/2025/02/WiedzaE_Gr_1_2025.pdf) oraz [dozór D](https://www.sep.olsztyn.pl/wp-content/uploads/2025/02/WiedzaD_Gr_1_2025.pdf). Dokumenty potraktowano jako szczegółowy przykład wymagań, nie jednolitą bazę pytań wszystkich komisji. W pliku E oznaczenie pkt 2 przy §6 jest niespójne z przytoczonym zakresem E; pierwszeństwo ma tekst rozporządzenia.
- [BHP przy urządzeniach energetycznych](https://eli.gov.pl/api/acts/DU/2021/1210/text.html), instrukcje producentów, materiały techniczne autorów i źródła instytucjonalne wskazane bezpośrednio w lekcjach.

Weryfikacja prawna nie oznacza akredytacji kursu przez komisję. Nie ma jednej gwarantowanej listy pytań. Stan źródeł i ograniczenia są zapisane w rejestrach JSON; progi techniczne należy czytać wraz z warunkami zastosowania. Przykłady SYN są autorskimi danymi dydaktycznymi.

## Gdzie brakowało głębokości

| Umiejętność w wybranym zakresie | Ograniczenie poprzedniej wersji | Nauczanie i sprawdzenie po rozszerzeniu |
|---|---|---|
| Wyjaśnić obwód DC/AC i trzy fazy | Rozproszone podstawy, mało analizy awarii | G13: Kirchhoff, RLC, RMS, utrata N, bilans mocy i wariant rachunkowy |
| Czytać strukturę instalacji i schemat | Model urządzeń nie wystarczał do czytania dokumentacji | G14: przyłącze, rozdział, obwody, różne schematy i źródła |
| Prześledzić prąd uszkodzenia i ochronę | Same nazwy TN/TT/IT i proste przykłady | G15: drogi powrotu, PE/N/PEN, warunkowe czasy, dwie awarie IT |
| Uzasadnić dobór aparatury | Brak pełnego porównania mechanizmów i charakterystyk | G16: wkładki, B/C/D, RCD, stycznik, rozłącznik, selektywność |
| Oddzielić uziemienie, połączenia wyrównawcze i SPD | Zbyt skrótowy opis funkcji | G17: drogi prądu, parametry ochrony, koordynacja i ograniczenia |
| Sprawdzić przewód przy kilku warunkach | Jeden prosty dobór i spadek napięcia | G18: korekty, zwarcie, temperatura, spadek i środowisko |
| Wyjaśnić metodę i ocenić protokół | Pomiary przedstawione głównie jako pytania i granice roli | G19: ciągłość, izolacja, pętla, RCD, ziemia, warunki i niepewność |
| Wyjaśnić napęd i automatykę | Za mało czytania toru sterowania | G20: rozruch, podtrzymanie, blokady, napęd regulowany i przekładniki |
| Sprawdzić string i wejście falownika | Głównie napięcie na mrozie | G21: zimne Voc, gorące Vmp, MPPT, start, prądy, gałęzie i odbiór |
| Ocenić zasilanie rezerwowe | Brak pełnego bilansu trybów i granic mocy | G22: topologie, separacja, ochrona na wyspie, energia i agregat |
| Uzasadnić decyzję dozoru | Lista dokumentów bez dość szczegółowego przypadku | G23: hierarchia, OSD, pomiar rozliczeniowy, przeglądy, karta decyzji |
| Obronić całą instalację i odrzucić wadliwy odbiór | Krótkie studium orientacyjne | G24: dossier PV/BESS/napęd, protokoły, rachunki i obrona ustna |

G05–G08 pozostają obowiązkową podstawą organizacji pracy, utrzymania i ratownictwa. Nowe zadania nie zastępują tych lekcji. G10–G12 zachowują dotychczasową wartość i notatki. G11 oraz fragmenty dotyczące SN/WN nadal są orientacją, nie przygotowaniem do prac powyżej 1 kV.

## Sprawdzenie wiedzy zamiast deklaracji gotowości

G13–G24 zawierają ćwiczenia, wariant samodzielny i quiz z objaśnieniem. Każdy błąd oznaczony jako krytyczny blokuje zaliczenie, niezależnie od pozostałych odpowiedzi. Dodatkowy bank zawiera cztery autorskie pytania ustne dla każdej z dwunastu lekcji, kryteria odpowiedzi i pytanie pogłębiające. Próba przekrojowa losuje jedno pytanie z każdej lekcji.

Próg długości odpowiedzi służy wyłącznie wymuszeniu zapisania własnego uzasadnienia przed podglądem. Aplikacja nie ocenia jego znaczenia. Wynik oznacza samoocenę, nie egzamin lub prawdopodobieństwo zdania. Aby ocenić przygotowanie, instruktor powinien poprosić o odpowiedź bez materiałów, zmienić dane zadania i sprawdzić, czy kursant potrafi uzasadnić zmianę decyzji. W G24 znajduje się rubryka decyzja–uzasadnienie–dowód oraz błędy krytyczne.

## Weryfikacja praktyczna poza ekranem

Do uzgodnienia i wykonania w bezpiecznych warunkach z instruktorem:

1. Rozpoznanie schematu, aparatów, źródeł i granic urządzenia. Wyjaśnienie toru roboczego i ochronnego.
2. Organizacja pracy i przygotowanie strefy, identyfikacja zasilania zwrotnego, kontrola środków ochrony oraz sprawdzenie stanu beznapięciowego.
3. Wybór przyrządu, kategorii i metody; kontrola przyrządu oraz wyposażenia.
4. Przeprowadzenie właściwych badań ochronnych pod nadzorem, udokumentowanie warunków i ograniczeń.
5. Rozpoznanie wyniku niezgodnego lub nieocenialnego, sporządzenie protokołu i decyzji o dalszej eksploatacji.
6. Pierwsza pomoc, RKO i AED na wyposażeniu treningowym; reakcja na awarię i pożar zgodnie z procedurą.

Dowód to obserwacja i informacja zwrotna instruktora, a nie checkbox w przeglądarce. Kurs internetowy nie zastępuje dokumentów wymaganych do wniosku ani praktyki z urządzeniem.

## Profil ustaleń i granice

**Pewność:** wysoka co do zidentyfikowanych luk i dostarczonych elementów kursu; wynik konkretnego egzaminu oraz praktyczna kompetencja kursanta pozostają niezweryfikowane. **Zmiana względem poprzedniego audytu:** od mapy tematów do szczegółowego nauczania i niezależnego sprawdzenia rozumowania. **Wyłączenia:** praca powyżej 1 kV, trakcja, technika wojskowa, urządzenia służbowe i specjalistyczne Ex nie są objęte potwierdzonym zakresem przygotowania. Inne specyficzne urządzenia, np. elektroliza lub oświetlenie uliczne, wymagają rozszerzenia przy włączeniu ich do wniosku egzaminacyjnego. **Działanie przed egzaminem:** porównać tematykę otrzymaną od wybranej komisji z lekcjami i uzupełnić wymagania konkretnego urządzenia oraz praktykę.

## Weryfikacja wydania, 25.09.2026

- Dostarczono 24 lekcje G1, 134 pytania zamknięte z objaśnieniami oraz 48 pytań ustnych. Zachowano 18 lekcji podstawowych, model 3D, termowizję i podręcznik.
- 83 testy automatyczne przeszły, w tym rzeczywiste `gradeQuestions`: poprawny zestaw zalicza każdą lekcję, a każda alternatywna odpowiedź na pytanie krytyczne blokuje zaliczenie. Migracja zachowuje 12 wcześniejszych zaliczeń i notatki.
- Walidator planu G1: PASS; 720 minut planowanych, 702,3 minuty oszacowane z treści i aktywności, 58,33% ćwiczeń. To plan samokształcenia, bez czasu dodatkowych powtórek ustnych i praktyki z instruktorem. Plan podstawowy: PASS, 18 lekcji.
- Sprawdzono rachunki przykładów i klucze odpowiedzi. Nowe quizy mają zróżnicowane pozycje poprawnych odpowiedzi; nie zmieniono kluczy wcześniejszych lekcji.
- W przeglądarce sprawdzono przejście od odpowiedzi do porównania i samooceny, blokadę pustej odpowiedzi, zapis po odświeżeniu, osobne odpowiedzi próby, anulowanie i rozpoczęcie nowej próby. Przekrojowy zestaw zawierał po jednym pytaniu z G13–G24.
- Test dynamiczny w polu odpowiedzi: tekst ze znacznikiem `img` i `onerror` pozostał tekstem po zapisie i odświeżeniu; nie powstał element HTML ani nie wykonał się kod. Jest to test konkretnego wejścia, nie pełny audyt penetracyjny całej aplikacji.
- Widoki mobilny 375×812 i desktopowy sprawdzono wizualnie, także w ciemnym motywie. Nawigacja pytaniami przenosi fokus na nagłówek; nie wykryto poziomego przepełnienia ani powielonych identyfikatorów. Konsola nie zgłosiła błędów w badanym przebiegu.
- Eksport tekstu i izolacja zapisu przeszły testy automatyczne. Narzędzie przeglądarkowe nie potwierdziło zdarzenia pobrania pliku Blob; nie deklarujemy weryfikacji zapisanego pliku w tej przeglądarce.
- `npm audit --omit=dev`: brak zgłoszonych podatności. Produkcyjny build i weryfikacja odwołań do lokalnych zasobów: PASS. Pozostaje wcześniejsze ostrzeżenie bundlera o dużym pakiecie modelu 3D.

Zakres egzaminu i umiejętności praktyczne konkretnego kursanta nadal wymagają weryfikacji z komisją oraz instruktorem. Żaden test aplikacji nie uzasadnia obietnicy zdania egzaminu na 100%.
