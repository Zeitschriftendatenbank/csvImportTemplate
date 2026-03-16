# WinIBW Funktion CSV-Template-Import

**Carsten Klee**  
**12.05.2025**

## Zweck der Funktion

Die Ausgangslage ist eine CSV/SSV/TSV-Datei von zu importierenden Daten.  
Für den Import kann eine Datenmaske / ein Template erstellt werden, welches Platzhalter für die Daten aus der Datei hat.  
Das ausgefüllte Template kann so direkt und automatisiert ins System übernommen werden.

## Abhängigkeiten

Die Funktion CSV-Template-Import ist abhängig von der ZDB-CSV-Library.

## Die Importdatei

Die Importdatei muss eine UTF-8 kodierte Datei mit Trennzeichen (Komma, Semikolon oder Tab) getrennten Daten sein.  
Sie muss eine Kopfzeile haben, welche die Namen der Spalten enthält.  
Die Namen der Spalten finden sich als Platzhalter im Template wieder.

## Das Template / Die Datenmaske

Der Inhalt ist das Template, ein vollständiger Datensatz mit Platzhaltern an den entsprechenden Stellen, an dem die Inhalte der Importdatei eingefügt werden sollen. Das Template muss im Ordner 'datenmaseken_eigene' abgelegt sein.

Die Platzhalter haben entweder die Form `{NameDerSpalte}` oder, wenn der Kontext abhängig vom Vorhandensein des Werts ein- oder ausgeblendet werden soll:  
`{Kontext1 @NameDerSpalte@ Kontext2}`.

### Beispiel 1 (einfacher Platzhalter):

Der Wert der Spalte „Name“ ist immer vorhanden. Im Template steht:

`110 {Name}`

Die Kategorienbezeichnung „110“ ist ein statischer Kontext.

### Beispiel 2 (Platzhalter mit Kontext):

Der Wert der Spalte „Homepage-URL“ ist nicht immer besetzt. Im Template steht:

`{865 $u@Homepage-URL@$zA}`

Sollte keine Homepage-URL vorhanden sein, so würde der Kontext `856 $u`, sowie der Kontext `$zA` nicht mit übernommen werden.  
In den geschweiften Klammern darf immer nur ein `@SpaltenName@` stehen.

Es gibt einen Sonder-Platzhalter in der Form `{##}`.  
Dieser wird während des Imports durch eine aufsteigende Zahl ersetzt.

## Testen und Importieren

Wenn die Funktion `csvImportTemplate` ausgeführt wurde, erscheint ein Formular, in dem zunächst die Datenmaske, dann die Importdatei und das Trennzeichen der Importdatei selektiert werden muss.

Wenn zunächst getestet werden soll, muss der Haken bei **„Generiere Testdatensatz!“** bestehen bleiben.

Soll ein Normdatensatz (z. B. auch ISIL-Datensatz) erzeugt werden, muss der Haken bei **„Generiere Normdaten“** gesetzt werden.

Zudem kann die Zahl, die hochgezählt wird und den Platzhalter `${##}` ersetzt, bestimmt werden.

Bei einem Test wird nur die erste Zeile nach der Kopfzeile mit dem Template zu einem Datensatz verschmolzen und in den Korrekturmodus eingefügt.  
Der Datensatz wird **nicht automatisch abgespeichert**.

Soll kein Test mehr stattfinden, werden Datensätze für alle Zeilen in der Importdatei erzeugt und gespeichert.

Es gibt ein Logging in der Datei `LOG_isil_import.txt` im Anwenderverzeichnis unter `/listen`.
