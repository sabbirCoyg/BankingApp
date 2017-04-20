/* 
 * @author Yasushi Akiyama
 */


//##############################################
var SERVER_URL = 'http://localhost:8225';
//##############################################

var ANUM_LENGTH = 9;


//$("body").ready(function () {

$('#transaction').click(showTransactions);

$('#deposit').click(function () {
    $.mobile.changePage("#depositPage");
    $("#depositTable").empty();//clear the table
});

$("#depositButton").click(deposit);

$('#withdraw').click(function () {
    $.mobile.changePage("#withdrawPage");
    $("#withdrawTable").empty();//clear the table
});

$("#withdrawButton").click(withdraw);

//adding the back button and the footer
$(".nonmenu").append("<a data-role='button' data-inline='true' "
        + "href='#menuPage' data-icon='back'>Go back to menu</a>");

$(".page").append("<div data-role='footer'>"
        + "<center>Developed By Yasush</center></div>");

//});


//add the table header and specify table properties
function initTable(table) {//table is a jQ obj
    //Initializing the table
    table.html(
            "   <tr>" +
            "     <th>Date/Time</th>" +
            "     <th>Operation</th>" +
            "     <th>Amount ($)</th>" +
            "     <th>Balance ($)</th>" +
            "   </tr>"
            );
    table.attr("border", "1");
    table.attr("width", "100%");
}//end initTable()


//add a single row with the record
function addRow(table, record) {//table is a jQ obj
    table.append(
            "<tr style='text-align:right'><td>" + record.Date + "</td>"
            + "<td>" + record.Op + "</td>"
            + "<td>" + parseFloat(record.Amount).toFixed(2) + "</td>"
            + "<td>" + parseFloat(record.Balance).toFixed(2) + "</td>"
            + "</tr>"
            );
}//end addRow()


function showTransactions() {

    $.post(SERVER_URL + '/getTransactions',
//                    null, //you can also pass an empty string etc
            function (transactions) {

                if (transactions == null || transactions.length == 0) {
                    //no record whatsoever, let the user know
                    alert("No record found");
                }
                else {
//                    alert('Records downloaded successfully!');


                    initTable($("#transactinTable"))


                    //go through each record
                    for (var i = 0; i < transactions.length; i++) {
                        addRow($("#transactinTable"), transactions[i]);
                    }//end for

                    $.mobile.changePage("#transactionPage");

                }//end else                        

            }).fail(function (error) {
        alert(error.responseText);
    });

}//end showTransactions()



//check the value entered
function validate(amount) {
//    console.log(amount);

    if (amount == "" || amount <= 0 || isNaN(amount)) {
        alert("Please enter a positive amount.");
        return false;
    }//end if-else
    //else
    return true;
    
}//end validate()




//these 2 functions deposit() and withdraw() can be combined and have some 
//conditional statements to differenciate the 2 operations. You may reduce
//a few lines in that way since there are several duplicate lines/operations
function deposit() {

    //validation
    if (!validate($("#depositAmount").val())) {
        $("#depositAmount").focus();
        return;
    }//end if

    var datetime = (new Date($.now())).toLocaleString();
    var record = {
        "Date": datetime,
        "Op": "Deposit",
        "Amount": $("#depositAmount").val()
    };

    $.post(SERVER_URL + '/addRecordWithBalance', //'/addRecord',
            record,
            function (transactions) {

                if (transactions == null || transactions.length == 0) {
                    //no record whatsoever, let the user know
                    alert("Deposit failed.");
                }
                else {

                    //feedback
                    alert("Deposit completed.");

                    //clear the input
                    $("#depositAmount").val("");

                    initTable($("#depositTable"));

                    //add the last one
                    addRow($("#depositTable"),
                            transactions[transactions.length - 1]);

                }//end else                        

            }).fail(function (error) {
        alert(error.responseText);
    });
}//end deposit()




function withdraw() {

    //validation
    if (!validate($("#withdrawAmount").val())) {
        $("#withdrawAmount").focus();
        return;
    }//end if

    var datetime = (new Date($.now())).toLocaleString();
    var record = {
        "Date": datetime,
        "Op": "Withdraw",
        "Amount": -$("#withdrawAmount").val()
    };

    $.post(SERVER_URL + '/addRecordWithBalance', //'/addRecord',
            record,
            function (transactions) {

                if (transactions == null || transactions.length == 0) {
                    //no record whatsoever, let the user know
                    alert("Withdrawal failed.");
                }
                else {

                    //feedback
                    alert("Withdrawal completed.");

                    //clear the input
                    $("#withdrawAmount").val("");

                    initTable($("#withdrawTable"));

                    addRow($("#withdrawTable"),
                            transactions[transactions.length - 1]);

                }//end else                        

            }).fail(function (error) {
        alert(error.responseText);
    });
}//end withdraw()





