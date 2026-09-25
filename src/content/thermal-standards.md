#### Najpierw wybierz właściwy dokument

**Stan weryfikacji: 25.09.2026.** Dokumentem odniesienia dla terenowej termografii PV jest **IEC TS 62446-3:2017**, wydanie 1. TS oznacza specyfikację techniczną. Nie potwierdziliśmy polskiego wydania „PN-EN IEC 62446-3”; nie dopisuj prefiksu PN-EN do raportu na podstawie nazwy spotkanej w reklamie. Rok „stability date” w katalogu nie jest datą automatycznego wygaśnięcia. Przed zleceniem sprawdź aktualność i zapisz wykorzystane wydanie. [Katalog IEC](https://webstore.iec.ch/en/publication/28628).

| Dokument | Do czego go użyjesz |
|---|---|
| **IEC TS 62446-3:2017** | Procedura termografii modułów i pozostałych elementów pracującej instalacji PV na zewnątrz. |
| **PN-EN 62446-1:2016-08 + A1:2019-01** | Dokumentacja, badania odbiorcze i nadzór nad systemem PV przyłączonym do sieci. Termogram nie zastępuje kompletu badań elektrycznych. |
| **PN-EN IEC 62446-2:2020-12** | Utrzymanie systemów PV: planowanie kontroli, konserwacji i działań po wykryciu nieprawidłowości. To uzupełnienie termografii, nie zamiennik części 3. |

Zakres części 1 nie obejmuje automatycznie układów hybrydowych ani magazynów. Dla PV/BESS sprawdź zakres konkretnego dokumentu i wymagania producentów. Nie przenoś samego numeru normy z jednego rodzaju instalacji na drugi. [PKN: część 1](https://sklep.pkn.pl/pn-en-62446-1-2016-08e.html), [PKN: część 2](https://sklep.pkn.pl/normy/pn-en-iec-62446-2-2020-12e.html).

#### „Aktualna”, „wymagana w umowie” i „obowiązkowa” to różne rzeczy

Stosowanie Polskich Norm jest co do zasady dobrowolne. Wymaganie zastosowania określonej procedury może wynikać z umowy lub specyfikacji zlecenia. Osobno sprawdza się obowiązki prawne dotyczące obiektu, prac elektrycznych i operacji UAV. Nie pisz, że każdy nalot PV jest prawnie zobowiązany do spełnienia części 3. [PKN: dobrowolność stosowania norm](https://www.pkn.pl/polskie-normy/informacje-o-pn/zagadnienia-prawne/dobrowolnosc-stosowania-norm).

Praktyczny zapis zakresu przygotuj przed wyjazdem: **co badamy, w jakim celu, według jakiego wydania, jak dokumentujemy odstępstwa i kto ocenia wynik**. Na przykład zamówienie przeglądu modułów nie oznacza dostępu do zacisków wewnątrz zamkniętej rozdzielnicy. Odbiorca powinien wiedzieć, jakie pytanie rozstrzygnie otrzymany raport. Sam zakup drona, kurs G1 lub zaznaczenie tej listy nie potwierdza zgodności wykonanej usługi.

#### Kryteria, które trzeba umieć sprawdzić

Poniżej **wybrane kryteria**, nie pełna reprodukcja specyfikacji. Do deklaracji zgodności potrzebne są właściwy tekst, kompetencje i dowody spełnienia wszystkich mających zastosowanie postanowień.

| Obszar | Punkt odniesienia IEC TS 62446-3:2017 |
|---|---|
| Warunki dla modułów | POA co najmniej **600 W/m²**; §5.3, tabela 3. |
| Wiatr i chmury | Maksymalnie **4 Bft / 28 km/h**; cumulus do **2/8 nieba**; tabela 3. |
| Zmiana warunków | Przy zmianie obciążenia/irradiancji **>10%/min** zaleca się **15 min** stabilizacji; §5.3. |
| Inne elementy elektryczne | Prąd roboczy co najmniej **30% znamionowego prądu badanego toru**; tabela 3. Nie zastępuje to progu dla modułów. |
| Kamera | **NETD ≤0,1 K przy 30°C**; pozostałe parametry, regulacja i wzorcowanie: §4.2, tabela 1. |
| Geometria | Maks. **3 cm/piksel** na module i minimum **5×5 pikseli/ogniwo**; tabela 1, A.1. Kąt do płaszczyzny modułu **>30°**, najlepiej blisko 90° bez odbić; §5.4.1, A.2. |

To wartości dla opisanej metody badania. **Limit wiatru w tabeli nie jest zezwoleniem na lot.** Zdolność drona, warunki operacji i bezpieczeństwo ludzi oceniasz osobno. POA mierzysz w płaszczyźnie modułów, a nie odczytujesz zamiennie z poziomej stacji pogodowej. NETD mówi o czułości, nie o błędzie temperatury całego procesu. [IEA PVPS, wytyczne O&M: praktyka pomiaru POA i rozdzielczości](https://iea-pvps.org/wp-content/uploads/2022/11/IEA-PVPS-Report-T13-25-2022-OandM-Guidelines.pdf).

#### Co zmienia użycie drona?

§5.4.2 opisuje nalot wyszukujący widoczne problemy jako **inspekcję uproszczoną**; wskazane miejsca mogą wymagać badania szczegółowego. Prędkość dobiera się do odpowiedzi detektora i rozmycia. **3 m/s nie jest uniwersalną dopuszczalną prędkością.** Załącznik B dotyczy kompetencji personelu, a §8 raportu.

Zaplanuj dwie decyzje: czy materiał lokalizuje podejrzane miejsca oraz czy pozwala odpowiedzieć na szczegółowe pytanie klienta. Liczby temperatur wyświetlane przez oprogramowanie nie zmieniają automatycznie poziomu inspekcji. Zachowaj połączenie obrazu źródłowego z warunkami i identyfikatorem elementu. Dla dużego obiektu przydatna jest mapa pokazująca, które fragmenty rzeczywiście oceniono. Brak obserwacji w miejscu z rozmytym obrazem nie oznacza braku usterki. Zależność między dystansem, polem pomiarowym i rozmiarem celu wyjaśnia [FLIR](https://www.flir.com/discover/professional-tools/understanding-distancesize-ratio/).

**Przykład obliczeniowy, dane syntetyczne:** obraz termiczny ma szerokość 640 pikseli, a płaski obszar obejmuje 16 m. GSD = 16/640 = 0,025 m, czyli 2,5 cm/piksel. Ogniwo o wymiarach 16×8 cm zajmie około 6,4×3,2 piksela. Choć pierwszy warunek wygląda dobrze, krótszy bok jest próbkowany za słabo względem wskazanego minimum. Aby uzyskać pięć pikseli na 8 cm, potrzebujesz GSD nie większego niż 1,6 cm/piksel w tym kierunku, z kontrolą geometrii i ostrości. To wniosek z modelu, nie gotowa wysokość lotu. Ujęcie ukośne i rzeczywiste pole pomiarowe wymagają dodatkowego sprawdzenia.

#### Ćwiczenie: czy przyjąć materiał?

**Syntetyczny zestaw danych:** POA 780 W/m², wiatr 14 km/h, cumulus 1/8, potwierdzona praca falownika. Kamera: NETD 50 mK, zapisane oryginały IR i RGB. Geometria i ogniwo jak w przykładzie powyżej. Po przejściu chmury POA wzrosło z 500 do 780 W/m² w minutę; rejestrację rozpoczęto dwie minuty później. Klient proponuje zdanie „pełna zgodność z IEC, wszystkie moduły bez wad”.

Zapisz trzy rzeczy: dwa powody wstrzymania deklaracji, plan uzupełnienia materiału oraz uczciwe zdanie do raportu. Oddziel poprawny pojedynczy parametr od poprawności całego badania.

<details><summary>Porównaj rozumowanie</summary>

Zmiana wynosi 56% w minutę; dwa problemy to brak udokumentowanej stabilizacji i niedostateczne próbkowanie krótszego boku ogniwa. Nie przyjmujemy deklaracji klienta. Planujemy ponowne pozyskanie po ustaleniu warunków i skorygowaniu geometrii, a także sprawdzenie pozostałych pozycji procedury. Przykład zapisu: „Materiał wymaga uzupełnienia przed oceną w zadeklarowanym zakresie; nie stanowi podstawy do stwierdzenia braku wad całej instalacji”. Nowy, poprawny obraz nie usuwa obowiązku oznaczenia wcześniejszych luk.

</details>

#### Od zgodności deklarowanej do udokumentowanej

Zbuduj własną **macierz: punkt dokumentu → dowód → wynik → odstępstwo → działanie**. Dla każdego wymagania wpisz „spełnione”, „niespełnione”, „nieustalone” albo uzasadnione „nie dotyczy”. Brak pliku lub pomiaru oznacza brak dowodu. Zgoda klienta na odstępstwo nie sprawia, że odstępstwo znika.

Do pakietu dołącz zakres i poziom badania, osoby i ich role, identyfikację sprzętu, rejestry, indeks obrazów, mapę pokrycia, obserwacje, ograniczenia i dalsze działania. Oddziel identyfikator obiektu od pozycji kamery. Wniosek „według wybranych elementów procedury, z odstępstwami…” wymaga ich jawnego wykazu; nie jest równoważny stwierdzeniu pełnej zgodności. Pobrana karta poniżej pomaga uporządkować dowody, lecz nie zastępuje pełnego raportu wymaganego w zleceniu.
