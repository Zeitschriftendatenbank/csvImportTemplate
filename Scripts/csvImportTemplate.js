function zdb_csvImportTemplate() {
    if (false == ZDB.checkScreen(['8A', '7A', 'IT', 'IE'], 'AutomatischeSuchBox')) return false;
    showDialog('ProfD\\csvImportTemplate\\dialogCsvImportTemplate.html', 200, 200, 600, 600);
}

function __zdb_csvImportTemplate_load(dir) {
    try {
        var arNames = [];
        var theDir = getSpecialDirectory("ProfD");
        theDir.append(dir);
        if (theDir.exists()) {
            var theDirEnum = theDir.directoryEntries;
            while (theDirEnum.hasMoreElements()) {
                var theItem = theDirEnum.getNext();
                if (theItem.isFile()) {
                    var found,
                        i;
                    for (found = false, i = 0; (i < arNames.length) && !found; i++) {
                        found = (arNames[i] == theItem.leafName);
                    }
                    if (!found) {
                        arNames.push(theItem.leafName);
                    }
                }
            }
        }
        return arNames.sort();
    } catch (e) { alert('LoadFiles mit Fehler: ' + e); }
}

function __zdb_csvImportTemplate_loadDatenmasken() {
    utility.sentDataToDialog(__zdb_csvImportTemplate_load("datenmasken_eigene").join('@@@'));
}
function __zdb_csvImportTemplate_loadCsv() {
    utility.sentDataToDialog(__zdb_csvImportTemplate_load('import').join('@@@'));
}

function __zdb_csvImportTemplate_runImport(o) {
    var theFileInput = utility.newFileInput(),
        norm = '',
        counter = 1,
        header,
        template,
        csv = new CSV();

    var paths = [
        "\\datenmasken_eigene\\",
        "\\datenmasken_kxp\\",
        "\\datenmasken_zdb\\"
    ];
    var found = false;
    for (var i = 0; i < paths.length; i++) {
        if (theFileInput.openSpecial("ProfD", paths[i] + o.idFileListdatenmasken)) {
            found = true;
            break;
        }
    }
    if (!found) {
        throw "Datei " + o.idFileListdatenmasken + " wurde nicht gefunden.";
    }
    for (template = ""; !theFileInput.isEOF();) {
        template += theFileInput.readLine() + "\n"
    }
    theFileInput.close();

    var importer = function () {
        var fillTemplate = function (template, line) {
            //__zeigeEigenschaften(line);
            for (var col in line) {
                if (!line.hasOwnProperty(col)) continue;
                if ('' == col) continue;
                var re = new RegExp('\\{([^{]*?)@' + col.replace('$', '\\$') + '@([^{]*?)}|\\{' + col.replace('$', '\\$') + '}', "g");
                if ('' == line[col]) {
                    template = template.replace(re, "");
                } else {
                    template = template.replace(re, "$1" + line[col] + "$2");
                }
            }
            return template;
        };
        activeWindow.command("e" + norm, false);
        csv.line['##'] = counter++;
        activeWindow.title.insertText(fillTemplate(template, csv.line));
        if ('false' == o.idCheckboxTest) csv.__csvSaveBuffer(true, 'Importiere Template mit Zähler ' + counter);
    };


    csv.csvFilename = o.idFileListcsv;
    csv.delimiter = ('t' == o.separator) ? "\t" : o.separator;
    csv.startLine = o.start || 2;
    if ('true' == o.idCheckboxTest) {
        csv.endLine = csv.startLine;
    }
    norm = ('true' == o.idCheckboxNorm) ? ' n' : '';
    counter = o.counter;
    header = csv.__csvGetHeader();
    csv.__csvSetProperties(importer, header, '', false, false, false, 'LOG_isil_import.txt');
    csv.__csvAPI();
}