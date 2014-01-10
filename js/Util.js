/// <reference path="http://localhost:63087/js/jquery-1.10.2.min.js" />
/// <reference path="http://localhost:63087/js/jquery.SPServices-2013.01.min.js" />

$(document).ready(function () {

});


//======================================================= PEGA OS ARGUMENTOS DOS TEXTBOXES
function argInsert() {
    $("#argsI").val($("#txtNomeLista").val() + ";" + $("#txtInternalName").val() + ";" + $("#txtTexto").val());
}
function argUpdate() {
    $("#argsU").val($("#txtNomeLista").val() + ";" + $("#txtID").val() + ";" + $("#txtInternalName").val() + ";" + $("#txtTexto").val());
}
function argDelete() {
    $("#argsD").val($("#txtNomeLista").val() + ";" + $("#txtID").val());
}
function argRetrieve() {
    $("#argsR").val($("#txtNomeLista").val() + ";");
}
function argRetrieveID() {
    $("#argsRID").val($("#txtNomeLista").val() + ";" + $("#txtID").val());
}
//======================================================= PEGA OS ARGUMENTOS DOS TEXTBOXES


//======================================================= CRUD
function CRUD(tipo, args) {

    var argSplit = args.split(";");

    switch (tipo) {
        case "Insert":
            InsertItem(argSplit[0], argSplit[1], argSplit[2]);
            break;
        case "Update":
            UpdateItem(argSplit[0], argSplit[1], argSplit[2], argSplit[3]);
            break;
        case "Delete":
            DeleteItem(argSplit[0], argSplit[1]);
            break;
        case "Retrieve":
            RetrieveItem(argSplit[0]);
            break;
        case "RetrieveID":
            RetrieveItemID(argSplit[0], argSplit[1]);
            break;
        default:
            console.log("Parametros incorretos!");
            break;
    }
}


function InsertItem(listTitle, internalNameItem, itemData) {
    var ctx = new SP.ClientContext.get_current();
    var list = ctx
            .get_web()
            .get_lists()
            .getByTitle(listTitle);

    // create a new item on the list
    var item = list.addItem(new SP.ListItemCreationInformation());
    item.set_item(internalNameItem, itemData);
    item.update();

    ctx.executeQueryAsync(function () {
        console.log("Item criado: " + item.get_item(internalNameItem));
    }, function () {
        console.log("Erro!");
    });
}

function UpdateItem(listTitle, idItem, internalNameItem, itemData) {
    var ctx = new SP.ClientContext.get_current();
    item = ctx
        .get_web()
        .get_lists()
        .getByTitle(listTitle)
        .getItemById(idItem);

    item.set_item(internalNameItem, itemData);
    item.update();

    ctx.executeQueryAsync(function () {
        console.log("Novo valor: ", item.get_item(internalNameItem));
    });
}

function DeleteItem(listTitle, idItem) {
    var itemDeletado = get_item(idItem);
    var ctx = new SP.ClientContext.get_current();
    item = ctx
        .get_web()
        .get_lists()
        .getByTitle(listTitle)
        .getItemById(idItem);

    item.deleteObject();
    ctx.executeQueryAsync(function () {
        console.log("ID item deletado: " + itemDeletado);
    });
}

function RetrieveItem(listTitle) {
    var ctx = new SP.ClientContext.get_current();
    var web = ctx.get_web(),
        list = web.get_lists().getByTitle(listTitle),
        items = list.getItems('');

    var item = ctx.loadQuery(items);
    MontaTabela(ctx, item);
}

function RetrieveItemID(listTitle, idItem) {
    var ctx = new SP.ClientContext.get_current();
    var web = ctx.get_web(),
        list = web.get_lists().getByTitle(listTitle),
        items = list.getItems('');

    var item = ctx.loadQuery(items);
    ctx.executeQueryAsync(function () {
        item.forEach(function (itm) {
            if (parseInt(itm.get_item("ID")) === parseInt(idItem)) {
                MontaTabelaID(idItem, itm.get_item("Title"));
                console.log("Item " + idItem + ": ", itm.get_fieldValues());
            }
        });
    });
}
//======================================================= CRUD

//======================================================= MONTA TABELA
function MontaTabela(ctx, item) {

    $("#tabela").append("<table><thead><tr><td>ID</td><td>Title</td></tr></thead><tbody>");

    ctx.executeQueryAsync(function () {
        item.forEach(function (itm) {
            $("#tabela").append("<tr><td>" + itm.get_item("ID") + "</td><td>" + itm.get_item("Title") + "</td></tr>");
            console.log("Item: ", itm.get_fieldValues());
        });
    });

    $("#tabela").append("</tbody></table>");
}

function MontaTabelaID(idItem, titleTitem) {
    $("#tabela").append("<table><thead><tr><td>ID</td><td>Title</td></tr></thead><tr><td>" + idItem + "</td><td>" + titleTitem + "</td></tr></table>");
}
//======================================================= MONTA TABELA
