# Code-Design-Bot
A discord bot for the code+design community

## Server Roles
- Orga
- Coach
- Tech - Coach
- Team - Coach
- Teilnehmer    // mit TN abgekürzt
- Bots
- YYMM-LOC // für jedes camp z.B. 2106-ruhr

## Channel Structure
### Community
- Sichtbare Kategorie für ganze Community

#### Allgemein
- Willkommensnachricht
- Regeln
- Server Struktur
- Weitere Hinweise
#### Ankündigungen
- Ankündigung von unseren Veranstaltungen oder von Partnern
#### Angebote
- Jeder kann hier Angebote zu Praktika, Einsteiger-Jobs, anderen Kursen und Workshops oder spannende Links reinposten
#### Random
- Channel für alles andere

### Camp
- Agenda
    - Orga postet die Agenda
    - TN und Coaches Lesezugriff
- Workshops
    - Eine Nachricht wo alle Workshops vorgestellt werden + Reaction-Channel-Poll
    - TN Lesezugriff
    - Coaches Schreibrechte
- Workshop-Topic
  - Ein Workshop Channel zu dem Thema.
  - Alle Coaches + ausgewählte TN Schreibrechte
  - Verlinkter Channel der Reaction-Channel-Poll
- Teams
    - Vorstellung des Orga Teams
    - Vorstellung des Team und Tech Coach Teams
    - Eine Nachricht wo alle Teams aufgelistet und zu den Coaches zugeordnet werden + Reaction-Channel-Poll
    - Team Beispiel: `🐧 Coderlino - Portal für Coder - @GeneralMine`
- Team-Name
    - Coach erstellt Eintrag in Reaction-Channel-Poll
    - Alle Coaches + ausgewählte TN Schreibrechte
- Fragen
    - an Tech, Team Coaches oder Orga
- Feedback
    - Konstruktive Kritik Hinweis
- Random
    - für alles

## Features

### Create Camp
Erstellt eine Camp Kategorie mit den Channeln nach dem Camp Schema

### Reaction-Channel-Poll

Message:
```
Dies ist eine Testnachricht. Völlig Wurscht was hier kommt. Das sind die Teams:
🐧  **Coderlino** - Portal für Coder - @GeneralMine
🚀  **RocketGoBrrrr** - Portal für Coder - @GeneralMine
🎶  **Musicer** - Portal für Coder - @GeneralMine
```
[🐧] [🚀] [🎶]

Bei Reaction auf eines der Emoji wird Client dem spezifischen Channel hinzugefügt
Wenn der Channel noch nicht existiert, erzeuge ihn nach folgendem Schema `Team-<Name>`