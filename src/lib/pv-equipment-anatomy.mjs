// Conceptual teaching models, not manufacturer layouts or switching procedures.
const part = (id, name, role, mechanism, observation, misconception) => ({ id, name, role, mechanism, observation, misconception });
const step = (title, partIds, description) => ({ title, partIds, description });
const source = (title, url) => ({ title, url });

export const equipmentAnatomies = [
  {
    id: 'switchboard', title: 'Rozdzielnica niskiego napięcia',
    intro: 'Rozdzielnica jest węzłem połączeń AC: zbiera zasilanie, rozdziela obwody i mieści aparaty ochronne. W PV energia może płynąć także od falownika w stronę sieci.',
    principle: 'Prąd roboczy płynie szynami, stykami i zaciskami; układy ochronne reagują na różne zjawiska. Nadprąd, prąd różnicowy i przepięcie to trzy różne problemy.',
    scope: 'Model łączy funkcje spotykane w różnych rozdzielnicach nN. Domowa szafka zwykle ma aparaty modułowe, a rozdzielnica farmy może mieć większe wyłączniki i inne układy ochrony; nie każda ma RCD ani tor N.',
    parts: [
      part('busbars', 'Szyny fazowe', 'Łączą wspólny tor zasilania z poszczególnymi obwodami.', 'Miedziane lub aluminiowe przewodniki przenoszą prąd, a ich rezystancja powoduje straty I²R.', 'W modelu wspólny odcinek rozgałęzia się do aparatów poszczególnych odpływów.', 'Duży przekrój szyny nie gwarantuje dobrego styku na każdym połączeniu.'),
      part('breaker', 'Wyłącznik nadprądowy', 'Przerywa obwód przy określonych przeciążeniach i zwarciach.', 'Wyzwalacz termiczny, magnetyczny lub elektroniczny uruchamia otwarcie styków i gaszenie łuku.', 'MCB to wyłącznik miniaturowy, MCCB kompaktowy w obudowie izolacyjnej, a ACB wyłącznik powietrzny używany także w dużych rozdzielnicach nN.', 'Prąd znamionowy nie jest zdolnością wyłączania zwarcia, a aparatów tych nie dobiera się wyłącznie według rozmiaru.'),
      part('rcd', 'Ochrona różnicowoprądowa RCD', 'Wykrywa prąd wracający inną drogą niż monitorowane przewody czynne.', 'Przekładnik sumujący porównuje prądy przewodów przechodzących przez jego okno; niezrównoważenie może wyzwolić aparat.', 'W PV potrzeba RCD, jego typ i nastawy zależą od sieci, projektu oraz konstrukcji i instrukcji falownika.', 'Typ B nie jest automatycznie wymagany dla każdego falownika; sam RCCB nie zapewnia ochrony nadprądowej, w odróżnieniu od aparatu zespolonego RCBO.'),
      part('spd', 'Ogranicznik przepięć SPD', 'Ogranicza krótkotrwałe przepięcia docierające do urządzeń.', 'Gałąź ochronna jest połączona równolegle do chronionego toru i podczas impulsu przewodzi prąd udarowy.', 'Wyróżniony moduł SPD należy odróżnić od aparatów w głównym torze mocy; jego połączenie ochronne jest równoległe.', 'SPD nie stabilizuje stale napięcia i nie zastępuje wyłącznika nadprądowego.'),
      part('neutral', 'Listwa neutralna N', 'Łączy przewody neutralne obwodów, w których przewód N występuje.', 'N może przewodzić prąd roboczy wynikający z obciążenia i niesymetrii faz.', 'N oraz PE mają w modelu osobne listwy, bo pełnią odmienne funkcje.', 'N nie jest przewodem ochronnym ani gwarancją braku niebezpiecznego napięcia.'),
      part('earth', 'Listwa ochronna PE', 'Łączy przewody ochronne i dostępne części przewodzące objęte ochroną.', 'Tworzy część drogi prądu uszkodzeniowego i połączeń wyrównawczych zgodnie z układem sieci.', 'Wizualna gałąź PE łączy ochronę obudowy z układem ochronnym instalacji.', 'PE nie jest przewidziany do przenoszenia prądu obciążenia; punktów połączenia N i PE nie można dowolnie dodawać.'),
      part('terminals', 'Zaciski odpływowe', 'Stanowią granicę między aparaturą rozdzielnicy a przewodami obwodów.', 'Docisk połączenia zapewnia powierzchnię kontaktu, od której zależą rezystancja i nagrzewanie.', 'Opis zacisku pomaga powiązać konkretny przewód z obwodem na schemacie.', 'Gorący zacisk sam w sobie nie dowodzi przeciążenia całej instalacji; przyczynę ustala się z kontekstem obciążenia i połączenia.'),
    ],
    process: [
      step('Rozdział mocy', ['busbars', 'terminals'], 'Szyny łączą zasilanie i odpływy. Kierunek przepływu na przyłączu zależy od bilansu produkcji i zużycia.'),
      step('Nadzór nad prądem', ['breaker', 'rcd'], 'Wyłącznik nadprądowy i RCD obserwują inne wielkości; ich funkcji nie można utożsamiać.'),
      step('Droga impulsu', ['spd', 'earth'], 'Przy przepięciu prąd impulsowy płynie gałęzią SPD zgodnie z jej układem połączeń, poza normalną drogą odbioru energii.'),
      step('Dwa różne przewody', ['neutral', 'earth'], 'N może uczestniczyć w pracy obwodu, a PE pełni funkcję ochronną. To opis funkcji, nie schemat wykonawczy.'),
    ],
    example: { question: 'Jaki prąd odpowiada mocy 10 kW w symetrycznym obwodzie trójfazowym 400 V przy cos φ = 1?', working: 'I = P / (√3 × U × cos φ) = 10 000 / (√3 × 400 × 1) ≈ 14,4 A na fazę.', answer: 'Około 14,4 A. Wynik opisuje prąd pracy przy podanych założeniach; nie wyznacza sam przekroju kabla, zabezpieczenia ani zdolności zwarciowej.' },
    sources: [
      source('Schneider Electric: parametry wyłączników', 'https://www.electrical-installation.org/enwiki/Fundamental_characteristics_of_a_circuit-breaker'),
      source('ABB: rodziny MCB, MCCB i ACB', 'https://electrification.us.abb.com/your-business/oem/electrical-equipment-manufacturer'),
      source('Schneider Electric: zasada SPD', 'https://www.electrical-installation.org/enwiki/The_Surge_Protection_Device_%28SPD%29'),
      source('Schneider Electric: przewód ochronny PE', 'https://www.electrical-installation.org/enwiki/Connection_and_choice_for_protective_earthing_conductor'),
      source('SMA: zgodność konkretnych falowników z RCD typu A', 'https://files.sma.de/downloads/RCD-Typ-A-HK-en-18.pdf'),
    ],
  },
  {
    id: 'mv', title: 'Pole rozdzielnicy średniego napięcia',
    intro: 'Pole SN łączy wybrany kabel lub transformator z systemem szyn. Aparatura pomiarowa, zabezpieczeniowa i łączeniowa współpracuje, lecz każda ma własną funkcję.',
    principle: 'Przekładnik dostarcza sygnał pomiarowy, przekaźnik ocenia stan, a wyłącznik fizycznie przerywa prąd. Odłącznik i uziemnik nie są zamiennikami tego łańcucha.',
    scope: 'Pokazujemy poglądowe pole z wyłącznikiem i osobnymi funkcjami odłączania oraz uziemiania. Istnieją inne konstrukcje, aparaty zespolone, odmienne izolacje i pola bez takiego zestawu; model nie przedstawia sekwencji łączeniowej.',
    parts: [
      part('busbars', 'Szyny SN', 'Łączą pola rozdzielnicy na wspólnym poziomie napięcia.', 'Prąd płynie przewodnikiem, a izolacja i odstępy oddzielają fazy od siebie i obudowy.', 'Wspólna szyna oznacza, że jedno pole jest częścią większego układu.', 'Wyłączenie pojedynczego odpływu nie oznacza braku napięcia na szynach.'),
      part('breaker', 'Wyłącznik SN', 'Przerywa prądy robocze i określone prądy zwarciowe w granicach znamionowych.', 'Rozchodzące się styki i komora gaszeniowa opanowują łuk; częstym rozwiązaniem jest komora próżniowa.', 'Model wyróżnia trzy tory fazowe i wspólną funkcję wyłączania.', 'Wyłącznik SN nie musi korzystać z SF₆; medium gaszące łuk i izolacja całego pola to odrębne zagadnienia.'),
      part('disconnector', 'Odłącznik', 'Zapewnia funkcję odizolowania części obwodu zgodną z konstrukcją aparatu.', 'Rozdzielenie styków tworzy wymaganą przerwę izolacyjną, której stan może być mechanicznie sygnalizowany.', 'W modelu jest osobnym elementem od wyłącznika, aby pokazać różnicę zadań.', 'Zwykły odłącznik nie jest wyłącznikiem zwarciowym ani rozłącznikiem przeznaczonym do ogólnego wyłączania obciążenia.'),
      part('earthing', 'Uziemnik', 'Łączy wyznaczoną część obwodu z układem uziemiającym w przewidzianym stanie instalacji.', 'Mechanizm zwiera odpowiednie tory do ziemi; blokady ograniczają niedozwolone kombinacje położeń.', 'Symboliczne połączenie z ziemią należy do funkcji ochronnej pola.', 'Obecność uziemnika lub blokady nie dowodzi bezpiecznego stanu pracy i nie zastępuje procedury uprawnionego personelu.'),
      part('ct', 'Przekładniki prądowe CT', 'Odwzorowują duży prąd toru głównego jako sygnał dla pomiarów i zabezpieczeń.', 'W klasycznym CT sprzężenie magnetyczne daje mniejszy prąd wtórny zależny od przekładni.', 'Pierścień wokół przewodnika symbolizuje pomiar bez prowadzenia całego prądu pola do przekaźnika.', 'Otwarcie obwodu wtórnego klasycznego CT przy prądzie pierwotnym może wytworzyć niebezpieczne napięcie; ilustracja nie jest instrukcją ingerencji.'),
      part('relay', 'Przekaźnik zabezpieczeniowy', 'Ocenia sygnały pomiarowe i wydaje polecenie wyłączenia przy spełnieniu kryteriów.', 'Algorytmy porównują mierzony przebieg, czas i nastawy dobrane dla konkretnej sieci.', 'Przekaźnik otrzymuje sygnał z CT; ten obwód pomiarowy pełni inną funkcję niż główny tor mocy.', 'Przekaźnik nie przerywa sam głównego prądu zwarciowego; potrzebuje sprawnego obwodu wyzwalania i wyłącznika.'),
      part('cables', 'Głowice i przedział kablowy', 'Łączą przewody kabla SN z aparaturą pola.', 'Izolowane zakończenie kabla kontroluje rozkład pola elektrycznego przy przejściu do zacisku.', 'Trzy zakończenia reprezentują trzy fazy, nie trzy niezależne źródła.', 'Wygląd głowicy nie potwierdza jej wytrzymałości izolacyjnej ani braku napięcia.'),
    ],
    process: [
      step('Tor roboczy', ['cables', 'breaker', 'busbars'], 'Energia przechodzi między kablem a szynami przez aparat łączeniowy; układ przestrzenny zależy od wykonania pola.'),
      step('Informacja o prądzie', ['ct', 'relay'], 'CT przekazuje odwzorowanie prądu do przekaźnika, który analizuje warunki pracy.'),
      step('Reakcja na zakłócenie', ['relay', 'breaker'], 'Po spełnieniu kryteriów zabezpieczenie wysyła sygnał wyzwalający, a wyłącznik przerywa prąd.'),
      step('Odrębne funkcje ochronne', ['disconnector', 'earthing'], 'Odizolowanie i uziemienie są osobnymi funkcjami konstrukcji. Ta lista nie podaje kolejności czynności obsługowych.'),
    ],
    example: { question: 'Co oznacza wskazanie 2,5 A na wtórnym obwodzie idealnego CT o przekładni 200/5 A?', working: 'Przekładnia k = 200 / 5 = 40. Prąd pierwotny I₁ = 2,5 × 40 = 100 A.', answer: 'Odpowiada 100 A w torze głównym przy pominięciu błędów przekładnika. To przeliczenie pomiaru, a nie informacja o progu zadziałania przekaźnika.' },
    sources: [
      source('ABB: wyłączniki próżniowe i różnica względem rozłącznika', 'https://www.abb.com/global/en/areas/electrification/medium-voltage/grid-components/primary-vacuum-circuit-breakers'),
      source('ABB: aparatura, przekładniki i sensory SN', 'https://www.abb.com/global/en/areas/electrification/medium-voltage/grid-components'),
      source('ABB: zabezpieczenia transformatorów', 'https://new.abb.com/medium-voltage/digital-substations/protection-relays/transformer-protection-and-control'),
      source('Janitza: praca i ryzyko otwartego obwodu CT', 'https://www.janitza.com/en-us/know-how/knowledgebase/operation-of-current-transformers'),
    ],
  },
  {
    id: 'transformer', title: 'Transformator nN/SN',
    intro: 'Transformator zmienia poziom napięcia AC przez indukcję elektromagnetyczną. W farmie PV zwykle podnosi napięcie, a ten sam typ zasady działa również przy przepływie energii w drugą stronę.',
    principle: 'Zmienny strumień magnetyczny sprzęga uzwojenia. Energia przechodzi między oddzielnymi obwodami elektromagnetycznie, bez przewodzącej ścieżki przez rdzeń od jednego uzwojenia do drugiego.',
    scope: 'Ilustracja przedstawia uproszczony transformator olejowy o oddzielnych uzwojeniach. Transformatory suche mają inną izolację i chłodzenie, a autotransformator nie zapewnia takiego rozdzielenia obwodów; pokazany przekrój nie reprezentuje wszystkich konstrukcji.',
    parts: [
      part('core', 'Rdzeń magnetyczny', 'Prowadzi strumień magnetyczny sprzęgający uzwojenia.', 'Pakiet cienkich blach ogranicza prądy wirowe, ale rdzeń nadal powoduje straty i nagrzewanie.', 'Wspólna część magnetyczna otacza lub przenika obszar obu uzwojeń.', 'Prąd z uzwojenia nN nie płynie metalem rdzenia do uzwojenia SN.'),
      part('lv-winding', 'Uzwojenie niskiego napięcia', 'Jest elektrycznym portem strony nN transformatora.', 'Dla podobnej mocy niższe napięcie oznacza większy prąd, co wpływa na przekrój przewodnika.', 'Model rozróżnia uzwojenia nN i SN na trzech kolumnach rdzenia; pokazuje je współosiowo w uproszczonym przekroju.', 'Uzwojenie nN nie zawsze jest odbiorczą stroną wtórną; w farmie może być stroną zasilaną z falowników.'),
      part('mv-winding', 'Uzwojenie średniego napięcia', 'Łączy transformator ze stroną SN.', 'Napięcie pojedynczego uzwojenia zależy od liczby jego zwojów i zmiennego strumienia.', 'Większa liczba zwojów pomaga wyobrazić sobie wyższe napięcie, lecz rysunek nie odwzorowuje rzeczywistej przekładni.', 'Stosunek napięć międzyfazowych wymaga uwzględnienia grupy połączeń; nie zawsze równa się prostemu stosunkowi zwojów.'),
      part('insulation', 'Izolacja uzwojeń i olej', 'Oddziela elektrycznie zwoje, uzwojenia i części uziemione.', 'W pokazanym wariancie papier i ciecz izolacyjna współpracują; ciecz przenosi też ciepło.', 'Przestrzeń między uzwojeniami ma funkcję izolacyjną, choć widok rozstrzelony ją powiększa.', 'Olej nie jest drogą roboczego prądu pomiędzy uzwojeniami, a transformator suchy nie potrzebuje kąpieli olejowej.'),
      part('bushings', 'Przepusty izolacyjne', 'Wyprowadzają przewodniki przez uziemioną obudowę lub osłonę.', 'Izolacja wokół przewodnika oddziela go od metalowej konstrukcji i kształtuje pole elektryczne.', 'Na modelu przepust jest miejscem przejścia między wnętrzem a zewnętrznym przyłączem.', 'Przepust nie zmienia napięcia; robi to układ uzwojeń i strumienia.'),
      part('cooling', 'Układ chłodzenia', 'Odprowadza ciepło strat uzwojeń i rdzenia do otoczenia.', 'W wariancie olejowym ciepło dociera z cieczą do ścian lub radiatorów, a dalej do powietrza.', 'Żebra zwiększają powierzchnię oddawania ciepła, lecz nie pokazują rzeczywistej temperatury.', 'Nie każdy transformator ma pompę lub wentylator; sposób chłodzenia jest cechą konkretnej konstrukcji.'),
      part('taps', 'Zaczepy uzwojenia', 'Umożliwiają zmianę efektywnej przekładni w przewidzianym zakresie.', 'Wybór zaczepu zmienia liczbę czynnych zwojów i przez to relację napięć.', 'Osobny element modelu oznacza funkcję regulacji, a nie uniwersalną lokalizację mechanizmu.', 'Nie każdy przełącznik zaczepów działa pod obciążeniem; sposób obsługi wynika wyłącznie z dokumentacji urządzenia.'),
    ],
    process: [
      step('Port nN', ['bushings', 'lv-winding'], 'W przykładzie farmy AC z falownika dociera do uzwojenia nN przez przyłącze.'),
      step('Sprzężenie magnetyczne', ['lv-winding', 'core', 'mv-winding'], 'Zmienny strumień wiąże uzwojenia i indukuje napięcia. To nie jest szeregowy przepływ elektronów przez rdzeń.'),
      step('Port SN i przekładnia', ['mv-winding', 'taps', 'bushings'], 'Poziom napięcia strony SN zależy od przekładni, połączeń i warunków obciążenia.'),
      step('Straty i izolacja', ['insulation', 'cooling'], 'Izolacja rozdziela potencjały, a chłodzenie usuwa ciepło strat. Obie funkcje ograniczają dopuszczalne warunki pracy.'),
    ],
    example: { question: 'Jak zmienia się prąd przy przekazaniu 1 MVA między stroną 0,8 kV i 20 kV w idealnym, symetrycznym układzie trójfazowym?', working: 'I = S / (√3 × U). Strona nN: 1 000 000 / (√3 × 800) ≈ 722 A. Strona SN: 1 000 000 / (√3 × 20 000) ≈ 28,9 A.', answer: 'Napięcie rośnie 25 razy, a prąd maleje około 25 razy przy tej samej mocy pozornej. Rzeczywisty transformator ma straty i ograniczenia znamionowe; nie wytwarza dodatkowej energii.' },
    sources: [
      source('ABB: budowa i odmiany transformatorów mocy', 'https://new.abb.com/docs/librariesprovider27/default-document-library/abb-transformerstations_ebook.pdf'),
      source('Hitachi Energy: izolacja, przepusty i komponenty', 'https://www.hitachienergy.com/products-and-solutions/insulation-and-components/transformer-insulation-components'),
      source('ABB: przełącznik zaczepów i zmiana przekładni', 'https://new.abb.com/news/detail/49268/abbs-innovative-transformer-component-design-simplifies-manufacturing-increases-reliability'),
    ],
  },
  {
    id: 'inverter', title: 'Falownik fotowoltaiczny',
    intro: 'Falownik łączy źródło DC o zmiennych warunkach pracy z siecią AC. Steruje poborem mocy z modułów oraz przebiegiem prądu oddawanego do sieci.',
    principle: 'Pomiary zasilają algorytmy sterowania, a półprzewodniki przełączają tor mocy. MPPT szuka korzystnego punktu pracy PV, podczas gdy mostek i filtr realizują przekształcanie DC/AC.',
    scope: 'Pokazujemy bloki funkcjonalne falownika sieciowego, nie płytę konkretnego producenta. MPPT jest algorytmem, a wydzielony stopień DC/DC jest rozwiązaniem zależnym od topologii, nie obowiązkową częścią każdego falownika.',
    parts: [
      part('input', 'Wejścia i pomiary DC', 'Przyjmują energię stringów i dostarczają informację o ich napięciu oraz prądzie.', 'Czujniki zamieniają wielkości elektryczne na sygnały wykorzystywane przez sterownik.', 'Kilka gniazd nie musi oznaczać takiej samej liczby niezależnych trackerów MPPT.', 'Równe napięcie dwóch wejść nie dowodzi, że ich prądy ani moce są równe.'),
      part('mppt', 'Funkcja MPPT', 'Wyszukuje punkt pracy źródła PV zapewniający możliwie dużą dostępną moc.', 'Algorytm analizuje U i I oraz zmienia sterowanie przekształtnikiem, aby szukać maksimum P = U × I.', 'Osobny blok na rysunku oznacza funkcję sterowania, nie obowiązkowy fizyczny moduł.', 'MPPT nie jest synonimem przetwornicy DC/DC i nie odzyska energii promieniowania, której zacienione moduły nie otrzymały.'),
      part('dc-link', 'Obwód pośredni DC-link', 'Zapewnia krótkotrwały bufor energii między etapami przekształcania.', 'Kondensatory przyjmują i oddają ładunek, ograniczając wahania napięcia szyny DC.', 'Cylindry w modelu symbolizują kondensatory, a nie magazyn energii do pracy nocnej.', 'Wyłączenie falownika nie dowodzi natychmiastowego zaniku energii w kondensatorach.'),
      part('bridge', 'Mostek tranzystorowy', 'Przekształca energię z obwodu DC w sterowane impulsy po stronie AC.', 'Tranzystory mocy są szybko przełączane, a modulacja szerokości impulsów PWM kształtuje średni przebieg.', 'Układ sześciu symbolicznych elementów ułatwia wyobrażenie toru trójfazowego; topologie wielopoziomowe są inne.', 'Na wyjściu samych tranzystorów nie powstaje idealna gładka sinusoida.'),
      part('filter', 'Filtr wyjściowy AC', 'Ogranicza składowe wysokiej częstotliwości pochodzące z przełączania.', 'Dławiki i zależnie od topologii kondensatory wygładzają przebieg w torze wyjściowym.', 'Cewki w modelu występują między mostkiem a przyłączem AC.', 'Filtr nie kompensuje dowolnego zakłócenia sieci i nie zastępuje zabezpieczeń.'),
      part('controller', 'Sterownik i nadzór', 'Koordynuje regulację prądu, pomiary i reakcje na warunki pracy.', 'Przetwarza sygnały sieciowe oraz wewnętrzne i wyznacza sterowanie tranzystorami.', 'Płytka sterownika obsługuje sygnały pomiarowe i sterujące; główna moc przepływa przez osobny tor energoelektroniczny.', 'Komunikacja z portalem internetowym nie jest tym samym co lokalna regulacja prądu.'),
      part('cooling', 'Radiator i chłodzenie', 'Usuwa ciepło strat elektroniki mocy.', 'Ciepło przechodzi do radiatora, a następnie do powietrza lub innego medium zależnie od konstrukcji.', 'Radiator znajduje się blisko elementów mocy; wentylator występuje tylko w części konstrukcji.', 'Derating, czyli ograniczenie mocy z powodu warunków pracy, nie musi oznaczać awarii MPPT.'),
    ],
    process: [
      step('Pomiar źródła', ['input', 'controller'], 'Falownik poznaje bieżące napięcie i prąd PV oraz stan sieci.'),
      step('Wybór punktu pracy', ['mppt', 'controller'], 'MPPT wpływa na sterowanie dostępnym torem mocy. Rysunek nie przesądza, czy występuje osobny stopień DC/DC.'),
      step('Przekształcanie', ['dc-link', 'bridge', 'controller'], 'Obwód DC zasila mostek, którego przełączanie jest kontrolowane elektronicznie.'),
      step('Oddanie mocy i strat', ['filter', 'cooling'], 'Filtr ogranicza tętnienia prądu przekazywanego do sieci, a chłodzenie odprowadza straty cieplne.'),
    ],
    example: { question: 'Ile mocy AC i ciepła otrzymamy z 10 kW DC przy chwilowej sprawności 98%?', working: 'P_AC = 10 × 0,98 = 9,8 kW. Straty = 10 − 9,8 = 0,2 kW = 200 W.', answer: 'Do AC trafia 9,8 kW, a około 200 W stanowi stratę wymagającą odprowadzenia. To założony punkt pracy, nie stała sprawność przez cały dzień ani roczny uzysk.' },
    sources: [
      source('SMA: energoelektronika, MPPT, mostek i filtr', 'https://www.sma.de/en/partners/knowledgebase/inverters-power-electronics-for-a-clean-power-supply'),
      source('SMA: funkcje i różne topologie falowników', 'https://www.sma.de/en/partners/knowledgebase/pv-inverters-basic-facts-for-planning-pv-systems'),
      source('Texas Instruments: topologie i sterowanie przekształtników PV', 'https://www.ti.com/lit/wp/spracr6/spracr6.pdf'),
    ],
  },
  {
    id: 'dc', title: 'Łączenie stringów i ochrona DC',
    intro: 'Combiner box zbiera równoległe stringi w większy tor DC. Skrzynka ochronna małej instalacji może prowadzić każdy string osobno i nie wykonywać ich sumowania.',
    principle: 'W równoległych gałęziach sumują się prądy przy wspólnym napięciu. Bezpieczniki, rozłącznik i SPD pełnią różne zadania, a ich obecność wynika z projektu.',
    scope: 'Model pokazuje wyposażony combiner jako przykład rodziny. W mikroinstalacji część funkcji może być w falowniku, a osobne bezpieczniki, szyny sumujące i monitoring nie muszą występować.',
    parts: [
      part('inputs', 'Wejścia stringów', 'Wprowadzają osobne pary przewodów dodatnich i ujemnych.', 'Każdy string ma własny prąd, zanim gałęzie zostaną połączone równolegle.', 'W modelu wejścia mają identyfikatory ułatwiające prześledzenie pochodzenia energii.', 'Stringi podłączone do osobnych MPPT nie są automatycznie wspólnie zrównoleglone.'),
      part('fuses', 'Bezpieczniki stringowe gPV', 'Ograniczają skutki określonych nadprądów, także prądów wstecznych z innych gałęzi.', 'Wkładka topikowa przerywa tor po dostatecznym nagrzaniu, zgodnie ze swoją charakterystyką.', 'Osobne wkładki reprezentują ochronę gałęzi, a nie jeden wspólny bezpiecznik dla wszystkich stringów.', 'Nie każdy string wymaga osobnego bezpiecznika; potrzeba ochrony zależy od możliwego prądu wstecznego i dopuszczeń modułu.'),
      part('busbars', 'Szyny zbiorcze DC', 'Łączą równoległe gałęzie w wspólny tor wyjściowy.', 'Prądy dopływające do wspólnego węzła sumują się zgodnie z bilansem prądu.', 'Model pokazuje osobne szyny dla obu biegunów DC.', 'Połączenie równoległe nie dodaje napięć stringów tak jak połączenie szeregowe modułów.'),
      part('spd', 'Ogranicznik przepięć DC', 'Ogranicza udary napięcia w chronionym układzie PV.', 'Równoległa gałąź SPD przewodzi impuls między przewidzianymi potencjałami, w tym ku układowi ochronnemu.', 'SPD jest odnogą toru, a nie elementem przetwarzającym całą energię stringów.', 'Aparat przeznaczony wyłącznie do AC nie staje się SPD do PV przez zmianę etykiety; liczą się parametry DC i konfiguracja ochrony.'),
      part('isolator', 'Rozłącznik izolacyjny DC', 'Zapewnia przewidziane łączenie i odizolowanie toru DC.', 'Styki i układ gaszenia łuku są zaprojektowane dla określonego napięcia, prądu i konfiguracji biegunów.', 'Jeden symbol obejmuje mechanicznie powiązane tory urządzenia.', 'Rozłącznik nie zastępuje bezpiecznika zwarciowego, a jego otwarcie nie usuwa napięcia w oświetlonych modułach.'),
      part('monitor', 'Pomiar prądów stringów', 'Umożliwia porównanie gałęzi i wykrywanie odchyleń produkcji.', 'Czujniki zamieniają prądy na dane przekazywane do systemu monitoringu.', 'Kanał pomiarowy odpowiada konkretnemu stringowi lub grupie określonej w dokumentacji.', 'Niższy prąd może wynikać z cienia, pogody lub geometrii; pojedynczy odczyt nie identyfikuje uszkodzonego modułu.'),
      part('earth', 'Połączenia ochronne', 'Łączą przewidziane części przewodzące i ochronę przepięciową z układem ochronnym.', 'Tor ochronny pomaga ograniczać różnice potencjałów zgodnie z projektem instalacji.', 'Jego położenie na modelu odróżnia ochronę obudowy od dwóch biegunów mocy DC.', 'Minus stringu nie jest z definicji przewodem PE i nie jest automatycznie uziemiony.'),
    ],
    process: [
      step('Oddzielne gałęzie', ['inputs', 'fuses'], 'Stringi docierają do wejść, a wymagana projektem ochrona nadprądowa obejmuje odpowiednie tory.'),
      step('Sumowanie i pomiar', ['monitor', 'busbars'], 'Monitoring obserwuje gałęzie, a szyny zbierają ich prądy w wariancie z równoległym łączeniem.'),
      step('Wyjście do falownika', ['busbars', 'isolator'], 'Wspólny tor prowadzi moc do falownika przez przewidzianą aparaturę łączeniową.'),
      step('Gałąź przepięciowa', ['spd', 'earth'], 'SPD ogranicza impuls poza normalną ścieżką przesyłu energii. To opis działania, nie instrukcja połączeń.'),
    ],
    example: { question: 'Jaką moc zbierają cztery równoległe stringi, gdy każdy pracuje przy 600 V i 10 A?', working: 'I_suma = 4 × 10 = 40 A. Napięcie wspólne U = 600 V. P = 600 × 40 = 24 000 W = 24 kW.', answer: 'Otrzymujemy 24 kW DC przed stratami. Napięcie pozostaje 600 V, a nie 2400 V; założono zgodne napięcia pracy i identyczne warunki gałęzi.' },
    sources: [
      source('Phoenix Contact: warianty string combiner box', 'https://www.phoenixcontact.com/en-de/products/surge-protection/surge-protection-for-photovoltaic-systems/string-combiner-boxes-for-photovoltaic-systems?p=11'),
      source('Schneider Electric: ochrona PV i prądy wsteczne', 'https://www.electrical-installation.org/enwiki/PV_System%3A_how_to_ensure_safety_during_normal_operation'),
      source('Phoenix Contact: monitoring i ochrona PV', 'https://blog.phoenixcontact.com/marketing-gb/embrace-power-from-the-sun/'),
    ],
  },
  {
    id: 'metering', title: 'Układ pomiaru energii',
    intro: 'Licznik mierzy przepływ energii w określonej granicy instalacji. Odrębne rejestry mogą gromadzić import i eksport, więc miejsce pomiaru jest równie ważne jak sam odczyt.',
    principle: 'Układ próbkuje napięcie i prąd, oblicza moc, a następnie sumuje jej udział w czasie. Dane pomiarowe trafiają do rejestrów i opcjonalnego systemu zdalnego odczytu.',
    scope: 'To schemat funkcji licznika elektronicznego. Dom może mieć pomiar bezpośredni, a POI farmy pomiar przez CT i przekładniki napięciowe; punkt przyłączenia obejmuje także urządzenia poza pokazanym licznikiem.',
    parts: [
      part('voltage', 'Tor pomiaru napięcia', 'Dostarcza informację o przebiegu napięcia odpowiednich faz.', 'Sygnał jest skalowany do zakresu elektroniki, a w pomiarze pośrednim pochodzi z przekładnika napięciowego.', 'Blok przedstawia pomiar wielkości, a nie odbiornik całej mocy farmy.', 'Sama znajomość napięcia nie wystarcza do obliczenia pobranej energii.'),
      part('current', 'Tor pomiaru prądu', 'Dostarcza informację o wartości, przebiegu i kierunku prądu.', 'Zależnie od licznika używa toru bezpośredniego lub zewnętrznych przekładników CT o określonej przekładni.', 'W wariancie pośrednim do elektroniki dociera sygnał odpowiadający prądowi głównemu.', 'Klasyczny CT nie może mieć otwartego wtórnego obwodu przy prądzie pierwotnym, ponieważ może powstać niebezpieczne napięcie.'),
      part('processor', 'Procesor pomiarowy', 'Wyznacza moc i energię z próbek sygnałów elektrycznych.', 'Dla mocy czynnej uśrednia iloczyny odpowiadających sobie chwilowych próbek napięcia i prądu.', 'Procesor łączy dane obu torów; w układzie trójfazowym uwzględnia odpowiednie fazy.', 'Samo mnożenie wartości skutecznych U i I daje moc pozorną, a nie zawsze moc czynną.'),
      part('registers', 'Rejestry energii', 'Przechowują narastające wartości energii w ustalonych kategoriach.', 'Całkowanie mocy w czasie zwiększa odpowiedni rejestr, np. importu lub eksportu.', 'Różnica dwóch odczytów tego samego rejestru opisuje energię pomiędzy ich chwilami.', 'kW to moc, a kWh to energia; eksport z licznika nie jest automatycznie całą produkcją PV.'),
      part('communications', 'Komunikacja i odczyt', 'Udostępnia wyniki operatorowi, lokalnemu sterownikowi lub systemowi danych.', 'Interfejs przenosi odczyty i znaczniki czasu zgodnie z protokołem konkretnego licznika.', 'Linia danych opuszcza licznik niezależnie od głównego toru przesyłu energii.', 'Przerwa w zdalnym odczycie nie dowodzi przerwy w lokalnym pomiarze ani produkcji.'),
    ],
    process: [
      step('Zebranie sygnałów', ['voltage', 'current'], 'Układ pozyskuje przebiegi napięcia i prądu po uwzględnieniu właściwych przekładni pomiarowych.'),
      step('Obliczenie mocy', ['processor'], 'Z odpowiednich próbek wyznaczana jest moc i jej kierunek zgodnie z konfiguracją pomiaru.'),
      step('Sumowanie energii', ['processor', 'registers'], 'Energia narasta w czasie, a import i eksport mogą być zapisywane w osobnych rejestrach.'),
      step('Udostępnienie wyniku', ['registers', 'communications'], 'Odczyt ma znaczenie razem z jednostką, okresem, kierunkiem i miejscem pomiaru.'),
    ],
    example: { question: 'PV wytwarza stale 5 kW, a dom zużywa stale 2 kW przez dwie godziny. Co zarejestruje licznik na granicy z siecią?', working: 'Eksport P = 5 − 2 = 3 kW. Energia eksportu E = 3 × 2 = 6 kWh. Produkcja PV = 5 × 2 = 10 kWh, a zużycie lokalne = 2 × 2 = 4 kWh.', answer: 'Eksport wzrośnie o 6 kWh, mimo produkcji 10 kWh. Założono brak magazynu, strat i zmian mocy; sam licznik graniczny nie pokazuje 4 kWh autokonsumpcji.' },
    sources: [
      source('Texas Instruments: obliczanie mocy i akumulacja energii', 'https://software-dl.ti.com/msp430/esd/MSPM0-SDK/2_00_00_03/docs/chinese/middleware/energy_metrology/doc_guide/doc_guide-srcs/Energy_Metrology_Library_CN.html'),
      source('Janitza: pomiar bezpośredni, przekładnikowy i interfejsy liczników', 'https://energymeters.janitza.com/'),
      source('Janitza: instrukcja licznika przekładnikowego', 'https://assets.janitza.com/ce18jq9ih0x6/StWQwJebUTJtd8YkzVQ5a/e9ad3e333249f171f92a0c33749985e2/janitza-emd485-ct3a-inst-en.pdf'),
    ],
  },
];

const aliases = new Map([
  ['ac-switchboard', 'switchboard'], ['lv-switchboard', 'switchboard'], ['mv-switchgear', 'mv'],
  ['transformer', 'transformer'], ['grid-transformer', 'transformer'], ['inverter', 'inverter'],
  ['dc-protection', 'dc'], ['combiner', 'dc'], ['meter', 'metering'], ['poi', 'metering'],
]);

export function getEquipmentAnatomy(componentId, modeId) {
  const anatomy = equipmentAnatomies.find((item) => item.id === aliases.get(componentId));
  if (!anatomy) return null;
  const context = modeId === 'micro'
    ? 'Kontekst mikroinstalacji: model wyjaśnia funkcje; część wyposażenia może być zintegrowana, a transformator zwykle należy do sieci operatora.'
    : modeId === 'utility'
      ? 'Kontekst farmy: rzeczywiste poziomy napięcia, aparaty i granice pomiarowe określają projekt oraz warunki przyłączenia.'
      : '';
  return context ? { ...anatomy, scope: `${anatomy.scope} ${context}` } : anatomy;
}
