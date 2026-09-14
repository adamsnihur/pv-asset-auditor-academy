---
title: "Program szkoleniowy i podręcznik inżynierski: utility-scale PV Asset Auditor"
author: "Adam Snihur"
date: 2026-09-13
type: engineering-handbook
significance: 8
tags: [photovoltaics, utility-scale, thermography, UAV, asset-management, diagnostics]
staleness_date: 2027-03-13
status: verified-training-reference
---

# Program szkoleniowy i podręcznik inżynierski farm PV utility-scale

## Executive summary

Ten materiał przygotowuje do pracy na styku niezależnego audytu aktywów PV, doradztwa technicznego i radiometrycznej diagnostyki lotniczej. Rdzeniem metody jest łańcuch dowodowy: model fizyczny i topologia elektryczna, dane SCADA, kontrolowane pozyskanie RGB/IR, badanie naziemne, kwantyfikacja straty z niepewnością oraz decyzja techniczno-finansowa. Termogram jest obserwacją pola temperatury powierzchni, nie bezpośrednim pomiarem sprawności, przyczyny ani straty energii.

Program obejmuje 220 godzin: 92 h teorii, 82 h laboratoriów i terenu oraz 46 h analizy i raportowania. Warunkiem ukończenia jest zaliczenie pięciu bramek modułowych, egzamin bezpieczeństwa 100%, wykonanie misji BSP z audytowalnym QA oraz obrona audytu syntetycznej farmy 80 MWp. Absolwent ma umieć odrzucić niewiarygodne dane równie stanowczo, jak wskazać usterkę.

Dokument rozróżnia trzy klasy stwierdzeń: **[N] wymaganie normatywne** potwierdzone w publicznie dostępnej informacji o normie lub w posiadanym tekście normy, **[R] rekomendacja** instytucji lub publikacji oraz **[A] założenie projektowe/syntetyczne** użyte do obliczeń albo przygotowania misji. Dostęp do samego spisu treści lub streszczenia IEC nie uprawnia do odtwarzania niedostępnych klauzul. Wartości POA, wiatru, kąta, GSD, liczby pikseli na ogniwo i ΔT są zawsze opatrzone źródłem lub etykietą [A].

## 1. Granice kompetencji i bezpieczeństwa

Procedury są materiałem szkoleniowym. Nie zastępują uprawnień elektrycznych, kwalifikacji BSP, instrukcji producenta, oceny ryzyka, poleceń dyspozytora, procedury LOTO ani prawa krajowego. Praca przy obwodach DC do 1500 V, rozdzielnicach, stacjach SN/WN, zasilaniu wstecznym do EL i próbach izolacji wymaga kompetentnego personelu, właściwej kategorii prac oraz zatwierdzonej instrukcji organizacji bezpiecznej pracy.

Audytor nie podpisuje wyniku poza zakresem swoich uprawnień. W szczególności:

- IR lokalizuje anomalię i wspiera hipotezę, lecz nie dowodzi sama przyczyny ani utraty mocy;
- pomiar I-V opisuje stan w warunkach pomiaru, a korekcja do STC jest modelem z niepewnością;
- EL/PL pokazuje rozkład emisji lub odpowiedzi optycznej, ale znaczenie defektu zależy od połączeń, prądu wzbudzenia i konfiguracji;
- wynik finansowy zależy od kontraktu sprzedaży energii, cen przechwyconych, ograniczeń sieciowych, gwarancji i podatków, nie tylko od MWh;
- klasyfikator AI może priorytetyzować obrazy, ale wynik musi pozostać identyfikowalny, walidowany na danej domenie i możliwy do odrzucenia przez człowieka.

## 2. Architektura kompetencji

```text
fizyka złącza i modułu
  -> topologia DC/AC i sposób sterowania
    -> sygnał SCADA oraz warunki środowiskowe
      -> kontrolowany obraz RGB/IR
        -> hipotezy różnicowe
          -> badanie potwierdzające
            -> strata energii z niepewnością
              -> ryzyko, NPV, gwarancja i decyzja
```

Ślepe plamy, które program ma eliminować:

1. przypisanie każdej gorącej plamy do mikropęknięcia;
2. użycie temperatury absolutnej bez kontroli emisyjności, odbicia i geometrii;
3. przeliczenie liczby gorących modułów razy moc znamionowa;
4. ignorowanie faktu, że wspólny MPPT, clipping lub curtailment maskuje stratę;
5. korekcja I-V do STC mimo niestabilnego napromienienia i bez budżetu niepewności;
6. porównanie stringów o innej orientacji, zacienieniu albo konfiguracji;
7. użycie skuteczności AI z losowego podziału klatek jako dowodu generalizacji na nową farmę;
8. zamiana obserwacji diagnostycznej w rozstrzygnięcie gwarancyjne bez łańcucha dowodowego.

## 3. Plan nauki i kryteria zaliczenia

| Etap | Zakres | Teoria | Laboratorium/teren | Analiza/raport | Razem | Produkt zaliczeniowy |
|---|---|---:|---:|---:|---:|---|
| 0 | Bezpieczeństwo, metrologia, analiza ryzyka | 8 h | 8 h | 2 h | 18 h | JSA, plan LOTO, budżet niepewności |
| 1 | Fizyka i degradacja | 24 h | 10 h | 8 h | 42 h | dopasowanie modelu diodowego i atlas mechanizmów |
| 2 | Architektura i O&M | 18 h | 12 h | 10 h | 40 h | loss tree z danych SCADA i schematu jednokreskowego |
| 3 | Termografia radiometryczna BSP | 24 h | 28 h | 12 h | 64 h | plan lotu, dataset R-JPEG, QA i raport anomalii |
| 4 | Diagnostyka naziemna | 12 h | 20 h | 6 h | 38 h | I-V + EL/PL + izolacja na kontrolowanym stanowisku |
| 5 | TDD, struktury i ekonomika | 6 h | 4 h | 8 h | 18 h | memo inwestycyjne, macierz ryzyka i model NPV |
| 6 | Audyt integracyjny | 0 h | 0 h | wliczone wyżej | 0 h | obrona audytu 80 MWp |
| **Suma** |  | **92 h** | **82 h** | **46 h** | **220 h** |  |

### 3.1 Kolejność i rytm

Program trwa 14 tygodni po 14-18 h. Tygodnie 1-2 obejmują etap 0 i początek modułu 1; tygodnie 3-4 kończą moduł 1; tygodnie 5-6 obejmują moduł 2; tygodnie 7-10 moduł 3; tygodnie 11-12 moduł 4; tydzień 13 moduł 5; tydzień 14 audyt integracyjny. Przed pierwszym wejściem na farmę uczestnik musi zaliczyć bezpieczeństwo, identyfikację topologii i odczyt kart katalogowych.

### 3.2 Ćwiczenia obowiązkowe

1. Dopasować model jednodiodowy do pięciu krzywych I-V i wyjaśnić residua.
2. Zbudować loss tree z 30 dni danych 1-minutowych, rozdzielając dostępność, clipping, curtailment, soiling, temperaturę i nieokreślone residuum.
3. Wyznaczyć wysokość lotu z IFOV/FOV i wymaganej liczby pikseli na ogniwo, a następnie obliczyć rozmycie ruchu i odstęp zdjęć.
4. Wykonać trzy serie tego samego stołu przy zmiennym kącie obserwacji oraz wykazać wpływ odbicia i perspektywy.
5. Zarejestrować natywne dane radiometryczne, log FFC, pogodę, POA i identyfikację modułów.
6. Dla co najmniej sześciu klas anomalii sformułować po trzy hipotezy różnicowe oraz dobrać test rozstrzygający.
7. Przeprowadzić I-V na kontrolowanym obiekcie przy jednoczesnym pomiarze POA i temperatury, z korekcją i budżetem niepewności.
8. Wykonać EL lub PL na odłączonym, zabezpieczonym stanowisku i połączyć wynik z RGB, IR oraz I-V.
9. Zbudować model finansowy naprawy z wariantem pesymistycznym, bazowym i optymistycznym.
10. Obronić pełny raport przed recenzentem technicznym i inwestycyjnym.

### 3.3 Bramki zaliczeniowe

| Bramka | Kryterium | Próg |
|---|---|---|
| Safety | test pisemny, scenariusz LOTO, rozpoznanie łuku i napięcia indukowanego | 100% pozycji krytycznych, min. 90% całości |
| Metrology | spójność jednostek, ślad kalibracji, budżet niepewności | brak błędu jednostki; wszystkie wejścia z pochodzeniem |
| UAV radiometry | pełność metadanych, ostrość, piksele/ogniwo, geolokalizacja | >=95% objętych modułów; próbka 100% sprawdzona manualnie |
| Diagnosis | macierz hipotez i właściwe testy potwierdzające | >=80% punktów; zero diagnoz definitywnych z samego IR |
| Economics | energia, cash flow, NPV i analiza wrażliwości | arytmetyka 100%; brak podwójnego liczenia strat |
| Capstone | obrona audytu i odpowiedź na kontrhipotezę | >=80% rubryki i zamknięte wszystkie uwagi krytyczne |

## 4. Notacja, jednostki i niepewność

| Symbol | Znaczenie | Jednostka SI |
|---|---|---|
| $G_{POA}$ | napromienienie w płaszczyźnie modułów | W m$^{-2}$ |
| $H_{POA}$ | energia promieniowania w płaszczyźnie modułów | kWh m$^{-2}$ |
| $T_c,T_a$ | temperatura ogniwa/modułu i powietrza | K lub °C dla różnic |
| $I,V,P$ | prąd, napięcie, moc | A, V, W |
| $R_s,R_{sh}$ | rezystancja szeregowa i bocznikująca | Ω |
| $E_{AC}$ | energia oddana po stronie AC | Wh, kWh, MWh |
| $P_0$ | moc referencyjna DC w STC | Wp, kWp, MWp |
| $u_c,U$ | niepewność standardowa złożona i rozszerzona | jednostka wielkości mierzonej |
| $k$ | współczynnik rozszerzenia niepewności | 1 |
| $r$ | realna stopa dyskontowa | rok$^{-1}$ |

Niepewność wyniku $y=f(x_1,...,x_n)$ dla niezależnych wejść w przybliżeniu pierwszego rzędu:

$$
u_c^2(y)=\sum_{i=1}^{n}\left(\frac{\partial f}{\partial x_i}\right)^2u^2(x_i),
\qquad U=k u_c.
$$

Przy korelacjach należy dodać składniki kowariancji. W raporcie podaje się measurand, model, rozkłady wejść, źródła niepewności, $u_c$, przyjęte $k$ i przedział. Dla różnicy temperatur w jednej klatce część błędów wspólnych może się skorelować i częściowo znieść, lecz nie wolno zakładać tego dla pikseli o innej geometrii, emisyjności albo tle odbitym.

## 5. Hierarchia dowodów i źródeł

1. Tekst obowiązującego prawa, podpisana umowa, instrukcja producenta i zakupiona aktualna norma.
2. Publiczna karta IEC/ISO potwierdzająca edycję i zakres.
3. Raporty IEA PVPS, NREL, Fraunhofer ISE i laboratoriów akredytowanych.
4. Recenzowane publikacje z DOI, z oceną metody i próby.
5. Dane aktywa: schematy, flash list, SCADA, alarmy, serwis, pogodowe i pomiarowe.
6. Obserwacja terenowa i wynik algorytmu, zawsze z QA i ograniczeniem.

Jeżeli poziomy są sprzeczne, audytor nie uśrednia ich automatycznie. Rejestruje konflikt, ustala wersję dokumentu, zakres zastosowania oraz osobę uprawnioną do decyzji.

# Moduł 1. Fizyka ogniwa i mechanizmy degradacji

## 1.1 Struktura pasmowa, transport i rekombinacja

W półprzewodniku poziom Fermiego, przerwa energetyczna $E_g$ i koncentracje nośników określają warunki generacji oraz transportu. Dla niedegenerowanego materiału:

$$
n=N_C\exp\left[-\frac{E_C-E_F}{k_BT}\right],\qquad
p=N_V\exp\left[-\frac{E_F-E_V}{k_BT}\right],\qquad np=n_i^2.
$$

$n,p$ mają jednostkę m$^{-3}$, $N_C,N_V$ są efektywnymi gęstościami stanów [m$^{-3}$], $E_C,E_V,E_F,E_g$ są energiami [J lub eV], $k_B$ to 1,380649·10$^{-23}$ J K$^{-1}$, a $T$ jest w K. Przybliżenie Boltzmanna traci dokładność przy silnym zdegenerowaniu. Gęstość prądu dryfu i dyfuzji dla elektronów ma postać:

$$
\mathbf J_n=q n\mu_n\mathbf E+qD_n\nabla n,
$$

gdzie $\mu_n$ [m$^2$ V$^{-1}$ s$^{-1}$] jest ruchliwością, $D_n$ [m$^2$ s$^{-1}$] współczynnikiem dyfuzji, a relacja Einsteina $D/\mu=k_BT/q$ obowiązuje w reżimie niedegenerowanym i blisko równowagi.

Rekombinację opisuje się sumą kanałów. Rekombinacja Shockley-Read-Hall przez poziom pułapkowy:

$$
U_{SRH}=\frac{np-n_i^2}{\tau_p(n+n_1)+\tau_n(p+p_1)}
$$

ma jednostkę m$^{-3}$ s$^{-1}$. Rekombinacja radiacyjna $U_{rad}=B(np-n_i^2)$ i Augera $U_A=(C_n n+C_p p)(np-n_i^2)$ dominują w innych zakresach wstrzykiwania. Parametry $\tau$, $B$ i $C$ zależą od materiału, temperatury, powierzchni i procesu. Diagnostycznie istotne jest nie samo nazwanie kanału, lecz jego wpływ na $J_0$, $V_{oc}$, współczynnik wypełnienia oraz zależność od poziomu wstrzykiwania [S22].

Napięcie obwodu otwartego w przybliżeniu idealnym:

$$
V_{oc}\approx \frac{nk_BT}{q}\ln\left(\frac{I_{ph}}{I_0}+1\right).
$$

Wzrost temperatury zwiększa $I_0$ znacznie szybciej niż $I_{ph}$, dlatego współczynnik temperaturowy $V_{oc}$ i zwykle $P_{mpp}$ jest ujemny, podczas gdy $I_{sc}$ rośnie nieznacznie. Wartości współczynników należy brać z karty konkretnego modułu albo z pomiaru, nie przenosić między technologiami.

## 1.2 Architektury PERC, TOPCon, HJT i tandem

| Technologia | Selektywność kontaktu i pasywacja | Typowe przewagi fizyczne | Ryzyka i pułapki diagnostyczne |
|---|---|---|---|
| PERC | lokalny kontakt tylny przez pasywowaną warstwę dielektryczną, zwykle baza p | mniejsza rekombinacja tylna niż Al-BSF | B-O LID, LeTID zależny od materiału i procesu, rear-side PID w wariantach bifacial |
| TOPCon | ultracienki SiO$_x$ i domieszkowany polikrzem tworzą kontakt pasywowany, zwykle wafer n | wysokie $V_{oc}$ i niska rekombinacja kontaktowa [S24] | korozja metalizacji, warianty PID, wrażliwość na recepturę pasty i encapsulant; krótka historia terenowa wielu BOM |
| HJT/SHJ | c-Si pomiędzy warstwami a-Si:H intrinsic/doped i TCO, proces niskotemperaturowy | bardzo dobra pasywacja, wysoka bifaciality, korzystny współczynnik temperaturowy mocy | degradacja TCO/a-Si:H, korozja i adhezja metalizacji, ograniczenia temperaturowe procesu, PID zależny od stosu |
| perowskit-Si | podogniwa o różnych $E_g$ połączone 2T lub 4T | ograniczenie strat transmisji i termalizacji, potencjał sprawności wyższy niż jednozłączowe Si | stabilność światło-ciepło-wilgoć, migracja jonów, hermetyzacja, dopasowanie prądowe w 2T, mało danych wieloletnich |

W tandemie szeregowym 2T prąd jest ograniczony przez słabsze podogniwo:

$$
J_{2T}\approx\min(J_{top},J_{Si}),\qquad V_{2T}\approx V_{top}+V_{Si}.
$$

Zmiana widma, kąta padania, temperatury lub degradacja jednego absorbera wywołuje mismatch prądowy. Architektura 4T rozdziela punkty pracy kosztem dodatkowych warstw optycznych i elektroniki. Dane laboratoryjne sprawności tandemu nie są dowodem bankability modułu ani jego 25-letniej trwałości [S8, S12, S25].

## 1.3 Modele elektryczne

Model jednodiodowy dla modułu z $N_s$ ogniwami w szeregu:

$$
I=I_{ph}-I_0\left[\exp\left(\frac{V+IR_s}{nN_sV_T}\right)-1\right]-\frac{V+IR_s}{R_{sh}},
\qquad V_T=\frac{k_BT}{q}.
$$

$I_{ph},I_0$ są w A, $R_s,R_{sh}$ w Ω, $n$ jest bezwymiarowe. Równanie jest niejawne w $I$ i wymaga rozwiązania numerycznego albo funkcji Lamberta W. W pobliżu $I_{sc}$ niski $R_{sh}$ zmniejsza nachylenie i prąd; w pobliżu $V_{oc}$ wysoki $R_s$ obniża współczynnik wypełnienia. Parametry są skorelowane i nie należy wyznaczać mechanizmu wyłącznie z jednego dopasowania.

Model dwudiodowy rozdziela w przybliżeniu rekombinację dyfuzyjną i z obszaru zubożonego:

$$
I=I_{ph}-I_{01}\left[e^{\frac{V+IR_s}{n_1N_sV_T}}-1\right]
-I_{02}\left[e^{\frac{V+IR_s}{n_2N_sV_T}}-1\right]
-\frac{V+IR_s}{R_{sh}}.
$$

Zwiększa elastyczność, lecz również nieidentyfikowalność parametrów. W audycie terenowym ważniejsza jest powtarzalna procedura, kontrola wejść i interpretacja cech krzywej niż pozornie precyzyjna wartość każdego parametru [S23].

## 1.4 Mechanizmy degradacji

**LID** obejmuje kilka zjawisk aktywowanych oświetleniem. W p-type Cz klasyczny kompleks bor-tlen zmniejsza lifetime; regeneracja lub wafer Ga-doped ogranicza ten mechanizm, lecz nie eliminuje wszystkich form LID. **LeTID** rozwija się pod światłem i podwyższoną temperaturą, może przechodzić fazę degradacji i regeneracji, a jego kinetyka zależy od materiału, pasywacji i procesu. Krzywa mocy w czasie bez kontroli temperatury, napromienienia i dostępności nie rozróżnia LID od LeTID.

**PID** wynika z wysokiego potencjału ogniw względem uziemionej ramy, pól elektrycznych, migracji jonów i upływów zależnych od wilgoci, szkła, encapsulant i architektury. PID-shunting obniża $R_{sh}$; PID-polarization lub PID-delamination mogą dawać inne sygnały. Typowe położenie w stringu jest wskazówką, nie dowodem. Potwierdzenie łączy mapę potencjałów, izolację, EL przy właściwym prądzie, I-V i ewentualny test laboratoryjny.

**Mikropęknięcie** staje się energetycznie istotne, gdy izoluje obszar od siatki przewodzącej albo rozwija się pod obciążeniem. EL jest zwykle czulsze niż IR. Brak anomalii termicznej nie wyklucza pęknięcia; ciemny obszar EL nie oznacza automatycznie proporcjonalnej straty mocy.

**Snail trail** to wizualne przebarwienie powiązane często z pęknięciami, migracją wilgoci i produktami reakcji srebra. Jest markerem potrzeby badania, nie skalą utraty mocy. **Korozja** zwiększa opór metalizacji, interconnectów lub złączy, może tworzyć heating $P=I^2R$ i w końcu obwód otwarty. W EVA powstający kwas octowy i wilgoć mogą przyspieszać korozję; POE ma zwykle niższą przepuszczalność jonów i wilgoci, ale rzeczywista trwałość zależy od formulacji, laminacji i całego BOM.

**Delaminacja** zmienia sprzężenie optyczne, ścieżkę wilgoci, izolację i transport ciepła. **Przebarwienie encapsulant** redukuje transmisję i głównie $I_{sc}$. Pęcherze, delaminacja, korozja i PID mogą współwystępować, więc przypisanie jednej przyczyny wymaga danych materiałowych oraz historii [S8, S13, S16, S17, S26-S30].

## 1.5 Procedura: od sygnału degradacji do hipotezy

1. **Bezpieczeństwo:** przejrzyj schemat, napięcia, stan uziemień i zasady dostępu; nie dotykaj ani nie rozłączaj obwodu w tym etapie.
2. **Dokumentacja:** pobierz BOM, typ ogniwa, encapsulant, szkło/backsheet, datasheet, flash list, seriale, daty partii, gwarancję i wcześniejsze naprawy.
3. **Aparatura i nastawy:** zapisz typ, numer seryjny, kalibrację, firmware, zakres i nastawy każdego miernika/kamery; dobierz je do napięcia, prądu, pasma, sygnału i instrukcji producenta badanego obiektu.
4. **Warunki porównania:** utwórz kohorty o tej samej technologii, orientacji, wieku, inverter/MPPT i ekspozycji.
5. **SCADA:** sprawdź prąd, napięcie, moc, alarmy, izolację oraz pozycję elektryczną wzorca w stringu.
6. **Screening:** wykonaj RGB i IR z pełnymi metadanymi. Oznacz obserwację, nie przyczynę.
7. **Badanie rozstrzygające:** dobierz I-V, EL/PL, izolację, oględziny z bliska, pomiar rezystancji połączenia albo badanie materiałowe.
8. **Kontrola jakości:** zmierz referencję zdrową i podejrzaną w zbliżonych warunkach; wykonaj powtórzenia i blank/control.
9. **Niepewność:** rozdziel zmienność warunków, przyrządu, modelu korekcji i reprezentatywności próbki.
10. **Wniosek:** nadaj poziom `obserwacja`, `prawdopodobna klasa`, `potwierdzony mechanizm` lub `nierozstrzygnięte`.
11. **Eskalacja:** przy ryzyku łuku, izolacji, szkła lub konstrukcji zastosuj procedurę bezpiecznego wyłączenia i kompetentnego eksperta.

## 1.6 Diagnostyka różnicowa

| Sygnał | Hipoteza 1 | Hipoteza 2 | Hipoteza 3 | Test o największej wartości informacyjnej |
|---|---|---|---|---|
| niski $R_{sh}$, spadek $V_{oc}$ | PID-shunting | lokalny defekt złącza | wilgoć/zanieczyszczenie przewodzące | EL przy dwóch prądach + pozycja w stringu + izolacja |
| wzrost $R_s$, spadek FF | korozja/interconnect | uszkodzone złącze | niedokładny pomiar przewodów | termika BoS + four-wire/contact test + powtórzone I-V |
| ciemny obszar EL | pęknięcie izolujące | przerwany finger/busbar | niejednorodne wzbudzenie | EL w dwóch kierunkach/prądach + I-V modułu |
| spadek $I_{sc}$ | soiling/cień | przebarwienie EVA | mismatch spektralny/sensor POA | czyszczenie A/B + transmisja/UVF + referencja napromienienia |
| patchwork IR przy końcu stringu | PID | odbicie nieba | mieszana partia lub mismatch | zmiana geometrii + EL low-current + mapa potencjału |

## 1.7 Studium przypadku [A, dane syntetyczne]

Moduł 550 Wp ma w pomiarze skorygowanym do STC: $V_{oc}=48,2$ V, $I_{sc}=13,80$ A, $V_{mpp}=38,0$ V, $I_{mpp}=12,10$ A. Moduł referencyjny z tej samej partii ma $P_{mpp}=548$ W. Moc badanego:

$$P_{mpp}=38,0\cdot12,10=459,8\ \mathrm{W},$$

więc różnica względem referencji wynosi $88,2$ W, czyli $16,1\%$. Fill factor badanego:

$$FF=\frac{459,8}{48,2\cdot13,80}=0,691.$$

Przy podobnym $I_{sc}$, obniżonym $V_{mpp}$ i FF, same dane nie rozstrzygają między $R_s$, aktywną diodą bypass, mismatch a defektem złącza. IR pokazuje cieplejszą jedną trzecią modułu o 8 K, ale zmiana kąta usuwa 1 K artefaktu odbiciowego. EL pokazuje odizolowane fragmenty w jednej sekcji, a I-V ma schodek. Wniosek: potwierdzona utrata mocy modułu w warunkach modelu STC, prawdopodobny problem substringu; dokładny mechanizm pęknięcia lub interconnectu wymaga oględzin/laboratorium. Nie przenosi się 16,1% liniowo na energię farmy.

### Zadania z rozwiązaniami

**Zadanie 1.** Dla $I_{sc}=14,0$ A, $V_{oc}=49,0$ V i $P_{mpp}=560$ W oblicz FF. **Rozwiązanie:** $FF=560/(14,0·49,0)=0,816$.

**Zadanie 2.** Rezystancja połączenia wzrosła z 0,8 mΩ do 12 mΩ przy prądzie 13 A. Oblicz dodatkowe grzanie. **Rozwiązanie:** $\Delta P=I^2\Delta R=169·0,0112=1,89$ W. Temperatura nie wynika bez modelu cieplnego.

**Zadanie 3.** Dlaczego spadek $P_{mpp}$ o 5% nie dowodzi LeTID? **Rozwiązanie:** ten sam sygnał mogą dać temperatura, soiling, mismatch, LID, błąd sensora, Rs, clipping lub korekcja. Potrzebne są kohorty, historia warunków i badania optoelektryczne.

### Checklista modułu 1

- [ ] Technologia ogniwa i pełny BOM są znane albo jawnie oznaczone jako brak.
- [ ] Model diodowy ma określony zakres, temperaturę i sposób dopasowania.
- [ ] $R_s$ i $R_{sh}$ nie są utożsamiane z jedną przyczyną.
- [ ] LID, LeTID i PID są rozdzielone mechanizmem, kinetyką i testem.
- [ ] IR nie służy do wykluczania mikropęknięć.
- [ ] Snail trail jest markerem, nie miarą straty.
- [ ] Wniosek zawiera alternatywy, test rozstrzygający i niepewność.

# Moduł 2. Architektura farmy, O&M, SCADA i bezpieczeństwo

## 2.1 Topologia od modułu do punktu przyłączenia

W szeregu modułów napięcia się sumują, a prąd ogranicza element o najniższej zdolności prądowej. Dla równoległych stringów prądy się sumują przy wspólnym napięciu. Diody bypass ograniczają napięcie wsteczne zacienionej sekcji, ale ich aktywacja usuwa część napięcia modułu i tworzy schodek na I-V. Mismatch jest różnicą między sumą mocy elementów pracujących indywidualnie w MPP a mocą ich połączenia przy wspólnym punkcie pracy.

**Inwerter stringowy** ma wiele wejść i MPPT, skraca domenę wspólnego punktu pracy i zwykle zwiększa rozdzielczość diagnostyczną. Kosztem jest większa liczba urządzeń, komunikacji i prac terenowych. **Inwerter centralny** agreguje dużą moc DC, może być sprawniejszy kosztowo i prostszy w serwisie centralnym, lecz jedna awaria ma większy wpływ i wymaga dobrego monitoringu combinerów/stringów. O wyborze nie rozstrzyga sama sprawność katalogowa [S18].

MPPT maksymalizuje $P=VI$ w granicach napięcia, prądu i algorytmu. Przy wielomodalnej krzywej P-V lokalny algorytm może utknąć w lokalnym maksimum. Współdzielenie MPPT przez odmienne orientacje, technologie lub zacienienie zwiększa mismatch. Diagnostyka musi znać mapę `moduł -> string -> combiner/MPPT -> inverter -> transformator -> feeder -> POI`.

Clipping występuje, gdy dostępna moc DC przekracza limit inwertera lub limit eksportu. Energię clippingu wyznacza się względem wiarygodnej mocy dostępnej, nie sumy mocy STC:

$$
E_{clip}=\sum_t\max\left[0,P_{avail}(t)-P_{limit}(t)\right]\Delta t.
$$

$P_{avail}$ powinno uwzględniać irradiance, temperaturę, soiling, degradację i dostępność DC. Płaski wykres mocy nie dowodzi clippingu, jeśli równolegle działa curtailment, ograniczenie temperatury, napięcia albo prądu.

## 2.2 Stacje nN/SN/WN, straty i regulacja

Straty rezystancyjne trójfazowego toru AC:

$$
P_{Cu}=3I_{rms}^2R(T),\qquad R(T)=R_{ref}[1+\alpha_R(T-T_{ref})].
$$

Dla transformatora w uproszczeniu:

$$
P_{loss}=P_0+P_k\left(\frac{S}{S_n}\right)^2,
$$

gdzie $P_0$ to straty jałowe [W], $P_k$ straty obciążeniowe przy mocy znamionowej [W], $S$ i $S_n$ są w VA. Harmoniczne, temperatura, wentylacja i napięcie zmieniają wynik. Roczne straty należy całkować po profilu obciążenia, a nie liczyć z jednego punktu nominalnego.

Moc trójfazowa:

$$
P=\sqrt{3}\,UI\cos\varphi,\qquad Q=\sqrt{3}\,UI\sin\varphi,\qquad S=\sqrt{P^2+Q^2}.
$$

Wymiana mocy biernej, charakterystyki $Q(U)$, $P(f)$ i regulacja napięcia są określone kodeksem sieciowym, umową przyłączeniową i nastawami operatora. Zwiększenie $|Q|$ przy stałym limicie $S$ może zmniejszyć możliwe $P$. Audytor analizuje polecenie operatora, setpoint, pomiar w POI, reakcję inwerterów i ograniczenia termiczne. Nie klasyfikuje prawidłowej redukcji czynnej jako awarii.

## 2.3 SCADA i KPI

Performance ratio w podstawowej postaci:

$$
PR=\frac{Y_f}{Y_r}=\frac{E_{AC}/P_0}{H_{POA}/G_{ref}},
$$

gdzie $Y_f$ [h] jest uzyskiem końcowym, $Y_r$ [h] uzyskiem referencyjnym, a $G_{ref}=1000$ W m$^{-2}$. Granica pomiaru energii, definicja $P_0$, jakość sensora POA i treatment przestojów muszą być jawne. PR nie jest sprawnością i zależy od temperatury, spektrum, kąta, bifacial gain, soiling, clipping oraz dostępności.

Temperaturowo skorygowany model mocy może używać:

$$
P_{dc,model}=P_0\frac{G_{POA}}{G_{ref}}\left[1+\gamma_P(T_c-T_{ref})\right]f_{soil}f_{deg}f_{mismatch},
$$

z $\gamma_P$ [K$^{-1}$]. Jest to model [R/A], nie uniwersalna formuła normatywna. Dla bifacial PV potrzebny jest model przedniej i tylnej irradiance oraz geometrii [S3, S7, S10].

Dostępność czasowa $A_t$ i energetyczna $A_E$ odpowiadają na inne pytania:

$$
A_t=1-\frac{T_{unavailable}}{T_{eligible}},\qquad
A_E=1-\frac{E_{unavailable}}{E_{expected,eligible}}.
$$

Definicja okresu eligible, wyłączeń umownych i źródła $E_{expected}$ musi być uzgodniona. Dziesięć minut awarii w południe nie jest energetycznie równoważne dziesięciu minutom nocą.

Soiling ratio z pary czysty/brudny sensor lub moduł referencyjny wymaga porównywalnej temperatury i irradiance. Najprostszy estimator $SR=P_{dirty}/P_{clean}$ jest obciążony mismatch, starzeniem i błędem czyszczenia. Stację soiling należy kontrolować, kalibrować i czyścić według zdefiniowanego harmonogramu.

### Minimalny model jakości danych

Każdy kanał otrzymuje flagi: `valid`, `suspect`, `missing`, `substituted`, `curtailed`, `clipped`, `night`, `maintenance`. Walidacja obejmuje zakres, tempo zmiany, stuck sensor, zgodność redundantnych pyranometrów/reference cells, zegar, jednostki, znaki $P/Q$, status breakerów oraz ciągłość mapowania asset ID. Resampling nie może zamieniać długiej luki w pozornie poprawną średnią.

Degradację wyznacza się z szeregu skorygowanego i segmentowanego, np. przez regresję robust lub year-on-year. Nachylenie surowego PR może mieszać degradację z dryftem sensorów, zmianą soiling, dostępnością, curtailment i zmianami konfiguracji. Raport podaje metodę, przedział ufności i wrażliwość na filtr [S3, S7, S19-S21].

## 2.4 Bezpieczeństwo DC 1500 V i stacji

DC nie przechodzi przez naturalne zero prądu co półokres, więc łuk może się utrzymywać. Otwieranie złącza pod obciążeniem, niedopasowane komponenty, zła zaciskarka, wilgoć, uszkodzona izolacja i luźny styk tworzą ryzyko łuku, pożaru i porażenia. Napięcie stringu może wzrosnąć w niskiej temperaturze. Maksymalną liczbę modułów sprawdza się na skorygowanym $V_{oc}$ według danych producenta i norm projektowych:

$$
V_{oc,string,cold}=N_sV_{oc,STC}\left[1+\beta_{Voc}(T_{min,cell}-25^\circ C)\right],
$$

gdzie $\beta_{Voc}$ [K$^{-1}$] jest zwykle ujemny, więc przy $T<25^\circ$C napięcie rośnie. Należy użyć właściwej temperatury projektowej i tolerancji, nie temperatury średniej.

Arc-flash assessment po stronie AC/SN/WN zależy od prądu zwarciowego, czasu wyłączenia, odległości roboczej, obudowy i metody. Po stronie PV DC ograniczenie prądowe źródła nie eliminuje ryzyka łuku ani energii z równoległych stringów i kondensatorów. Granice podejścia, PPE i etykiety wynikają z zatwierdzonego badania oraz przepisów zakładowych.

LOTO jest sekwencją organizacyjną, nie samym wyłączeniem:

1. zidentyfikuj wszystkie źródła energii, także zasilania pomocnicze, generację PV, UPS, magazyn, napięcia indukowane i zdalne sterowanie;
2. powiadom i uzyskaj zgodę dyspozytora;
3. wykonaj kontrolowane wyłączenie zgodnie z instrukcją producenta;
4. odizoluj widoczne lub wskazane punkty;
5. załóż osobiste blokady i oznaczenia;
6. rozładuj/ogranicz energię zmagazynowaną i zabezpiecz przed ruchem;
7. sprawdź przyrząd na znanym źródle, potwierdź brak napięcia, ponownie sprawdź przyrząd;
8. uziemiaj i zwieraj tam, gdzie wymaga tego procedura oraz poziom napięcia;
9. po pracy wykonaj kontrolę, zdejmowanie blokad przez właścicieli i formalne przywrócenie.

## 2.5 Procedura analizy O&M

1. **Scope i granice:** ustal POI, okres, rozdzielczość oraz definicje kontraktowe.
2. **Topologia:** zweryfikuj SLD, cable schedule, konfigurację MPPT, wersje firmware i historię zmian.
3. **Bezpieczeństwo i dostęp:** ogranicz pobieranie danych do read-only, zatwierdź cyber/HSE scope i nie wydawaj zdalnych poleceń bez osobnej autoryzacji.
4. **Aparatura i konfiguracja:** zinwentaryzuj liczniki, sensory POA/temperatury/wiatru, klasy, kalibracje, firmware, sample rate, jednostki i ustawienia plant controller.
5. **Jakość danych:** oblicz completeness per kanał, dryft sensorów, synchronizację czasu i flagi.
6. **Model referencyjny:** wyznacz oczekiwaną moc/energię z lokalnego POA i temperatury, na czystych okresach.
7. **Segmentacja:** osobno analizuj normal operation, clipping, curtailment, grid outage, plant outage, maintenance i missing data.
8. **Peer comparison:** porównuj tylko kohorty topologicznie i środowiskowo równoważne.
9. **Loss tree:** przypisz energię jeden raz według hierarchii przyczyn; residuum zostaw jako unexplained.
10. **Inspekcja:** połącz anomalie czasowe z konkretnym MPPT/stringiem i dopiero wtedy planuj BSP/naziemne testy.
11. **Ryzyko:** natychmiast eskaluj izolację, łuk, hotspot BoS, przegrzanie transformatora i niesprawne zabezpieczenie.
12. **Raport i niepewność:** zachowaj query, wersję modelu, wejścia, wyłączenia, kalibracje, budżet niepewności i reprodukowalny eksport.

## 2.6 Diagnostyka różnicowa

| Sygnał SCADA | Możliwe przyczyny | Jak rozdzielić |
|---|---|---|
| płaskie $P_{AC}$ w południe | clipping, curtailment, limit termiczny, limit eksportu | porównaj setpoint, $S/Q$, DC voltage/current, status i temperaturę |
| niski prąd jednego MPPT | string open, fuse, shading/soiling, sensor | prądy stringów, IR/RGB, continuity po LOTO, swap/check sensor |
| wysoki V, I≈0 | obwód otwarty lub string/MPPT odłączony | status izolatora, combiner, bezpiecznik, pomiar napięcia przez uprawniony personel |
| niski V i normalny I | aktywna bypass/mismatch, błędne mapowanie | I-V, termika substringu, topologia i odczyt sąsiednich stringów |
| spadek całej stacji | grid/transformer, curtailment, weather sensor | POI, feeder status, redundantne irradiance, event log |
| powolny trend PR | degradacja, sensor drift, soiling, zmiana albedo | kalibracja, clean/dirty, year-on-year, changepoint i inspekcja |

## 2.7 Studium przypadku [A, dane syntetyczne]

Farma 20 MWp produkuje rocznie 21 000 MWh. Analiza wykazała: 42 h pełnej niedostępności w godzinach o modelowanej średniej 8 MW, clipping 190 MWh, curtailment 260 MWh i soiling 2,0% energii, która pozostałaby po wyłączeniach. Energia niedostępności:

$$E_{unavail}=42\ \mathrm h\cdot8\ \mathrm{MW}=336\ \mathrm{MWh}.$$

Nie wolno dodać $0{,}02·21\,000=420$ MWh, jeśli 21 000 MWh już zawiera wszystkie straty i model soiling dotyczy innej bazy. Przyjmując kontrfaktyczną energię po grid/availability/clipping/curtailment równą 21 600 MWh, soiling wynosi 432 MWh. Udokumentowany loss tree ma zatem 336 + 190 + 260 + 432 = 1218 MWh, ale tylko wtedy, gdy kategorie są wzajemnie rozłączne. W przedziale wspólnego clippingu i soiling najpierw przypisuje się limit, a uniknięta strata soiling może nie zamienić się w eksport.

### Zadania z rozwiązaniami

**Zadanie 1.** Transformator ma $P_0=18$ kW i $P_k=95$ kW. Przez 6 h pracuje przy $S/S_n=0,7$, a przez 18 h jest pod napięciem bez obciążenia. **Rozwiązanie:** $E=24·18+6·95·0,7^2=432+279,3=711,3$ kWh/dzień.

**Zadanie 2.** Inwerter ma limit $S=5$ MVA i wymaga $Q=3$ MVAr. Ile maksymalnie $P$ przy braku przeciążenia? **Rozwiązanie:** $P=\sqrt{5^2-3^2}=4$ MW.

**Zadanie 3.** $P_0=10$ MWp, $H_{POA}=120$ kWh/m², $E_{AC}=960$ MWh. **Rozwiązanie:** $Y_f=96$ h, $Y_r=120$ h, $PR=0,80$.

### Checklista modułu 2

- [ ] SLD i mapping assetów odpowiadają konfiguracji rzeczywistej.
- [ ] Granica energii, $P_0$ i definicje dostępności są jawne.
- [ ] POA, temperatura i liczniki mają status kalibracji oraz flagi jakości.
- [ ] Clipping, curtailment i awaria nie są liczone podwójnie.
- [ ] Analiza $P/Q/S$ uwzględnia polecenia operatora i limit pozorny.
- [ ] Przed testem elektrycznym istnieje JSA, LOTO i właściwe uprawnienia.
- [ ] Alert bezpieczeństwa ma pierwszeństwo przed optymalizacją uzysku.

# Moduł 3. Radiometryczna termografia BSP

## 3.1 Radiacja cieplna i to, co mierzy kamera

Spektralna luminancja ciała doskonale czarnego według Plancka:

$$
L_\lambda^b(T)=\frac{2hc^2}{\lambda^5}
\frac{1}{\exp\left(\frac{hc}{\lambda k_BT}\right)-1}.
$$

$L_\lambda^b$ ma jednostkę W m$^{-3}$ sr$^{-1}$, jeżeli $\lambda$ jest w metrach, albo po przeliczeniu W m$^{-2}$ sr$^{-1}$ µm$^{-1}$. $h=6{,}62607015·10^{-34}$ J s, $c=299\,792\,458$ m s$^{-1}$. Prawo Stefana-Boltzmanna dla całkowitej emitancji hemisferycznej ciała szarego ma postać:

$$
M=\varepsilon\sigma T^4,
$$

gdzie $\sigma=5{,}670374419·10^{-8}$ W m$^{-2}$ K$^{-4}$. Prawo Wiena:

$$
\lambda_{max}T=b,\qquad b\approx2,8978·10^{-3}\ \mathrm{m\,K}.
$$

Dla 330 K maksimum wynosi około 8,78 µm, czyli w paśmie wielu niechłodzonych kamer LWIR 7,5-14 µm. Detektor nie mierzy jednak temperatury. Mierzy sygnał zależny od radiancji w swoim paśmie, odpowiedzi optycznej i kalibracji, a temperatura jest wynikiem odwrócenia modelu.

Dla nieprzezroczystego szkła w rozważanym paśmie $\tau_s\approx0$, więc z prawa Kirchhoffa $\varepsilon+\rho\approx1$. Radiancję docierającą do kamery można zapisać:

$$
L_{cam}=\tau_{atm}\left[\varepsilon L_b(T_s)+(1-\varepsilon)L_b(T_{refl})\right]
+(1-\tau_{atm})L_b(T_{atm}).
$$

$T_s$ to temperatura powierzchni, $T_{refl}$ odbita temperatura pozorna, $T_{atm}$ temperatura atmosfery, a $\tau_{atm}$ transmisja atmosferyczna. Model jest uproszczony: emisyjność szkła jest spektralna i kierunkowa, a otoczenie nie jest pojedynczym izotermicznym źródłem. Ustawienie $\varepsilon=0{,}95$ bez testu nie usuwa odbicia nieba, słońca, chmur, operatora czy konstrukcji. Przy małym kącie względem powierzchni udział odbity rośnie i piksel obejmuje większy obszar [S2, S6, S14, S15].

## 3.2 Bilans cieplny modułu i znaczenie ΔT

Uproszczony bilans na jednostkę powierzchni:

$$
C_A\frac{dT_m}{dt}=\alpha G_{POA}-\eta_{el}G_{POA}
-h_c(T_m-T_a)-\varepsilon\sigma(T_m^4-T_{sur}^4)-q_{cond},
$$

gdzie $C_A$ [J m$^{-2}$ K$^{-1}$] jest pojemnością cieplną powierzchniową, $\alpha$ absorptancją, $\eta_{el}$ sprawnością w danym punkcie pracy, $h_c$ [W m$^{-2}$ K$^{-1}$] współczynnikiem konwekcji, a $q_{cond}$ [W m$^{-2}$] przewodzeniem do ramy i konstrukcji. Lokalny defekt może zwiększyć generację ciepła przez $I^2R$, rekombinację, polaryzację wsteczną lub utratę ekstrakcji energii elektrycznej. Ten sam ΔT może więc mieć różne przyczyny i różny wpływ elektryczny [S6, S14, S15].

Stała czasowa przy liniaryzacji jest w przybliżeniu:

$$
\tau_T\approx\frac{C_A}{h_c+4\varepsilon\sigma T_m^3+h_{cond}}.
$$

Nagły cień lub podmuch może zmienić obraz przez kilka minut. IEA PVPS podaje typowy czas stabilizacji modułu po zmianie warunków rzędu 5-15 min jako rekomendację praktyczną, nie uniwersalne wymaganie każdej farmy. Stabilność należy ocenić z szeregu POA, wiatru i powtarzanych klatek.

Lokalną anomalię definiuje się względem właściwej referencji:

$$
\Delta T_i=T_i-\operatorname{median}(T_{peer}),
$$

gdzie peer set ma ten sam typ modułu, orientację, stół, pozycję termiczną i punkt pracy. Porównanie z dowolnym modułem na farmie jest niewiarygodne. Prosta normalizacja:

$$
\Delta T_{G,ref}=\Delta T_{meas}\frac{G_{ref}}{G_{meas}}
$$

jest wyłącznie modelem [A] opartym na lokalnej liniowości. Nie obowiązuje automatycznie przy zmianie wiatru, aktywacji bypass, nieliniowym heating, innej temperaturze tła ani clippingu. Lepsze jest dopasowanie lokalnego modelu $\Delta T=f(G_{POA},v_w,T_a,\theta,status)$ i raportowanie residuum oraz zakresu kalibracji.

Nie istnieje uniwersalny próg ΔT rozstrzygający o wymianie modułu. Praktyczne progi 5, 10 czy 20 K spotykane w literaturze i kontraktach są empiryczne, zależne od metody i nie są automatycznie kryteriami pass/fail IEC TS 62446-3. Krytyczność uwzględnia temperaturę absolutną materiału, tempo zmiany, topologię, ryzyko pożarowe, potwierdzenie elektryczne i wartość energii.

## 3.3 Parametry kamery

**NETD** [K lub mK] określa różnicę temperatur dającą sygnał równy szumowi w zdefiniowanych warunkach. Nie jest dokładnością temperatury. **IFOV** [rad/pixel] jest kątem pojedynczego detektora w przybliżeniu geometrycznym; realny rozmiar obiektu wymagany do wiarygodnego pomiaru jest większy z powodu PSF, MTF, resamplingu i mieszania pikseli. **Accuracy** typu ±2 K lub ±2% dotyczy warunków producenta, nie każdego lotu.

Pole widzenia dla osi o liczbie pikseli $N$ daje przy wysokości prostopadłej $H$:

$$
W=2H\tan\left(\frac{FOV}{2}\right),\qquad
GSD=\frac{W}{N}\approx H\,IFOV.
$$

Przy obserwacji ukośnej GSD nie jest stałe w klatce. Trzeba uwzględnić slant range, perspektywę i lokalną normalną modułu. Minimalna liczba pikseli na szerokość ogniwa $N_c=w_c/GSD$ jest kryterium detekcji projektowym. Rekomendacja IEA PVPS O&M 2022 przywołuje co najmniej 5×5 pikseli na ogniwo oraz kamerę co najmniej 320×240 i czułość 0,1 K, lecz nie należy przedstawiać tych wartości jako publicznie zweryfikowanego uniwersalnego pass/fail normy IEC.

Rozmycie ruchu wzdłuż toru:

$$
b_{px}=\frac{v_g t_{int}}{GSD},
$$

gdzie $v_g$ [m s$^{-1}$] jest prędkością względem gruntu, a $t_{int}$ [s] efektywnym czasem integracji/ekspozycji. Jeśli kamera nie ujawnia lub nie pozwala kontrolować $t_{int}$, prędkość należy potwierdzić próbą ostrości na obiekcie i traktować jako parametr walidowany terenowo. Stabilizacja gimbala ogranicza rotację, lecz nie usuwa translacji ani rolling-shutter/synchronization artifacts.

Przy długości footprintu $L$ i overlap wzdłużnym $o_L$ maksymalny krok wyzwalania:

$$
s_{trigger}\le L(1-o_L),\qquad
\Delta t_{trigger}\le\frac{s_{trigger}}{v_g}.
$$

Overlap nie jest celem samym w sobie. Ma zapewnić brak luk, redundancję, geolokalizację i ewentualną rekonstrukcję. Dla pojedynczych radiometrycznych kadrów można projektować mniejszą nadmiarowość niż dla ortomozajki, ale każdy moduł powinien mieć co najmniej jeden kadr spełniający kryteria geometrii i ostrości.

**Kalibracja radiometryczna** wiąże sygnał z radiancją/temperaturą w określonym zakresie. **FFC/NUC** koryguje niejednorodność detektora przy użyciu wewnętrznego shuttera lub innej referencji; może przerwać rejestrację i zmienić offset. Log misji musi zapisać automatyczne lub manualne FFC, czas stabilizacji kamery, zakres temperatur, stan obiektywu i wyniki kontroli przed/po locie.

Format radiometryczny musi zachować surowe lub odwracalne dane per pixel i metadane kalibracyjne. Kolorowy JPEG/screenshot palety nie jest radiometrycznym źródłem. R-JPEG bywa kontenerem producenta z danymi pomiarowymi, ale eksport temperatur do zwykłego JPEG może je utracić. Należy zachować plik natywny, hash, wersję oprogramowania i niezmodyfikowany EXIF/XMP.

## 3.4 Geometria obserwacji i odbicia

Kąt kamery opisuje się względem normalnej modułu, nie względem pionu świata. Lot nad trackerem wymaga znajomości chwilowego kąta stołu i możliwej zmiany w trakcie misji. Cel to kompromis: możliwie blisko normalnej dla stabilnej projekcji i wysokiej emisyjności kierunkowej, ale poza geometrią odbicia słońca oraz własnego BSP. Nie ma jednego kąta właściwego dla wszystkich modułów, godzin i szerokości geograficznych.

Warunek odbicia zwierciadlanego wynika z równości kąta padania i odbicia. Słońce, zimne niebo i chmury tworzą odpowiednio gorące lub zimne artefakty poruszające się po module przy zmianie pozycji kamery. Test rozstrzygający jest geometryczny: powtórz kadr z innym azymutem/elewacją. Rzeczywista anomalia przytwierdzona do ogniwa pozostaje w układzie modułu; odbicie przemieszcza się lub zmienia silnie.

Atmosfera ma większe znaczenie wraz ze slant range, wilgotnością i gradientem temperatury. Dla krótkiego lotu nad farmą korekcja bywa mniejsza niż błąd emisyjności i mixed pixel, lecz trzeba ją udokumentować. Dystans w ustawieniach kamery jest odległością do modułu, nie wysokością AGL.

## 3.5 POA, wiatr i stabilność

IEC TS 62446-3 publicznie potwierdza, że obejmuje wymagania dotyczące warunków otoczenia, lecz szczegółowe klauzule są płatne. IEA PVPS O&M 2022 rekomenduje $G_{POA}\ge600$ W m$^{-2}$ i ciągły pomiar na miejscu dla IRT. W tym podręczniku 600 W m$^{-2}$ jest więc [R], nie samodzielnie zweryfikowanym cytatem normatywnym. Wyższe POA zwykle zwiększa kontrast defektu, ale szybka zmienność może obniżyć wiarygodność bardziej niż nieco niższy stabilny poziom.

Nie przyjmuje się uniwersalnego maksymalnego wiatru diagnostycznego. Ograniczenie lotnicze wynika z BSP i prawa, a ograniczenie termiczne z wymaganej powtarzalności. Wiatr zwiększa $h_c$, tłumi ΔT i tworzy przestrzenną niejednorodność. Log powinien zawierać średnią, porywy, kierunek i lokalizację anemometru oraz obserwację zmian w czasie. Kryterium akceptacji [A] należy wyznaczyć testem powtórzeń dla aparatury i farmy.

Minimum danych środowiskowych to: $G_{POA}$ w płaszczyźnie badanego stołu, temperatura powietrza, wiatr, zachmurzenie/zmienność irradiance, czas i geometria słońca. Czujnik POA powinien mieć porównywalną odpowiedź kątową i widmową albo korekcję. Dla bifacial/tracker konieczny może być dodatkowy pomiar rear irradiance i pozycja trackerów.

## 3.6 Pojedyncze kadry, ortomozajka i RTK/PPK

Pojedynczy natywny kadr zachowuje najlepszą ścieżkę radiometryczną i jest podstawą pomiaru temperatury. Ortomozajka ułatwia pokrycie, indeksację i komunikację, ale blending, resampling, korekcja perspektywy i wybór seamlines mogą zmienić maksimum i rozmyć małe hotspoty. Dlatego temperatura raportowana powinna odwoływać się do źródłowego kadru i pixel footprintu, nie tylko do mozaiki.

RTK/PPK poprawia trajektorię/kamerowe centrum, lecz nie gwarantuje położenia defektu na module. Błąd końcowy składa się z GNSS, boresight kamery, czasu synchronizacji, modelu terenu, attitude, rolling shutter, geometrii stołu i segmentacji. Najpewniejszy identyfikator to hierarchia assetów wsparta mapą: blok-rząd-stół-pozycja-modułu-string-MPPT oraz ground control/check points. Raportuje się błąd check points i odsetek ręcznie zweryfikowanych przypisań.

## 3.7 Diagnostyka różnicowa: wzorce anomalii i hipotezy

| Skala/pattern IR | Pierwsze hipotezy | Typowe false positives | Potwierdzenie |
|---|---|---|---|
| fragment ogniwa gorętszy | shunt, pęknięcie izolujące fragment, lokalny cień | mixed pixel, odbicie, zabrudzenie | EL/PL, RGB close-up, I-V modułu |
| całe ogniwo gorętsze | mismatch prądowy, interconnect, zacienienie | ptasie odchody, hotspot odbiciowy | czyszczenie i re-test, EL, I-V |
| 1/3 lub 1/2 modułu odmienna | aktywna/uszkodzona bypass, substring mismatch | cień rzędu, moiré/resampling | I-V ze schodkiem, test diody po bezpiecznej izolacji |
| cały moduł cieplejszy | open circuit, brak ekstrakcji mocy, silny mismatch | inny typ szkła/emisyjność, pozycja brzegowa | prąd stringu, continuity, peer set tego samego BOM |
| regularny gradient od krawędzi | PID, wilgoć, warunki brzegowe | konwekcja krawędziowa, odbicie nieba | pozycja potencjału, EL low-current, izolacja |
| cały string/segment odmienny | open fuse/cable, MPPT state, mapping error | inna orientacja, chmura, cień | SCADA DC, combiner currents, SLD |
| junction box hotspot | bypass diode, rezystancyjne połączenie | ogrzewanie od modułu, emisyjność obudowy | termika z drugiej geometrii, prąd, test elektryczny |
| connector/combiner punktowy | luźny/zdegradowany styk, bezpiecznik | odbicie metalowej powierzchni | obraz z właściwą emisyjnością, four-wire/torque tylko wg procedury |

Otwarta dioda bypass może ujawnić się dopiero przy wymuszonym mismatch, a zwarta dioda może trwale wyłączyć substring. Wzorzec temperatury zależy od punktu pracy i kierunku przepływu ciepła. Nie wolno przypisywać stanu diody wyłącznie na podstawie koloru jednej trzeciej modułu.

## 3.8 RGB, IR i AI

RGB dostarcza kontekstu: zabrudzenie, cień, rozbite szkło, delaminacja, roślinność, pozycja modułu i przeszkody. Rejestracja powinna być czasowo i geometrycznie zbliżona do IR, ale sensor fusion musi uwzględniać parallax, inne FOV, rolling shutter i opóźnienie. Kolorowy overlay nie jest dowodem kalibracji.

Pipeline automatyczny ma etapy: walidacja pliku radiometrycznego, detekcja stołów/modułów, rejestracja RGB-IR, wyznaczenie peer set, ekstrakcja cech, detekcja anomalii, klasyfikacja hipotezy, geolokalizacja, human QA i powiązanie z SCADA. Każdy etap zapisuje confidence i reason code.

Walidacja AI musi być wykonana na poziomie farmy lub misji, nie losowych klatek. Klatki są silnie skorelowane, więc random split powoduje leakage. Raportuje się co najmniej precision, recall, F$_1$, false positives na MWp/1000 modułów, false negatives w klasach safety-critical, kalibrację prawdopodobieństwa i wyniki per technologia/warunki. Test zewnętrzny powinien obejmować inne moduły, farmy, pory dnia i sensory. Model nie może automatycznie zamknąć alarmu izolacji lub BoS.

## 3.9 SOP misji radiometrycznej

### A. Plan i bezpieczeństwo

1. Ustal cel: screening kompletności, lokalizacja defektu, trend lub odbiór. Zdefiniuj measurand i kryterium sukcesu.
2. Pobierz plan farmy, SLD, asset register, no-fly/airspace, wysokości, przewody, stacje, trackers i plan ruchu O&M.
3. Wykonaj ocenę ryzyka lotniczego i zakładowego, procedurę zgubienia łącza, baterii, intruza, pożaru i nagłej zmiany pogody.
4. Zdefiniuj strefę startu/lądowania, observerów, łączność z dyspozytorem i przerwanie przy pracy ekip lub ruchu trackerów.
5. Sprawdź legalność operacji, uprawnienia, masę/payload, geofence, NOTAM/strefy i ubezpieczenie zgodnie z aktualnym prawem.

### B. Aparatura i nastawy

6. Zapisz producenta, model, serial, obiektyw, rozdzielczość, pasmo, IFOV/FOV, NETD, zakres, datę kalibracji i wersję firmware.
7. Zachowaj natywny format radiometryczny. Ustaw zakres temperatur bez nasycenia, odpowiedni focus, emissivity [A po walidacji], reflected apparent temperature, atmosferę, dystans i paletę jedynie do podglądu.
8. POA mierz w płaszczyźnie modułu czujnikiem ze znaną klasą/kalibracją; zsynchronizuj czas kamery, BSP, SCADA i stacji meteo.
9. Przed lotem wykonaj warm-up według producenta, FFC/NUC i kontrolę stabilnego celu referencyjnego. Po locie powtórz kontrolę driftu.

### C. Projekt geometrii

10. Oblicz GSD z FOV/IFOV i slant range. Ustal minimalne piksele/ogniwo jako [R/A] adekwatne do celu, a nie z wysokości zwyczajowej.
11. Oblicz maksymalną prędkość z dopuszczalnego blur i efektywnego czasu integracji. Jeżeli $t_{int}$ jest nieznane, wykonaj serię testową przy kilku prędkościach.
12. Ustal overlap i trigger interval z footprintu. Dodaj margin na GNSS, wiatr i zmianę attitude.
13. Zaplanuj kąt względem normalnej modułu i pozycję słońca tak, by ograniczyć glint. Dla trackerów zamroź lub loguj pozycję stołów.
14. Zaplanuj linie poprzeczne/ground checks do oceny systematycznego biasu i kompletności.

### D. Warunki i wykonanie

15. Rozpocznij tylko po osiągnięciu zatwierdzonego POA i stabilności. W podręczniku 600 W m$^{-2}$ jest rekomendacją IEA PVPS [R], nie własnym progiem IEC.
16. Rejestruj POA, wiatr, $T_a$, chmury i status inwerterów przez całą misję. Zapisuj każde przejście chmury, FFC i przerwę.
17. Utrzymuj zaprojektowaną wysokość nad płaszczyzną modułów, prędkość, gimbal i kierunek. Nie zwiększaj prędkości kosztem blur.
18. Wykonaj live QA pierwszych dwóch pasów: ostrość, nasycenie, glint, pokrycie, 5×5 lub inne kryterium pikselowe, identyfikowalność.
19. Powtórz próbkę z drugiego azymutu dla odróżnienia odbić. Przy zmianie POA/wiatru ponad zatwierdzoną stabilność przerwij segment i oznacz go.

### E. QA i analiza

20. Skopiuj pliki bit-to-bit, oblicz hash, zachowaj oryginały read-only i oddziel derived products.
21. Odrzuć lub oznacz klatki: non-radiometric, out of focus, saturated, glint, insufficient pixels, unstable POA, excessive blur, missing metadata.
22. Oblicz coverage po asset ID, nie po powierzchni polygonu. Każdy moduł ma status `valid`, `invalid`, `not_seen`, `obscured` lub `not_mapped`.
23. Segmentuj moduły i wyznacz peer groups. Temperaturę/ΔT wyciągaj z natywnej klatki z maską z dala od ramy i mixed pixels.
24. Połącz z RGB, SCADA i topologią. Zapisz alternatywne hipotezy oraz test potwierdzający.
25. Manualnie sprawdź wszystkie alarmy safety-critical i próbę negatywną. Dla masowej klasyfikacji stosuj próbę statystyczną z jawnym confidence.
26. Raportuj warunki, coverage, odrzuty, niepewność, obrazy źródłowe, lokalizację, confidence i zalecenie. Nie raportuj straty mocy z samego ΔT.

## 3.10 Budżet niepewności termografii

Przykładowe składniki: kalibracja kamery, repeatability, non-uniformity po FFC, focus/PSF, mixed pixel, emissivity, reflected temperature, atmosfera/dystans, kąt, drift, segmentacja ROI, POA i wiatr, synchronizacja, peer-set variability. Dla temperatury absolutnej wpływ $\varepsilon$ i $T_{refl}$ może dominować. Dla ΔT w jednej klatce część błędów kalibracji jest wspólna, lecz ROI i różna geometria pozostają.

Wynik może mieć format: `$\Delta T=7,4 K, U=2,6 K, k=2`, warunki: `$G_{POA}=735±18 W m^{-2}$`, wiatr `2,1±0,6 m s^{-1}`, kąt do normalnej `18±3°`, klatka/hash`. Jeśli budżet nie wspiera rozróżnienia, wynik jest `thermal contrast observed`, nie `hotspot confirmed`.

## 3.11 Studium przypadku lotu [A, dane syntetyczne]

Kamera ma 640 px w osi poziomej i HFOV 45°. Szerokość ogniwa wynosi 182 mm. Dla $H=20$ m nad płaszczyzną modułów:

$$
W=2·20·\tan(22,5^\circ)=16,57\ \mathrm m,
$$

$$
GSD=16,57/640=0,0259\ \mathrm{m/pixel},\qquad
N_c=0,182/0,0259=7,03\ \mathrm{pixel}.
$$

Dla minimum 5 px szerokości ogniwa maksymalna wysokość w geometrii prostopadłej:

$$
H_{max}=\frac{Nw_c}{2\tan(FOV/2)N_{c,min}}
=\frac{640·0,182}{2\tan(22,5^\circ)·5}=28,1\ \mathrm m.
$$

Jeśli efektywny czas integracji wynosi 1/60 s, prędkość 3 m/s daje:

$$b_{px}=3·(1/60)/0,0259=1,93\ \mathrm{px}.$$

To może zniszczyć detale ogniwa. Dla limitu [A] $b_{px}\le0,5$ prędkość wynosi maksymalnie 0,78 m/s. Jeżeli VFOV=37° i 512 px, footprint wzdłużny przy 20 m wynosi 13,38 m. Dla overlap 70% krok to 4,01 m; przy 0,78 m/s odstęp zdjęć może wynieść najwyżej 5,14 s. W praktyce częstsze wyzwalanie zwiększa rezerwę na attitude i wiatr.

W segmencie 12 000 modułów pokrycie źródłowymi klatkami wyniosło 99,1%, lecz 4,8% klatek odrzucono za glint. Po re-flight ważne pokrycie wyniosło 99,8%; 24 moduły pozostały obscured. Algorytm zgłosił 138 anomalii, human QA odrzuciło 41 refleksów i 12 błędów segmentacji. Z 85 obserwacji 17 wytypowano do ground truth. I-V potwierdziło istotne odchylenie 9 modułów, EL mechanizm pęknięcia w 4, a testy diod 2 przypadki. Wniosek nie brzmi „85 wadliwych modułów”, lecz „85 ważnych obserwacji, 17 zbadanych, 11 potwierdzonych elektrycznie, 6 nierozstrzygniętych w próbie”.

### Zadania z rozwiązaniami

**Zadanie 1.** Oblicz $\lambda_{max}$ dla 60°C. **Rozwiązanie:** $T=333,15$ K, więc $\lambda_{max}=2,8978·10^{-3}/333,15=8,70$ µm.

**Zadanie 2.** IFOV wynosi 1,3 mrad, slant range 25 m. Jaki nominalny pixel footprint? **Rozwiązanie:** $25·0,0013=0,0325$ m, czyli 32,5 mm/pixel. To nie jest minimalny mierzalny obiekt.

**Zadanie 3.** Model AI znalazł 90 z 100 prawdziwych anomalii i zgłosił 120 obiektów. **Rozwiązanie:** recall=0,90, precision=90/120=0,75, $F_1=2·0,75·0,90/(0,75+0,90)=0,818$. Bez rozkładu klas krytycznych wynik jest niewystarczający.

**Zadanie 4.** Anomalia ma $\Delta T=4,0$ K i $U=3,0$ K, $k=2$. Czy różnica jest rozstrzygająca? **Rozwiązanie:** obserwacja ma dodatni kontrast, ale przedział około 1-7 K nakłada się na małe efekty. Nie wolno nadać przyczyny ani straty bez powtórzenia/testu.

### Checklista modułu 3

- [ ] Cel, measurand i kryteria odrzutu są zapisane przed lotem.
- [ ] Pliki źródłowe są radiometryczne, zahashowane i nieedytowane.
- [ ] POA, wiatr, temperatura, chmury, czas i status inwerterów są zsynchronizowane.
- [ ] GSD i piksele/ogniwo wynikają z FOV/IFOV oraz geometrii.
- [ ] Prędkość jest sprawdzona względem blur, nie tylko limitu BSP.
- [ ] Kąt jest liczony względem modułu, a glint sprawdzony z drugiej geometrii.
- [ ] FFC, warm-up, focus, emissivity, $T_{refl}$, dystans i atmosfera są udokumentowane.
- [ ] Coverage jest liczony po asset ID, a odrzuty nie są ukryte.
- [ ] Temperatura pochodzi z natywnego kadru, nie blended ortomosaic.
- [ ] AI ma external/plant-level validation i human QA.
- [ ] Każda obserwacja ma hipotezy alternatywne i test naziemny.
- [ ] Raport nie wyznacza pewnej przyczyny ani straty mocy z samego termogramu.

# Moduł 4. Diagnostyka naziemna i potwierdzanie anomalii IR

## 4.1 Pomiar I-V i korekcja warunków

Krzywa I-V dostarcza więcej informacji niż pojedyncze $V_{oc}$, $I_{sc}$ lub $P_{mpp}$. IEC 61829 opisuje pomiar charakterystyki I-V krystalicznych pól PV w warunkach on-site; przenoszenie wyników między temperaturą/irradiance odwołuje się także do procedur IEC 60891. Audytor musi znać edycję i metodę zastosowaną przez firmware tracera, ponieważ różne algorytmy korekcji nie są równoważne [S4, S5, S31].

W prostym przybliżeniu prąd fotogenerowany skaluje się z irradiance:

$$
I_{ph}(G,T)\approx I_{ph,ref}\frac{G}{G_{ref}}[1+\alpha_I(T-T_{ref})],
$$

natomiast napięcie zmienia się logarytmicznie z $G$ i maleje z temperaturą. Proste przemnożenie całej krzywej przez $G_{ref}/G$ nie koryguje napięcia, $R_s$, $R_{sh}$ ani aktywacji bypass. Do raportowania STC należy użyć współczynników konkretnego typu modułu, mierzonej temperatury i jawnej procedury IEC 60891 lub dopasowanego modelu diodowego.

Wskaźniki kształtu:

$$
FF=\frac{V_{mpp}I_{mpp}}{V_{oc}I_{sc}},\qquad
R_{sh,app}\approx-\left(\frac{dV}{dI}\right)_{V\approx0},\qquad
R_{s,app}\approx-\left(\frac{dV}{dI}\right)_{V\approx V_{oc}}.
$$

Są to przybliżenia lokalne. Szum, liczba punktów, pojemność modułu, szybkość sweep, zmiana $G$ i orientacja sweep wpływają na pochodne. Dla nowoczesnych modułów wysokoprądowych tracer musi mieć właściwy zakres prądu, napięcia, mocy i kategorię bezpieczeństwa, z marginesem na zimny $V_{oc}$ oraz równoległe stringi.

### Procedura I-V krok po kroku

1. **Autoryzacja:** zatwierdź switching plan, JSA i LOTO. Nie rozłączaj złącza DC pod obciążeniem.
2. **Zakres aparatury:** sprawdź maksymalne $V_{oc,cold}$, $I_{sc}$ z tolerancją i możliwy prąd równoległy. Potwierdź kategorię, przewody, bezpieczniki i stan tracera.
3. **Referencja:** zidentyfikuj dokładny moduł/string, BOM, orientację, MPPT i moduł referencyjny.
4. **Warunki:** zamocuj skalibrowany sensor $G_{POA}$ współpłaszczyznowo bez cienia; czujnik temperatury zapewnij na tylnej powierzchni reprezentatywnego modułu lub zastosuj zatwierdzony model.
5. **Stabilność:** rejestruj $G$ i $T$ w trakcie sweep. Odrzuć serię przy zmianie warunków przekraczającej kryterium procedury/aparatury.
6. **Izolacja:** wykonaj bezpieczne wyłączenie i potwierdzenie stanu zgodnie z instrukcją farmy; sprawdź polaryzację przed podłączeniem.
7. **Nastawy:** wybierz zakres automatyczny/manualny, liczbę punktów i czas sweep zgodnie z pojemnością modułu oraz dynamiką irradiance. Zapisz firmware i metodę korekcji.
8. **Sweep:** wykonaj co najmniej trzy powtórzenia oraz blank/control na zdrowym peer. Obserwuj histerezę kierunku sweep, compliance i clipping przyrządu.
9. **QA:** sprawdź $V_{oc}$, $I_{sc}$, monotoniczność, schodki, residua, spójność powtórzeń i synchronizację $G/T$.
10. **Korekcja:** zachowaj surową krzywą i dopiero w kopii zastosuj wybraną metodę do STC; propaguj niepewność $G$, $T$, I, V i współczynników.
11. **Przywrócenie:** odłącz tracer bezpiecznie, odtwórz połączenia z właściwymi kompatybilnymi złączami, wykonaj kontrolę i formalne zdjęcie LOTO.
12. **Wniosek:** raportuj cechę elektryczną i hipotezy, nie tylko automatyczną etykietę urządzenia.

## 4.2 Interpretacja I-V

| Cecha | Najczęstsze wyjaśnienia | Pułapki |
|---|---|---|
| $I_{sc}$ niższy przy podobnym $V_{oc}$ | soiling, cień, utrata transmisji, mismatch prądowy | zły sensor POA, różna odpowiedź widmowa, chmura |
| $V_{oc}$ niższy skokowo | brakujący moduł/substrig, zwarta bypass, PID, wysoka $T_c$ | błąd liczby modułów, niedokładny termometr |
| zaokrąglenie przy $V_{oc}$, spadek FF | wyższy $R_s$, korozja, interconnect, złącze | szybkość sweep, limit tracera, pojemność |
| nachylenie przy $I_{sc}$, spadek FF | niższy $R_{sh}$, PID-shunting, uszkodzenie złącza | zmienne $G$, leakage aparatury |
| schodki | bypass, częściowy cień/soiling, mieszane moduły | przejście chmury podczas sweep, algorytm filtracji |
| pozornie dobra krzywa, niski yield | dostępność, clipping, curtailment, AC/transformer | test wykonany tylko w jednym dobrym momencie |

## 4.3 Electroluminescence i photoluminescence

Prawo wzajemności łączy odpowiedź fotowoltaiczną i emisję przy polaryzacji w przód. Przy uproszczeniu lokalna intensywność EL rośnie z napięciem złącza:

$$
\Phi_{EL}(x,y)\propto \exp\left(\frac{qV_j(x,y)}{k_BT}\right),
$$

ale obraz zależy też od lifetime, optyki, ekspozycji, widmowej odpowiedzi kamery, prądu wstrzykiwania i spadków rezystancyjnych. Jasność między dwiema sesjami bez kalibracji nie jest bezpośrednio porównywalna [S6, S32, S33].

EL krzemowe emituje głównie w bliskiej podczerwieni około 1,1 µm. Zmodyfikowane kamery Si mogą pracować przy dłuższej ekspozycji, a InGaAs daje większą czułość w NIR/SWIR kosztem ceny i często mniejszej rozdzielczości. Wybór zależy od luminancji, dystansu, prądu, ciemności, optyki, zakresu widmowego i celu: pęknięcia, PID, Rs albo dark areas.

**Procedura EL terenowej:**

1. odłącz i zabezpiecz badaną sekcję, potwierdź wszystkie źródła energii;
2. sprawdź dopuszczalny kierunek, prąd, napięcie i czas zasilania dla modułu/stringu oraz zasilacza;
3. użyj izolowanego, ograniczonego prądowo źródła z monitoringiem i emergency stop;
4. wykonaj sekwencję w ciemności lub z metodą odejmowania tła, kontrolując światło rozproszone;
5. zarejestruj dark frame, flat/reference, prąd, napięcie, temperaturę, ekspozycję, aperture, gain i dystans;
6. wykonaj co najmniej dwa poziomy wstrzykiwania dobrane do celu i aparatury; wartości typu 0,1 $I_{sc}$ i 1,0 $I_{sc}$ są często używanymi poziomami badawczymi [R], nie uniwersalną instrukcją bezpieczeństwa;
7. porównaj z modułem peer i zachowaj obrazy surowe;
8. po zakończeniu rozładuj, odłącz źródło, odtwórz konfigurację i wykonaj kontrolę.

PL używa wzbudzenia optycznego i mierzy emisję rekombinacyjną bez konieczności elektrycznego zasilania w przód. W terenie wymaga kontrolowanego lub modulowanego źródła, filtracji tła słonecznego i kamery o właściwej czułości. Quasi-Fermi level splitting łączy się z luminescencją, ale ilościowa lifetime/voltage mapping wymaga kalibracji i modelu optycznego. PL jest wartościowa dla pasywacji i defektów rekombinacyjnych; operacyjnie trudniejsza na dużej farmie.

## 4.4 Rezystancja izolacji, próby i ciągłość

Rezystancja izolacji jest wrażliwa na długość obwodu, liczbę modułów, wilgoć, temperaturę, pojemność i obecność SPD/elektroniki. Pojedynczy pomiar bez pogody i topologii nie nadaje się do trendu. Wartość z monitora izolacji inwertera nie jest automatycznie równoważna kontrolowanej próbie miernikiem.

**Procedura izolacji:**

1. określ system voltage, topologię uziemienia, instrukcje modułów/inwertera/SPD i właściwą edycję normy;
2. uzyskaj switching plan, odizoluj wszystkie źródła, potwierdź brak napięcia i energii zmagazynowanej;
3. odłącz lub zabezpiecz urządzenia, które mogą zostać uszkodzone napięciem próbnym, dokładnie według instrukcji;
4. skontroluj miernik, przewody, napięcie probiercze i limit energii; nastawę wybierz z obowiązującej normy oraz napięcia obwodu, nie z pamięci;
5. zmierz warunki środowiskowe i, jeśli procedura tego wymaga, wykonaj pomiar `(+ i - połączone) do PE` lub osobne bieguny do PE;
6. poczekaj na stabilizację pojemności, zapisz przebieg, nie tylko wartość końcową;
7. po próbie rozładuj obwód i potwierdź napięcie bezpieczne;
8. segmentuj pole, jeśli wynik jest niski, aby lokalizować bez narażania większej części systemu;
9. porównaj z wymaganiem właściwej normy, długością obwodu, pogodą i baseline;
10. przywróć SPD/urządzenia, sprawdź połączenia i zamknij LOTO.

Nie podaje się w tym podręczniku jednej nastawy testowej jako uniwersalnej. W praktyce spotyka się mierniki 250/500/1000 V DC, ale bez potwierdzenia tabeli obowiązującej edycji IEC 62446-1/IEC 60364-6 oraz instrukcji komponentów są to tylko dostępne zakresy aparatury, nie decyzja testowa.

Ciągłość przewodów ochronnych i połączeń wyrównawczych wymaga miernika niskorezystancyjnego, kompensacji przewodów i zdefiniowanego prądu testowego. Zwykły multimeter może wskazać przejście, ale nie ocenić niezawodności połączenia. Dla połączeń śrubowych wynik łączy oględziny, właściwy typ fastenera, korozję, ślad montażu, instrukcję torque i ewentualny pomiar rezystancji. Nie „dokręca się kontrolnie” bez procedury, bo można zmienić pre-load i dowód.

## 4.5 Diagnostyka różnicowa i potwierdzanie IR

| Obserwacja IR | Test 1 | Test 2 | Kryterium wniosku |
|---|---|---|---|
| hot cell | RGB/clean-retest | EL + I-V modułu | przyczyna dopiero po zgodności optycznej i elektrycznej |
| ciepły substring | I-V step | test bypass po izolacji | stan diody nie z samego koloru IR |
| ciepły cały moduł | prąd/napięcie stringu | continuity i I-V | odróżnij open circuit od innego BOM |
| patchwork przy ramie | pozycja w stringu i izolacja | low-current EL | PID jako hipoteza do zgodnego zestawu dowodów |
| hot connector | kadr z kontrolą emisyjności | spadek napięcia/rezystancja po izolacji | safety escalation już przy ryzyku łuku |
| brak IR, niski yield | I-V i SCADA | EL/PL | IR false negative możliwy dla pęknięcia/PID early-stage |

## 4.6 Studium przypadku [A, dane syntetyczne]

String 28 modułów 550 Wp ma referencyjnie 15,40 kWp. Tracer przy $G=812$ W m$^{-2}$ i $T_c=42$°C rejestruje $P_{mpp}=11,10$ kW. Model referencyjny tego samego stringu w tych warunkach, z parametrami producenta i bez soiling, daje 11,85 kW. Residuum:

$$
\delta_P=\frac{11,10-11,85}{11,85}=-6,33\%.
$$

Niepewność względna standardowa modelu to 1,8%, a pomiaru 1,0%. Przy niezależności $u_c=\sqrt{1,8^2+1,0^2}=2,06\%$, więc $U(k=2)=4,12\%$. Ubytek 6,33% przekracza rozszerzoną niepewność, lecz przyczyna pozostaje otwarta.

IR wskazuje jeden cieplejszy substring, I-V ma schodek około napięcia jednego substringu, a EL pokazuje odizolowany fragment dwóch ogniw. Po czyszczeniu ΔT spada tylko o 0,4 K. Wniosek: istotne odchylenie elektryczne stringu potwierdzone I-V; lokalizacja substringu zgodna z IR i EL; prawdopodobne pęknięcie/interconnect, ale ostateczne rozstrzygnięcie materiałowe wymaga badania modułu. Roczną stratę należy policzyć z zachowania całego MPPT, nie z 6,33% × energia farmy.

### Zadania z rozwiązaniami

**Zadanie 1.** Krzywa ma $V_{oc}=1320$ V i $I_{sc}=12,8$ A, a tracer ma zakres 1000 V. **Rozwiązanie:** pomiar jest zabroniony tą konfiguracją; zakres przyrządu jest przekroczony przed uwzględnieniem zimnego $V_{oc}$.

**Zadanie 2.** Trzy powtórzenia $P_{mpp}$ to 10,22, 10,25 i 10,21 kW. Średnia? **Rozwiązanie:** 10,227 kW. Mały rozrzut nie usuwa biasu irradiance, temperatury ani korekcji.

**Zadanie 3.** EL jest ciemne w całym module. **Rozwiązanie:** przed uznaniem awarii sprawdź prąd wzbudzenia, polaryzację, ekspozycję, filtr, focus, połączenie i działanie kamery na referencji.

### Checklista modułu 4

- [ ] Tracer obejmuje zimny $V_{oc}$ i maksymalny $I_{sc}$ z marginesem.
- [ ] Surowe I-V, $G_{POA}$ i $T_c$ są zachowane i zsynchronizowane.
- [ ] Metoda korekcji STC i współczynniki są jawne.
- [ ] Każda krzywa ma powtórzenie i peer reference.
- [ ] EL/PL ma dark/flat/reference oraz pełne parametry wzbudzenia i obrazu.
- [ ] Zasilanie wsteczne jest objęte osobnym JSA, LOTO i emergency stop.
- [ ] Napięcie próby izolacji wynika z normy i instrukcji, nie z wartości zwyczajowej.
- [ ] Po próbie obwód jest rozładowany, odtworzony i formalnie przekazany.
- [ ] Wniosek łączy IR, elektrykę, topologię i alternatywy.

# Moduł 5. Technical Due Diligence, konstrukcje i ekonomika

## 5.1 TDD jako badanie spójności dowodów

Technical Due Diligence nie jest checklistą kompletności folderu. Ma ustalić, czy aktywo może bezpiecznie i przewidywalnie realizować model energii oraz zobowiązania kontraktowe. Każdy finding powinien zawierać: stan, dowód, wymaganie odniesienia, mechanizm ryzyka, ekspozycję, niepewność, możliwość naprawy, właściciela i termin.

### Data room minimum

| Obszar | Dokumenty/dane | Test spójności |
|---|---|---|
| tytuł i pozwolenia | prawa do gruntu, decyzje, pozwolenia, grid connection | zakres i warunki zgodne z as-built |
| projekt | design basis, SLD, layout, cable/earthing, protection studies | wersja IFC vs as-built i nastawy rzeczywiste |
| komponenty | datasheets, certyfikaty, seriale, flash lists, BOM | serial-to-location i certyfikat dla dokładnego wariantu |
| wykonanie | ITP, NCR, FAT/SAT, commissioning, pile tests, torque logs | zamknięcie NCR i traceability |
| wydajność | model yield, meteo, SCADA, liczniki, PR/availability | granice i założenia zgodne z umowami |
| O&M | kontrakt, SLA, preventive/corrective logs, spares | realne czasy reakcji i powtarzalne awarie |
| gwarancje | product/performance, inverter, structure, transformer | notice, exclusions, transfer i dowód terminów |
| HSE | risk assessments, switching/LOTO, incidents, fire plan | praktyka i szkolenia zgodne z dokumentem |

Bankability jest oceną kombinacji technologii, producenta, kontroli jakości, historii terenowej, gwarancji, kontraktów i zdolności serwisowej. Certyfikat kwalifikacji typu nie przewiduje sam 25-30 lat działania konkretnego BOM w konkretnej lokalizacji. Dla nowych TOPCon/HJT/tandemów należy jawnie zwiększyć wagę BOM-specific testing, audit fabryki, witness testing, retencji próbek i monitoringu early-life [S8-S11, S19].

## 5.2 Gwarancje i roszczenia

Performance warranty bywa krzywą maksymalnej dopuszczalnej degradacji mocy modułu, ale roszczenie zależy od procedury pomiaru, próbkowania, niepewności, demontażu, kosztu transportu i wyłączeń. Termogram nie jest sam dowodem niespełnienia gwarancji mocy.

Łańcuch roszczenia:

1. zachowaj kontrakt, datasheet z daty zakupu, dokładny serial/BOM i warunki gwarancji;
2. wykonaj notice w terminie i formie umownej bez przyznawania nieustalonej przyczyny;
3. zabezpiecz oryginały SCADA, obrazy, I-V, EL, logi pogody, próbki i chain of custody;
4. uzgodnij protokół pomiaru oraz laboratorium przed destrukcyjnym badaniem;
5. dobierz próbę statystyczną do populacji/partii i oczekiwanej wariancji;
6. w modelu ekonomicznym oddziel gross technical loss, recoverable amount, deductible, downtime i koszt dochodzenia;
7. nie naprawiaj w sposób niszczący dowód bez oceny bezpieczeństwa i uzgodnienia z ubezpieczycielem/producentem.

## 5.3 Konstrukcje, pale, korozja i śruby

TDD konstrukcji rozpoczyna się od design basis: wiatr, śnieg, geotechnika, agresywność gruntu, powódź, tolerancje, tracker loads i kombinacje stanów. Oględziny BSP dobrze wykrywają geometrię, brak modułów, deformacje, erozję i roślinność, ale nie mierzą nośności pala ani pre-load śruby.

**Badania pali** mogą obejmować próbę wyciągania, wciskania i obciążenia bocznego. Program próby musi wynikać z projektu geotechnicznego, stref gruntu, typu pala, głębokości, instalacji i norm projektowych. Wynik force-displacement interpretuje kompetentny geotechnik/konstruktor. Jedna udana próba przy drodze nie reprezentuje mokrej strefy, nasypu lub innej partii pali.

**Korozja** wymaga rozdzielenia czerwonej korozji kosmetycznej od utraty przekroju, korozji szczelinowej, galwanicznej, powłoki cynkowej i agresywności gruntu. Szybkość utraty nie wynika z jednego zdjęcia. Przyrządy mogą obejmować miernik grubości powłoki, ultradźwiękowy pomiar grubości, profil chropowatości i badanie potencjału, dobrane do materiału oraz kalibracji.

**Połączenia śrubowe** przenoszą siłę przez pre-load i tarcie lub przez docisk trzpienia, zależnie od projektu. Relacja momentu $M$ i siły wstępnej $F_p$ w przybliżeniu:

$$
M=K d F_p,
$$

gdzie $d$ [m] jest średnicą nominalną, a $K$ zależy silnie od tarcia, powłoki, smaru i procesu. Ten wzór nie służy do odtwarzania pre-load z przypadkowego breakaway torque. Audyt sprawdza specyfikację fastenera, klasę, washer, powłokę, kalibrację narzędzia, sekwencję, witness marks i próbę według zatwierdzonego ITP. Dokręcenie losowej próbki może zniszczyć informację o stanie.

### Procedura konstrukcyjna

1. przegląd obliczeń, geotechniki, as-built i ITP;
2. stratified sampling według stref gruntu, ekip, dat i typów konstrukcji;
3. BSP/RGB do mapy globalnej geometrii, erozji, zastoin i deformacji;
4. oględziny naziemne pali, powłok, fastenerów, clampów, kabli i tracker drive;
5. pomiary geometrii i materiałów skalibrowaną aparaturą;
6. testy pali/śrub tylko według planu konstruktora i z kryterium akceptacji;
7. mapowanie findingów do partii oraz mechanizmu wspólnej przyczyny;
8. ocena immediate safety, serviceability, durability i naprawialności;
9. zabezpieczenie dowodów i instrukcja monitoringu;
10. podpis konstruktora/geotechnika tam, gdzie wymagany.

## 5.4 Energia, pieniądz i NPV

Energię utraconą wyznacza się przez kontrfaktyczny model działającego aktywa:

$$
E_{loss}=\sum_t\max[0,P_{cf}(t)-P_{actual}(t)]\Delta t.
$$

$P_{cf}$ może pochodzić z peer inverterów, modelu physics-based lub regresji sprzed awarii. Okresy curtailment i clipping wymagają osobnego traktowania, bo usunięcie defektu nie zawsze zwiększy eksport. Niepewność obejmuje model, dane meteo, missing data i baseline.

Wartość straty:

$$
C_{loss}=E_{loss}p_{capture}+C_{imbalance}+C_{cert}+C_{penalty}-C_{avoided},
$$

gdzie $p_{capture}$ [PLN/MWh lub EUR/MWh] odpowiada realnemu profilowi i kontraktowi. Nie używa się bez uzasadnienia średniej ceny baseload. Wpływ może obejmować PPA, CfD, gwarancje pochodzenia, imbalance, availability LD i podatki.

NPV naprawy:

$$
NPV=-CAPEX_0+\sum_{t=1}^{N}\frac{\Delta CF_t}{(1+r)^t}+\frac{RV_N}{(1+r)^N},
$$

gdzie $\Delta CF_t$ to uniknięta strata energii i OPEX netto [waluta/rok], $r$ realna lub nominalna stopa zgodna z cash flow, a $RV_N$ wartość rezydualna. Nie miesza się cash flow nominalnych z realnym $r$.

Expected monetary value ryzyka:

$$
EMV=p_f\left(C_{repair}+C_{energy}+C_{safety}+C_{claim}\right),
$$

ale dla safety-critical niska oczekiwana wartość nie zastępuje obowiązku bezpieczeństwa. Macierz ryzyka łączy prawdopodobieństwo, skutek, detectability i czas do eskalacji. Priorytet może mieć postać:

$$
RPN=S\cdot O\cdot D,
$$

lecz ordinalne iloczyny nie są prawdopodobieństwem ani walutą. RPN służy do triage, a decyzja finansowa używa scenariuszy i cash flow.

## 5.5 Procedura decyzji naprawczej

1. potwierdź finding i immediate safety containment;
2. wyznacz populację dotkniętą, topologię i wspólną przyczynę;
3. zinwentaryzuj źródła danych i aparaturę, wersje modeli, kalibracje, ustawienia oraz ograniczenia zakresu;
4. zbuduj kontrfaktyczny yield z przedziałem niepewności;
5. sprawdź, czy odzysk DC przełoży się na eksport po clipping/curtailment;
6. wyceń lost MWh realnym profilem ceny;
7. oszacuj CAPEX, outage, OPEX, spares, logistykę i ryzyko rework;
8. sprawdź gwarancję/ubezpieczenie, terminy notice i recoverability;
9. policz NPV, payback i wrażliwość na energię, cenę, stopę i skuteczność naprawy;
10. porównaj `repair now`, `monitor`, `batch repair`, `claim`, `replace at failure`;
11. wykonaj niezależny QA rachunków, traceability i reprezentatywności próbki;
12. nadaj ownera, deadline, acceptance test i monitoring po naprawie.

## 5.6 Diagnostyka różnicowa TDD

| Finding | Alternatywne wyjaśnienie | Dowód rozstrzygający | Ryzyko błędnej decyzji |
|---|---|---|---|
| niższy yield bloku | moduły, sensor, inverter, transformer, curtailment | loss tree + peer model + testy | niepotrzebna wymiana modułów |
| korozja pali | powierzchniowa, galwaniczna, gruntowa, utrata przekroju | powłoka/grubość + chemia gruntu + konstruktor | naprawa kosmetyczna lub przeprojektowanie bez potrzeby |
| brak witness mark | brak torque log, utrata pre-load, tylko brak markera | ITP, próbka kontrolna wg inżyniera | uszkodzenie złącza przez retorque |
| wysoka degradacja floty | LID/LeTID, sensor drift, soiling, repowering mix | kohorty + kalibracja + I-V/EL | fałszywe roszczenie gwarancyjne |
| hot connector | rezystancja, emisyjność, obciążenie nierówne | radiometry + electrical test | przeoczenie ryzyka łuku |

## 5.7 Studium przypadku NPV [A, dane syntetyczne]

Farma 80 MWp ma oczekiwany uzysk 84 000 MWh/rok. Potwierdzona, odzyskiwalna strata wynosi 1,2%, czyli 1008 MWh/rok. Cena przechwycona to 360 PLN/MWh, zatem strata brutto 362 880 PLN/rok. Naprawa kosztuje 520 000 PLN, przestój i QA 40 000 PLN, a utrzymanie efektu kosztuje 20 000 PLN/rok. Naprawa odzyskuje 90% straty przez 5 lat. Roczny cash flow:

$$
\Delta CF=1008·360·0{,}90-20\,000=306\,592\ \mathrm{PLN/rok}.
$$

Przy $r=8\%$ i braku wartości rezydualnej:

$$
NPV=-560\,000+306\,592\frac{1-(1{,}08)^{-5}}{0{,}08}
=-560\,000+1\,224\,133\approx664\,133\ \mathrm{PLN}.
$$

Prosty payback to 1,83 roku. Decyzja pozostaje warunkowa: jeśli utrata jest maskowana przez clipping w 35% godzin, odzyskiwalna energia i NPV spadną. Trzeba użyć profilu 5/15-minutowego, scenariusza degradacji i prawdopodobieństwa skuteczności naprawy.

### Zadania z rozwiązaniami

**Zadanie 1.** 450 MWh straty przy 72 EUR/MWh i kursie [A] 4,30 PLN/EUR. **Rozwiązanie:** 32 400 EUR = 139 320 PLN. Kurs i data muszą być źródłowe w realnym audycie.

**Zadanie 2.** CAPEX 300 tys. PLN, korzyść 120 tys. PLN/rok przez 3 lata, $r=10\%$. **Rozwiązanie:** PV annuity = $120·[1-(1,1)^{-3}]/0,1=298,42$ tys. PLN; NPV = -1,58 tys. PLN, przed podatkiem i ryzykiem.

**Zadanie 3.** Dlaczego 100 modułów po 550 W i 20% utraty nie oznacza 11 kW ciągłej straty? **Rozwiązanie:** moduły są w stringach/MPPT, moc zależy od $G,T$, bypass, ograniczeń i czasu; należy symulować topologię i integrować $P_{cf}-P_{actual}$.

### Checklista modułu 5

- [ ] Data room jest sprawdzony wersja do wersji i as-built do rzeczywistości.
- [ ] Certyfikacja typu nie jest utożsamiana z trwałością konkretnego BOM.
- [ ] Finding gwarancyjny ma chain of custody i uzgodnioną metodę.
- [ ] Próbkowanie obejmuje partie, strefy gruntu, ekipy i ekspozycję.
- [ ] Pale i śruby ocenia właściwy konstruktor/geotechnik.
- [ ] Strata energii ma kontrfaktyczny baseline i przedział.
- [ ] Clipping/curtailment nie zawyżają odzyskiwalnej energii.
- [ ] Cena energii odpowiada profilowi i kontraktowi.
- [ ] NPV ma spójne cash flow, stopę, horyzont i scenariusze.
- [ ] Safety-critical action nie jest odraczana przez niski EMV.

# Macierz diagnostyczna usterek

Wpływ na moc opisuje kierunek i topologię. Liczba procentowa jest dopuszczalna dopiero po I-V/SCADA/modelu konkretnego aktywa. Krytyczność: **S0** obserwacja, **S1** monitorować, **S2** planowa interwencja, **S3** pilna interwencja, **S4** natychmiastowe zabezpieczenie przez uprawniony personel. Poziom rośnie przy ryzyku łuku, izolacji, pożaru, konstrukcji lub szybkiej propagacji.

| Usterka | Mechanizm | IR | EL/PL | I-V | Potwierdzenie | Wpływ na moc | Krytyczność |
|---|---|---|---|---|---|---|---|
| PID-shunting | pole systemowe, migracja jonów, spadek $R_{sh}$ | patchwork/edge cells, zależne od punktu pracy | EL ciemniejsze, szczególnie low injection | niższy $R_{sh}$, FF i czasem $V_{oc}$ | pozycja potencjału, izolacja, EL, I-V, test PID | od małego do dominującego, silnie nieliniowy przy low light | S2-S3 |
| B-O LID | kompleks bor-tlen w p-type Cz | często brak specyficznego wzorca | spadek luminescencji rozłożony | spadek $P_{mpp}/V_{oc}$ | kontrolowana historia light soaking/regeneration, lifetime | flota/kohorta, early-life | S1-S2 |
| LeTID | defekty aktywowane światłem i temperaturą | często słaby/rozłożony | zmiana lifetime/emisji | stopniowy spadek $P_{mpp}$ i FF | kinetyka degradacja-regeneracja, kohorty, lab | sezonowy i zależny od procesu | S1-S2 |
| mikropęknięcie nieaktywne | pęknięcie bez izolacji obszaru | zwykle niewidoczne | linia pęknięcia | brak lub mała zmiana | EL pod obciążeniem/po cyklu, mechanika | obecnie mały, ryzyko propagacji | S1-S2 |
| pęknięcie izolujące | utrata ciągłości fragmentu ogniwa | hot fragment/cell, ale nie zawsze | ciemny odizolowany obszar | niższy prąd/FF, możliwy step | EL + I-V + oględziny | zależy od udziału izolowanej powierzchni i stringu | S2-S3 |
| snail trails | produkty reakcji srebra/wilgoci przy pęknięciu | niespecyficzne lub brak | może ujawnić pęknięcie | od braku do Rs/utrata prądu | RGB, EL, I-V; ocena pęknięcia osobno | przebarwienie nie jest miarą mocy | S1-S2 |
| korozja metalizacji | wilgoć/kwasy/potencjał, wzrost oporu | lokalne/ścieżkowe heating | niejednorodna emisja, Rs pattern | wzrost $R_s$, spadek FF | oględziny/lab, I-V, EL, materiał/BOM | narastający, możliwy open circuit | S2-S3 |
| przebarwienie EVA | foto/termo-oksydacja, spadek transmisji | mało specyficzne | możliwy spadek emisji przez niższą generację | głównie spadek $I_{sc}$ | RGB/UVF/transmisja, I-V | proporcjonalny do utraty transmisji tylko po modelu | S1-S2 |
| delaminacja | utrata adhezji, wilgoć, zmiana optyki/izolacji | lokalny pattern możliwy | zmiana emisji/obszarów | $I_{sc}$, Rs lub izolacja zależnie od miejsca | visual, izolacja, I-V, materiał | od kosmetycznego do safety/yield | S2-S4 |
| hot cell przez cień/soil | polaryzacja wsteczna słabszego ogniwa | punkt/obszar gorący zgodny z zabrudzeniem | zwykle bez trwałego defektu po usunięciu | step/mismatch podczas cienia | RGB, clean-retest, I-V | czasowy lub prowadzący do trwałego uszkodzenia | S2-S4 |
| zwarta dioda bypass | substring stale ominięty | sekcja o innym bilansie, niejednoznaczna | cały substring odmienny | ubytek napięcia/step | test diody po izolacji + I-V | utrata napięcia substringu w szeregu | S2-S3 |
| otwarta dioda bypass | brak ochrony przy mismatch | może dać silny hot cell dopiero przy cieniu | bez jednoznacznego obrazu w normalnym stanie | anomalia podczas wymuszonego mismatch | bezpieczny test funkcjonalny/lab | mały bez cienia, wysoki hazard przy mismatch | S3-S4 |
| open string/fuse | przerwa w obwodzie | moduły/string mogą być równomiernie cieplejsze | EL wymaga osobnego zasilenia | $I=0$, $V$ zależne od miejsca pomiaru | SCADA combiner, continuity po LOTO | energia całego stringu w dostępnych godzinach | S2-S3 |
| rezystancyjne złącze DC | luźny/crimp/corrosion/mismatch konektora | punktowy hotspot obciążeniowy | nie dotyczy | spadek napięcia, czasem subtelny Rs | termika z kontrolą ε + pomiar po izolacji | mała energia bezpośrednia, wysokie ryzyko łuku | S4 |
| uszkodzony kabel/izolacja | mechanika, UV, gryzonie, wilgoć | zwy może być brak lub lokalne heating | nie dotyczy | leakage/niestabilny obwód | insulation, visual, lokalizacja uszkodzenia | outage i hazard, nie tylko sprawność | S3-S4 |
| mismatch modułów | różna moc/technologia/starzenie/orientacja | względne ogrzanie słabszych elementów | różne poziomy emisji | step/obniżony FF i MPP | flash list, seriale, I-V peer, topologia | zależy od wspólnego MPPT/stringu | S1-S3 |
| soiling równomierny | utrata transmisji | często mały kontrast | spadek generacji, zwykle niespecyficzny | niższy $I_{sc}$ | clean/dirty station i test A/B | energia zależna od opadu, kąta i sezonu | S1-S2 |
| clipping | limit $P_{AC}$, prądu/napięcia lub $S$ | brak specyficznego modułowego patternu | nie dotyczy | DC może pozostać zdrowe | SCADA DC/AC, setpoint, model available power | energia powyżej limitu; nie usterka sama w sobie | S0-S1 |
| curtailment | polecenie sieci/plant controller | brak specyficznego patternu | nie dotyczy | zmieniony punkt pracy | setpoint, POI, event log | kontraktowa utrata eksportu, nie wada modułu | S0-S2 |
| hotspot skrzynki/bezpiecznika | $I^2R$, kontakt, przeciążenie | lokalny hotspot BoS | nie dotyczy | czasem spadek napięcia | load-normalized IR, torque/contact test wg procedury | od małej straty do outage/fire | S3-S4 |
| tracker misalignment | błąd napędu/pozycji/stow | inna temperatura i irradiance rzędu | nie dotyczy | niższy prąd grupy | pozycja/encoder, geometria, peer SCADA | profilowa strata rzędu/bloku | S2-S3 |
| deformacja/pal/erozja | grunt, obciążenie, korozja, wykonanie | tylko pośrednio | nie dotyczy | zwykle brak do wtórnego uszkodzenia | survey, pile test, konstruktor/geotechnik | ryzyko mechaniczne i outage wtórny | S3-S4 |

# Audyt końcowy farmy 80 MWp

> **Wszystkie dane liczbowe, nazwy bloków, ceny, usterki i wyniki w tym rozdziale są syntetyczne [A].** Studium służy do demonstracji metody. Nie opisuje istniejącej farmy ani wyników rzeczywistego operatora.

## A.1 Charakterystyka aktywa i pytania audytowe

Farma ma 80,08 MWp DC i 64 MWac, 145 600 modułów bifacial TOPCon po 550 Wp, 5 200 stringów po 28 modułów, 40 inwerterów stringowych po 1,6 MWac, 8 stacji nN/SN, jeden GPO i przyłącze 110 kV. Moduły pracują na trackerach jednoosiowych. SCADA zapisuje dane 5-minutowe; prądy stringów co 15 min. Okres analizy to pełny rok.

Pytania inwestora:

1. Czy różnica między modelem 83 283 MWh a eksportem 79 620 MWh wynika z usterek, ograniczeń sieciowych czy błędu modelu?
2. Które obserwacje termiczne stwarzają ryzyko safety i które mają potwierdzony wpływ energetyczny?
3. Czy naprawa wskazanej populacji ma dodatnie NPV w horyzoncie 5 lat?
4. Czy istnieje podstawa do roszczenia względem modułów, EPC albo O&M?

## A.2 Plan dowodowy

### Faza 1: dokumenty i topologia

Zespół porównał SLD, as-built, konfigurację plant controller, serial-to-location, flash list, BOM, alarmy, commissioning, warranty i service log. Wykryto 2,7% modułów bez pewnego mappingu serial-to-location i rozbieżność 18 stringów między cable schedule a SCADA. Te stringi wyłączono z automatycznej diagnozy do czasu field mapping.

### Faza 2: SCADA i loss tree

Po kontroli jakości 98,4% 5-minutowych rekordów było valid. Dwa czujniki POA wykazały changepoint po czyszczeniu/rekalibracji, więc model użył segmentowanych współczynników. Okresy clippingu i curtailment wyznaczono przed analizą residuum. Peer models budowano osobno dla każdego typu ekspozycji i bloku.

Bilans rocznej różnicy 3 663 MWh:

| Kategoria [A] | Energia | Udział różnicy | Odzyskiwalność techniczna |
|---|---:|---:|---|
| curtailment/grid | 1 050 MWh | 28,7% | nie przez naprawę DC/O&M farmy |
| niedostępność inwerterów | 860 MWh | 23,5% | częściowo, po naprawie root cause i spares |
| clipping zgodny z projektem | 610 MWh | 16,7% | nie bez zmiany DC/AC lub sterowania |
| soiling | 520 MWh | 14,2% | częściowo, zależnie od harmonogramu i wody |
| potwierdzone odchylenia DC | 335 MWh | 9,1% | częściowo, po selektywnej naprawie |
| transformacja i kable ponad model | 158 MWh | 4,3% | część po badaniu połączeń/tapów |
| residuum niewyjaśnione | 130 MWh | 3,5% | nieprzypisane |
| **Suma** | **3 663 MWh** | **100,0%** |  |

Niepewność rozszerzona rocznego gap wynosi [A] ±310 MWh, głównie przez model POA/bifacial, brak danych i korektę czujników. Suma kategorii została ograniczona do gap, dzięki czemu nie występuje podwójne liczenie.

### Faza 3: misja BSP

Cel misji: zlokalizować źródła potwierdzonego residuum DC i znaleźć safety-critical BoS. Kryteria operacyjne [A] ustalono po locie testowym: 20-26 m slant range, co najmniej 6 px na szerokość ogniwa, blur <=0,7 px w próbce, overlap 70/60%, brak nasycenia, dwa azymuty dla anomalii wysokiej wagi. Warunek środowiskowy przyjęto jako rekomendację IEA PVPS: $G_{POA}>600$ W m$^{-2}$, z lokalnym kryterium stabilności ±5% w 2 min [A]. Nie ustanowiono liczbowego limitu wiatru jako „IEC”; akceptacja opierała się na blur i powtarzalności.

Misja objęła 145 600 modułów. Po pierwszym locie valid coverage wyniosło 99,2%; po re-flight 99,8%, czyli 291 modułów pozostało `not valid/not seen`. Natywne pliki R-JPEG i RGB zachowano z hashami. Ortomozajkę użyto do indeksacji, a temperatury pobrano z kadrów źródłowych.

Algorytm zgłosił 920 obiektów. Human QA odrzuciło 214 artefaktów: 121 refleksów, 52 błędy segmentacji, 29 klatek z blur i 12 zdublowanych obserwacji. Pozostało 706 obserwacji:

| Klasa obserwacji | Liczba | Status po IR/RGB |
|---|---:|---|
| soiling/cień/roślinność | 318 | hipoteza środowiskowa, zaplanowany clean-retest |
| cell-level thermal contrast | 146 | różnicowanie crack/shunt/soil/reflection |
| substring pattern | 74 | różnicowanie bypass/mismatch/shading |
| module/string uniform anomaly | 96 | korelacja z prądem i mapowaniem |
| BoS: connector/J-box/combiner | 42 | 11 oznaczono S4 do natychmiastowego zabezpieczenia |
| niejednoznaczne po drugim kącie | 30 | brak klasyfikacji przyczyny |
| **Suma** | **706** |  |

### Faza 4: ground truth

Próbę 160 pozycji dobrano warstwowo: wszystkie 11 S4, wszystkie wzorce rzadkie, losową próbę klas pospolitych i 30 negatywów. Zespół uprawniony wykonał switching/LOTO, I-V, oględziny, clean-retest, EL na wybranych modułach, continuity i badania złączy.

| Wynik potwierdzenia [A] | Liczba | Dowód |
|---|---:|---|
| open string/fuse/mapping | 38 | SCADA combiner + continuity + field mapping |
| odchylenie substring/bypass | 21 | schodek I-V + test diody/EL |
| pęknięcie/interconnect istotne | 17 | EL + I-V + zgodna lokalizacja IR |
| soiling usuwalne | 34 | clean-retest RGB/IR/I-V |
| złącze rezystancyjne | 8 | powtarzalny IR + pomiar po izolacji |
| artefakt/bez odchylenia | 26 | drugi kąt, referencja, I-V w niepewności |
| nierozstrzygnięte | 16 | sygnały sprzeczne lub niewystarczające |
| **Suma** | **160** |  |

Ekstrapolację do niesprawdzonej populacji wykonano tylko dla klas o losowym składniku próby. Wszystkie safety-critical obiekty oceniono indywidualnie. Precision screeningu w zbadanej próbie nie jest publikowane jako skuteczność ogólna, bo próba była celowo wzbogacona w anomalie.

## A.3 Łańcuch wnioskowania dla trzech findingów

### Finding F-01: powtarzalna niedostępność dwóch rodzin inwerterów, S3

SCADA wykazała 860 MWh straty availability, z czego 525 MWh dotyczyło powtarzalnego fault code i długiego oczekiwania na moduł mocy. IR modułów nie było przyczynowe. Service log potwierdził medianę dostawy spare 19 dni. Rekomendacja: RCA producenta, lokalny strategic spare, test naprawy i SLA. Uniknięta energia bazowa 525 MWh/rok, $U=±90$ MWh.

### Finding F-02: 38 otwartych lub błędnie zmapowanych stringów, S2-S3

Prądy stringów wykazały $I\approx0$ w godzinach bez clippingu, IR pokazało równomiernie odmienne moduły, a continuity/field mapping rozdzieliły przerwę od błędu danych. Szacowana strata 210 MWh/rok, $U=±35$ MWh. Rekomendacja: naprawa bezpieczna, korekta asset register i test powrotny I-V/SCADA.

### Finding F-03: osiem rezystancyjnych złączy, S4

Hotspot utrzymał się przy dwóch geometriach i skalował z prądem. Po LOTO badanie potwierdziło nieprawidłowy crimp/mating w tej samej partii. Bezpośrednia utrata energii to tylko około 6 MWh/rok, ale priorytet wynika z ryzyka łuku i wspólnej przyczyny. Rekomendacja: zabezpieczenie ośmiu punktów, quarantine partii, 100% inspection właściwej kohorty, zachowanie dowodów do roszczenia EPC.

## A.4 Energia odzyskiwalna i model finansowy

Po usunięciu nakładania się kategorii z clippingiem i curtailment audyt przyjął następującą energię możliwą do odzyskania:

| Działanie [A] | Gross identified | Współczynnik realizacji | Oczekiwany odzysk |
|---|---:|---:|---:|
| inwertery: RCA + spare + SLA | 525 MWh/rok | 90% | 472,5 MWh/rok |
| naprawa otwartych stringów | 210 MWh/rok | 95% | 199,5 MWh/rok |
| naprawa potwierdzonych substring/crack | 75 MWh/rok | 80% | 60,0 MWh/rok |
| optymalizacja czyszczenia | 510 MWh/rok | 75% | 382,5 MWh/rok |
| połączenia/transformacja po potwierdzeniu | 86 MWh/rok | 70% | 60,2 MWh/rok |
| **Suma** | **1 406 MWh/rok** |  | **1 174,7 MWh/rok** |

Nie włączono 1 050 MWh curtailment, 610 MWh clippingu ani 130 MWh residuum. Cena przechwycona [A] to 350 PLN/MWh. Roczna korzyść energii wynosi:

$$
B_E=1\,174{,}7·350=411\,145\ \mathrm{PLN/rok}.
$$

Program kosztuje 650 000 PLN CAPEX i dodatkowo 25 000 PLN/rok OPEX/QA. Dla 5 lat i realnej stopy 8%:

$$
NPV=-650\,000+(411\,145-25\,000)\frac{1-(1{,}08)^{-5}}{0{,}08}
\approx891\,765\ \mathrm{PLN}.
$$

Prosty payback to $650\,000/386\,145=1{,}68$ roku. Wartość jest [A] i przed podatkiem. Analiza wrażliwości:

| Scenariusz [A] | Odzysk | Cena | CAPEX | NPV 5-letnie |
|---|---:|---:|---:|---:|
| downside | 750 MWh/rok | 280 PLN/MWh | 800 tys. PLN | około -61 tys. PLN |
| base | 1 174,7 MWh/rok | 350 PLN/MWh | 650 tys. PLN | około 892 tys. PLN |
| upside | 1 350 MWh/rok | 420 PLN/MWh | 600 tys. PLN | około 1,56 mln PLN |

Przed decyzją model wymaga interval price, podatków, realnego harmonogramu, outage podczas prac, warranty recovery i prawdopodobieństwa wspólnej przyczyny.

## A.5 Priorytety interwencji

| Priorytet | Działanie | Owner | Termin [A] | Acceptance evidence |
|---|---|---|---|---|
| S4 | odizolować 8 złączy, objąć kohortę inspection i zachować części | HV/DC authorized O&M + HSE | 0-24 h | thermal/electrical re-test, NCR, chain of custody |
| S3 | RCA powtarzalnych tripów i strategic spare | Asset Manager + OEM | 14 dni | zamknięte RCA, spare on-site, test failover |
| S3 | naprawić 38 stringów i mapping | O&M + SCADA owner | 14 dni | prąd peer-normal, I-V sample, asset register 100% |
| S2 | batch 21 bypass i 17 crack/interconnect | Module engineer + O&M | 30 dni | EL/I-V before-after i warranty notice |
| S2 | test czyszczenia blokami i dynamiczny trigger NPV | Performance engineer | 21 dni | randomized A/B, SR, koszt/MWh, reguła trigger |
| S2 | badanie strat transformacji/połączeń | electrical engineer | 45 dni | metering reconciliation, thermography, approved remedy |
| S1 | wyjaśnić 130 MWh residuum i 291 unseen modules | Data lead + UAV lead | 60 dni | coverage 100% lub jawne exclusion, model residual review |

## A.6 Roszczenia

Potencjalne ścieżki [A]:

- **EPC connector cohort:** dowód wspólnego typu złącza/crimp, installation records, zachowane części i pilny notice;
- **module warranty:** tylko dla populacji z serialami, uzgodnionym I-V/EL i wynikiem poza tolerancją/niepewnością procedury gwarancyjnej;
- **inverter availability:** SLA, definition of availability, exclusions, service tickets, spare lead time i liquidated damages;
- **O&M data quality:** rozbieżność mappingu i niewykonane preventive actions, jeżeli kontrakt przypisuje obowiązek.

Gross technical loss nie jest recoverable claim. Dla każdej ścieżki należy policzyć:

$$
Expected\ recovery=P(success)·Recoverable\ amount-C_{claim}.
$$

## A.7 Ostateczna opinia syntetyczna

1. **Stan wydajności:** różnica 3 663±310 MWh/rok jest w większości wyjaśniona, lecz tylko około 1 175 MWh/rok ma bazowo oczekiwany odzysk z programu technicznego.
2. **Stan safety:** osiem złączy stanowi finding S4 niezależnie od małej straty energii; wymagane jest containment i kohortowe sprawdzenie.
3. **Termografia:** BSP skutecznie zawęził populację, ale 26 z 160 zbadanych alarmów było artefaktem/brakiem odchylenia, a 16 pozostało nierozstrzygniętych. Dowodzi to konieczności ground truth.
4. **Ekonomika:** base NPV około 0,89 mln PLN jest dodatnie, ale downside jest blisko zera/ujemne; decyzję warunkuje interval pricing i skuteczność realizacji.
5. **Bankability:** mapping 2,7% modułów i 18 stringów jest niepełny, co osłabia gwarancje i predykcję. Zamknięcie traceability jest warunkiem inwestycyjnym.
6. **Rekomendacja:** wykonać natychmiast S4, uruchomić 30-dniowy program inwerter/string/cleaning, a CAPEX zatwierdzić po potwierdzeniu interval-value i warranty recovery. Nie wymieniać masowo modułów na podstawie IR.

## A.8 Kryterium zaliczenia capstone

Uczestnik zalicza audyt, jeśli potrafi:

- odtworzyć loss tree do sumy z dokładnością arytmetyczną i bez overlap;
- wskazać, które 1 050 + 610 MWh nie są odzyskiwalne przez zwykłą naprawę;
- obronić geometrię lotu i odrzucić artefakty odbiciowe;
- dobrać test naziemny do pięciu różnych patternów IR;
- wyjaśnić, dlaczego złącze 6 MWh/rok ma wyższy priorytet niż soiling 510 MWh/rok;
- przeliczyć NPV w trzech scenariuszach i podać główne sensitivity drivers;
- przygotować claims-ready evidence pack bez przedwczesnej diagnozy.

# Rejestr norm i zakresów

Stan sprawdzono 12-13.09.2026 na publicznych stronach wydawców. **Aktualna edycja** oznacza najnowszy opublikowany dokument w katalogu IEC/ISO, nie projekt `PREPARING`. W projekcie należy dodatkowo sprawdzić krajową adopcję PN-EN/PN-HD, prawo, warunki OSD, umowy, instrukcje OEM i zakupiony pełny tekst.

| Dokument | Aktualna opublikowana edycja | Publicznie potwierdzony zakres | Status i ograniczenie użycia |
|---|---|---|---|
| [IEC 62446-1](https://webstore.iec.ch/en/publication/63726) | 2016+A1:2018 CSV, Ed. 1.1 | dokumentacja, commissioning tests i inspection grid-connected PV | [N] International Standard; Ed. 2.0 nadal `PREPARING` |
| [IEC TS 62446-3](https://webstore.iec.ch/en/publication/28628) | 2017, Ed. 1.0 | outdoor IR modułów i pracującej elektrowni; aparatura, warunki, procedura, raport i kwalifikacje | [N] Technical Specification; brak publicznego potwierdzenia liczbowych POA, wind, GSD, angle, ΔT/pass-fail |
| [IEC 61724-1](https://webstore.iec.ch/en/publication/65561) | 2021, Ed. 2.0 | monitoring performance, terminologia, klasy i metody, bifacial/soiling | [N] liczby klas i sampling wymagają pełnego tekstu |
| [IEC 61829](https://webstore.iec.ch/en/publication/23561) | 2015, Ed. 2.0 | on-site I-V array, meteo i translacja do STC/innych warunków | [N] brak publicznych pass/fail i minimalnego POA |
| [IEC 60891](https://webstore.iec.ch/en/publication/61766) | 2021, Ed. 3.0, COR1:2024 | korekcja I-V dla temperatury i irradiance | [N] nie zastępuje field acquisition ani budżetu niepewności |
| [IEC 62446-2](https://webstore.iec.ch/en/publication/27382) | 2020, Ed. 1.0 | preventive, corrective i performance-related maintenance | [N] częstotliwości i thresholds wymagają pełnego tekstu/kontraktu |
| [IEC 62548-1](https://webstore.iec.ch/en/publication/110893) | 2023+A1:2025 CSV, Ed. 1.1 | design array, DC wiring, protection, switching i earthing | [N] nie jest terenowym kryterium oceny istniejącej konstrukcji |
| [IEC TS 62738](https://webstore.iec.ch/en/publication/26942) | 2018, Ed. 1.0 | ground-mounted power plants przyłączone do MV/HV | [N] Technical Specification; brak terenowych tolerancji konstrukcji w publicznym opisie |
| [IEC 61215-1](https://webstore.iec.ch/en/publication/61345) i [-2](https://webstore.iec.ch/en/publication/61350) | 2021, Ed. 2.0 | design qualification i type approval modułów | [N] IEC jawnie nie daje ilościowej prognozy lifetime |
| [IEC 61730-1](https://webstore.iec.ch/en/publication/59803) i [-2](https://webstore.iec.ch/en/publication/63895) | 2023, Ed. 3.0; COR1:2024 dla -2 | safety qualification modułu | [N] nie jest pełnym kodem instalacji ani field diagnosis |
| [IEC 62109-1](https://webstore.iec.ch/en/publication/6470) i [-2](https://webstore.iec.ch/en/publication/6471) | 2010/2011, Ed. 1.0 | bezpieczeństwo PCE i wymagania dla inwerterów | [N] Ed. 2.0 obu części jest w przygotowaniu |
| [IEC 62817](https://webstore.iec.ch/en/publication/61127) | 2014+A1:2017 CSV, Ed. 1.1 | design qualification trackerów | [N] nie potwierdza stanu konkretnego trackera/fundamentu |
| [IEC 60364-7-712](https://webstore.iec.ch/en/publication/65748) | 2025, Ed. 3.0 | instalacje elektryczne PV i dobór wyposażenia | [N] trzeba sprawdzić aktualną adopcję krajową |
| [IEC TS 61724-2](https://webstore.iec.ch/en/publication/66710) | 2025, Ed. 2.0 | power performance index i capacity evaluation grid-connected PV | [N] nie jest termografią ani gwarancją rocznego uzysku |
| [IEC TS 63019](https://webstore.iec.ch/en/publication/27253) | 2019, Ed. 1.0 | information model for availability | [N] umowa definiuje wyłączenia i skutki finansowe |
| [IEC TS 63102](https://webstore.iec.ch/en/publication/31475) | 2021, Ed. 1.0 | metody oceny grid-code compliance | [N] wymagania liczbowe daje właściwy grid code/connection agreement |
| [IEC 61936-1](https://webstore.iec.ch/en/publication/64490) | 2021, Ed. 3.0 | instalacje AC powyżej 1 kV | [N] wymaga pełnego zestawu norm stacyjnych i adopcji krajowej |
| [ISO 1461](https://www.iso.org/standard/67600.html) | ISO 1461:2022 | powłoki cynkowe zanurzeniowe na wyrobach stalowych | [N] nie daje samodzielnie service life w danym gruncie |

## Co skorygowano względem częstych założeń

1. `TS` jest dokumentem normatywnym, ale nie ma statusu International Standard. Konkretne `shall/should` sprawdza się w pełnym tekście.
2. 600 W m$^{-2}$ i 5×5 px/ogniwo są rekomendacjami raportów IEA PVPS T13-10:2018 oraz T13-25:2022, a stabilizacja 5-15 min jest rekomendacją T13-10:2018. Nie są tu deklarowane jako samodzielnie zweryfikowane klauzule IEC TS 62446-3.
3. „Low wind” nie tworzy uniwersalnego limitu m/s. Limit lotniczy i termiczny są odrębnymi kryteriami.
4. Kąt 60° występujący w materiałach przy emisyjności szkła nie jest automatycznym limitem lotu.
5. NREL opisywał parametry obrazowania przemysłowego, lecz nie stanowią one uniwersalnego GSD IEC.
6. ΔT jest obserwacją. Nie ma publicznie potwierdzonej uniwersalnej tabeli ΔT -> przyczyna -> utrata mocy.
7. IEC 61215 qualification nie gwarantuje lifetime konkretnego BOM, a IEC 61730/62109 nie potwierdzają aktualnego stanu egzemplarza.
8. IEC 61829 dotyczy field I-V, IEC 60891 korekcji. Żadna nie zamienia jednej krzywej w pewną diagnozę mechanizmu.

# Źródła techniczne i naukowe

Poniższy rejestr jest aparatem źródłowym dla podręcznika. Daty/edycje norm pochodzą z oficjalnych stron wyżej. DOI zostały sprawdzone na żywo. Dostęp: 12-13.09.2026.

1. **[S1]** IEC, IEC 62446-1:2016+A1:2018 CSV, Ed. 1.1, [oficjalna karta](https://webstore.iec.ch/en/publication/63726).
2. **[S2]** IEC, IEC TS 62446-3:2017, Ed. 1.0, [oficjalna karta](https://webstore.iec.ch/en/publication/28628).
3. **[S3]** IEC, IEC 61724-1:2021, Ed. 2.0, [oficjalna karta](https://webstore.iec.ch/en/publication/65561).
4. **[S4]** IEC, IEC 61829:2015, Ed. 2.0, [oficjalna karta](https://webstore.iec.ch/en/publication/23561).
5. **[S5]** IEC, IEC 60891:2021, Ed. 3.0, [oficjalna karta](https://webstore.iec.ch/en/publication/61766).
6. **[S6]** IEA PVPS Task 13 (2018), *Review on Infrared and Electroluminescence Imaging for PV Field Applications*, T13-10:2018, [PDF](https://iea-pvps.org/wp-content/uploads/2020/01/Review_on_IR_and_EL_Imaging_for_PV_Field_Applications_by_Task_13.pdf).
7. **[S7]** IEA PVPS Task 13 (2022), *Guidelines for Operation and Maintenance of Photovoltaic Power Plants in Different Climates*, T13-25:2022, [PDF](https://iea-pvps.org/wp-content/uploads/2022/11/IEA-PVPS-Report-T13-25-2022-OandM-Guidelines.pdf).
8. **[S8]** IEA PVPS Task 13 (2025), *Degradation and Failure Modes in New Photovoltaic Cell and Module Technologies*, T13-30:2025, [PDF](https://iea-pvps.org/wp-content/uploads/2025/02/IEA-PVPS-T13-30-2025-REPORT-Degradation-and-Failure.pdf).
9. **[S9]** Moser, D. et al. (2026), *PV Project Decisions: Quality, Performance, and Economic Value*, IEA PVPS T13-36:2026, [DOI 10.69766/SDJU3969](https://doi.org/10.69766/SDJU3969).
10. **[S10]** Walker, H. et al. (2018), *Best Practices for Operation and Maintenance of Photovoltaic and Energy Storage Systems*, 3rd ed., NREL/TP-7A40-73822, [oficjalny PDF NREL](https://www.nrel.gov/docs/fy19osti/73822.pdf).
11. **[S11]** IEA PVPS Task 13 (2021), *Quantification of Technical Risks in PV Power Systems*, T13-23:2021, [PDF](https://iea-pvps.org/wp-content/uploads/2021/11/Report-IEA%E2%80%93PVPS-T13-23_2021-Quantification-of-Technical-Risks-in-PV-Power-Systems_final.pdf).
12. **[S12]** Fraunhofer ISE, Philipps, S., Warmuth, W. (2026), *Photovoltaics Report*, wersja 14.07.2026, [strona](https://www.ise.fraunhofer.de/en/publications/studies/photovoltaics-report.html).
13. **[S13]** Köntges, M. et al. (2017), *Assessment of Photovoltaic Module Failures in the Field*, IEA PVPS T13-09:2017, [strona raportu](https://iea-pvps.org/key-topics/report-assessment-of-photovoltaic-module-failures-in-the-field-2017/).
14. **[S14]** Buerhop, C., Bommes, L., Schlipf, J., Pickel, T., Fladung, A., Peters, I.M. (2022), *Infrared imaging of photovoltaic modules: a review of the state of the art and future challenges facing gigawatt photovoltaic power stations*, [DOI 10.1088/2516-1083/ac890b](https://doi.org/10.1088/2516-1083/ac890b).
15. **[S15]** Sadeghi, R. et al. (2026), *Infrared Thermography in Photovoltaic Systems: A Review for Maximizing Energy Yield and Long-Term Reliability*, [DOI 10.3390/en19061570](https://doi.org/10.3390/en19061570).
16. **[S16]** van den Maagdenberg, A. et al. (2022), *Review of degradation and failure phenomena in photovoltaic modules*, [DOI 10.1016/j.rser.2022.112160](https://doi.org/10.1016/j.rser.2022.112160).
17. **[S17]** Livera, A. et al. (2022), *Review of photovoltaic module degradation, field inspection techniques and techno-economic assessment*, [DOI 10.1016/j.rser.2022.112616](https://doi.org/10.1016/j.rser.2022.112616).
18. **[S18]** Bastidas-Rodriguez, J.D. et al. (2014), *Maximum power point tracking architectures for photovoltaic systems in mismatching conditions: a review*, [DOI 10.1049/iet-pel.2013.0406](https://doi.org/10.1049/iet-pel.2013.0406).
19. **[S19]** IEA PVPS Task 13 (2020), *Uncertainty in Yield Assessments and PV LCOE*, T13-18:2020, [PDF](https://iea-pvps.org/wp-content/uploads/2021/01/Report-IEA%E2%80%93PVPS-T13-18_2020-Uncertainties-in-Yield-Assessments-and-PV-LCOE-1.pdf).
20. **[S20]** IEA PVPS Task 13 (2022), *Soiling Losses: Impact on the Performance of PV Power Plants*, T13-21:2022, [PDF](https://iea-pvps.org/wp-content/uploads/2023/01/IEA-PVPS-T13-21-2022-REPORT-Soiling-Losses-PV-Plants.pdf).
21. **[S21]** Jordan, D.C., Kurtz, S.R., VanSant, K., Newmiller, J. (2016), *Compendium of photovoltaic degradation rates*, [DOI 10.1002/pip.2744](https://doi.org/10.1002/pip.2744).
22. **[S22]** Shockley, W., Read, W.T. (1952), *Statistics of the Recombinations of Holes and Electrons*, [DOI 10.1103/PhysRev.87.835](https://doi.org/10.1103/PhysRev.87.835).
23. **[S23]** De Soto, W., Klein, S.A., Beckman, W.A. (2006), *Improvement and validation of a model for photovoltaic array performance*, [DOI 10.1016/j.solener.2005.06.010](https://doi.org/10.1016/j.solener.2005.06.010).
24. **[S24]** Feldmann, F. et al. (2014), *Passivated rear contacts for high-efficiency n-type Si solar cells*, [DOI 10.1016/j.solmat.2013.09.017](https://doi.org/10.1016/j.solmat.2013.09.017).
25. **[S25]** Sahli, F. et al. (2018), *Fully textured monolithic perovskite/silicon tandem solar cells with 25.2% power conversion efficiency*, [DOI 10.1038/s41563-018-0115-4](https://doi.org/10.1038/s41563-018-0115-4).
26. **[S26]** Schmidt, J., Bothe, K. (2004), *Structure and transformation of the metastable boron- and oxygen-related defect center in crystalline silicon*, [DOI 10.1103/PhysRevB.69.024107](https://doi.org/10.1103/PhysRevB.69.024107).
27. **[S27]** Kersten, F. et al. (2015), *Degradation of multicrystalline silicon solar cells and modules after illumination at elevated temperature*, [DOI 10.1016/j.solmat.2015.06.015](https://doi.org/10.1016/j.solmat.2015.06.015).
28. **[S28]** Naumann, V. et al. (2013), *The role of stacking faults for the formation of shunts during potential-induced degradation*, [DOI 10.1002/pssr.201307090](https://doi.org/10.1002/pssr.201307090).
29. **[S29]** Köntges, M. et al. (2011), *The risk of power loss in crystalline silicon based photovoltaic modules due to micro-cracks*, [DOI 10.1016/j.solmat.2010.10.034](https://doi.org/10.1016/j.solmat.2010.10.034).
30. **[S30]** Oreski, G. et al. (2020), *Properties and degradation behaviour of polyolefin encapsulants for photovoltaic modules*, [DOI 10.1002/pip.3323](https://doi.org/10.1002/pip.3323).
31. **[S31]** Herrmann, W. et al. (2021), *Qualification of Photovoltaic Power Plants using Mobile Test Equipment*, IEA PVPS T13-24:2021, [PDF](https://iea-pvps.org/wp-content/uploads/2021/04/IEA-PVPS-T13-24_2021_Qualification-of-PV-Power-Plants_report.pdf).
32. **[S32]** IEC, IEC TS 60904-13:2018, *Electroluminescence of photovoltaic modules*, [oficjalna karta](https://webstore.iec.ch/en/publication/26703).
33. **[S33]** Bhoopathy, R. et al. (2018), *Outdoor photoluminescence imaging of photovoltaic modules with sunlight excitation*, [DOI 10.1002/pip.2946](https://doi.org/10.1002/pip.2946).

# Metodyka opracowania, ograniczenia i cykl aktualizacji

Materiał opracowano 12-13.09.2026 przez triangulację publicznych kart IEC/ISO, raportów IEA PVPS, NREL i Fraunhofer ISE oraz publikacji recenzowanych. DOI i metadane sprawdzono na bieżąco. Płatnych treści norm nie rekonstruowano z pamięci ani ze źródeł wtórnych. Dlatego publicznie potwierdzony zakres i edycja mają status [N], lecz szczegółowe wartości lub kryteria pozostają niezweryfikowane, jeżeli nie były dostępne w źródle publicznym.

Przed zastosowaniem materiału do konkretnej farmy należy wykonać kontrolę zmian norm, krajowej adopcji PN-EN/PN-HD, przepisów BSP i BHP, warunków przyłączenia, umów, instrukcji OEM oraz kalibracji aparatury. Aktualizacja jest wymagana także po zmianie firmware kamery, formatu radiometrycznego, topologii SCADA, modelu modułu lub inwertera. Następny przegląd źródeł zaplanowano najpóźniej na 12.03.2027.

## Minimalny pakiet raportowy z rzeczywistego audytu

- identyfikacja aktywa, granica pomiarowa, SLD/as-built i wersje konfiguracji;
- kompetencje, JSA/LOTO, pozwolenia BSP oraz rejestr odstępstw bezpieczeństwa;
- aparatura, numery seryjne, kalibracja, firmware, nastawy i testy funkcjonalne;
- surowe SCADA, pogodowe, RGB, radiometryczne IR, I-V i EL/PL z hashami i znacznikami czasu;
- mapa `asset ID -> współrzędne -> string -> MPPT -> inverter -> feeder -> POI`;
- rejestr obserwacji, hipotez alternatywnych, testów rozstrzygających i statusu dowodu;
- budżet niepewności, sampling frame, exclusions, coverage, false positives i `not inspected`;
- loss tree bez nakładania kategorii, baseline, przedział MWh i ograniczenia odzyskiwalności;
- macierz bezpieczeństwo/energia/finanse, CAPEX/OPEX, NPV i analiza wrażliwości;
- claims pack: seriale, chain of custody, before/after, wymaganie umowne i termin notice.
