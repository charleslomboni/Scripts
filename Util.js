/// <reference path="http://localhost:63087/js/jquery-1.10.2.min.js" />
/// <reference path="http://localhost:63087/js/jquery.SPServices-2013.01.min.js" />

$(document).ready(function () {
    //var currentSite = $().SPServices.SPGetCurrentSite();
    var ctx = new SP.ClientContext.get_current();

});


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
    var ctx = new SP.ClientContext.get_current();
    item = ctx
        .get_web()
        .get_lists()
        .getByTitle(listTitle)
        .getItemById(idItem);

    item.deleteObject();
    ctx.executeQueryAsync(function () {
        console.log("ID item deletado: " + get_item(idItem));
    });
}

function RetrieveItem(listTitle) {
    var ctx = new SP.ClientContext.get_current();
    var web = ctx.get_web(),
        list = web.get_lists().getByTitle(listTitle),
        items = list.getItems('');

    var item = ctx.loadQuery(items);
    ctx.executeQueryAsync(function () {
        item.forEach(function (itm) {
            console.log("Item: ", itm.get_fieldValues());
        });
    });
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
                console.log("Item " + idItem + ": ", itm.get_fieldValues());
            }
        });
    });
}
