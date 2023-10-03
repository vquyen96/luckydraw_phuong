$(document).ready(function(){

    var listCustomer = localStorage.getItem("listCustomer");
    listCustomer = JSON.parse(listCustomer);
    //btn show setting
    $(document).on("click", ".settingIcon", function(){
        $(".settingMain").slideToggle();
    });
    $(document).on("click", ".listNumIcon", function(){
        $(".listNumMain").slideToggle();
    });

    $(document).on("click", ".mainRandomClear", function(){
        for (let i = 0; i < maxSize; i++) {
            $(".mainRandomBorderItem").eq(i).text("0");
        }
    });


    $(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode === 13){
            if ($(".modal").is(':visible')) {
                $(".modal").modal('hide');
            } else if ($('.mainRandomButtonRun').css('display') !== 'none') {
                $('.mainRandomButtonRun').click();
            } else {
                $('.mainRandomButtonStop').click();
            }
        }
    });

    //get max limit
    var max = localStorage.getItem("max");
    var maxSize = localStorage.getItem("maxSize");
    if (max == null) {
        max = 99;
        localStorage.setItem("max", max);
        location.reload();
    }
    if (maxSize == null) {
        maxSize = max.toString().length;
    }


    generateDisplayBox(maxSize);
    displayNumber(max);
    $("input[name='max']").val(max);
    $("input[name='maxSize']").val(maxSize);


    //get list number
    var listNum = localStorage.getItem("listNum");
    listNum != null && listNum !== "" ? listNum = listNum.split(",") : listNum = [];
    updateListNumHTML();

    var isDisplay = localStorage.getItem("displayModal");
    if (isDisplay == null || isDisplay == "true") {
        $(".listNumMainShowModal input[type='checkbox']").attr('checked', true);
    }

    //get pass is selected
    var pass = localStorage.getItem("pass");

    pass != null && pass != "" ? pass = pass.split(",") : pass = [];
    for (var i = 0; i < pass.length; i++) pass[i] = parseInt(pass[i]);
    $("input[name='pass']").val(pass.toString());

    var isAutoPass = localStorage.getItem("auto_pass");
    if (isAutoPass == null || isAutoPass === "true") {
        $(".autoPassNumber input[type='checkbox']").attr('checked','checked')
    }

    var ran = 0;
    var ranGen = 0;
    var runRandomInterval;
    var stepToStopInterval;

    $(".mainRandomButtonRun").click(function(){
        runRandom(maxSize);
        $(this).hide();
        $(this).next().show();
    });

    function runRandom(size) {
        console.log(pass)
        runRandomInterval = setInterval(function(){
            do{
                ranGen = Math.floor((Math.random() * max) + 1);
            }
            while(pass.indexOf(ranGen) !== -1 || listNum.indexOf(numberToString(ranGen)) !== -1);
            displayNumber(ranGen, size);
        }, 50);
    }

    function addPassNumber(number) {
        var isAutoPass = localStorage.getItem("auto_pass");
        if (isAutoPass == null || isAutoPass == "true") {
            console.log(pass)
            pass.push(number)
            localStorage.setItem("pass", pass.toString());
            $("input[name='pass']").val(pass.toString());
        }
    }


    $(".mainRandomButtonStop").click(function(){
        // alert(ran);
        $(".mainRandomButtonStop").hide();
        $(".mainRandomButtonWaiting").show();
        ran = ranGen;
        //
        // runRandom(maxSize-1);
        var i = 1;
        clearInterval(runRandomInterval);
        displayNumber(ran, maxSize);
        runRandom(maxSize-i);
        i++;
        stepToStopInterval = setInterval(function(){
            clearInterval(runRandomInterval);
            displayNumber(ran, maxSize);
            runRandom(maxSize-i);
            i++;
            if(maxSize < i) {
                clearInterval(stepToStopInterval);
                $(".mainRandomButtonWaiting").hide();
                $(".mainRandomButtonRun").show();

                var nameCustomer = findNameById(ran);
                showModal(ran, nameCustomer);
                $(".nameOfCustomerContent").text(nameCustomer);
                addNumberToList(ran);
                addPassNumber(ran)
            }
            console.log(i);
        }, 800);
    });

    $(document).on("click", ".btnListNum", function(){
        $('.listNum').toggle();
    });

     $(document).on("click", ".btnResetNumber", function(){
         console.log("btn-reset-number");
        $('.mainRandomBorderItem').text(0);
        $('.nameOfCustomerContent').text("Người may mắn");
    });


    //save config
    $(document).on("click", ".btnSbm", function(){
        var fileUpload = $("#fileUpload")[0];

        if (fileUpload.value != null && fileUpload.value !== "" && fileUpload.files.length !== 0) {
            uploadFile(fileUpload);
        }

        setTimeout(function () {
            var maxInput = $("input[name='max']").val();
            if (maxInput == null || maxInput === "") {
                if (listCustomer != null && listCustomer.length !== 0) {
                    max = listCustomer[listCustomer.length - 1].stt;
                    $("input[name='max']").val(max);
                }
            } else {
                max = maxInput;
            }
            localStorage.setItem("max", max);
            var maxSizeInput = $("input[name='maxSize']").val();
            console.log(maxSizeInput);
            if (maxSizeInput == null || maxSizeInput === "") {
                maxSize = max.toString().length;
                $("input[name='maxSize']").val(maxSize);
            } else {
                maxSize = maxSizeInput;
            }
            localStorage.setItem("maxSize", maxSize);

            generateDisplayBox(maxSize);
            displayNumber(max);
            pass = generatePass($("input[name='pass']").val());
        }, 100);
    });

    //Delete all list
    $(document).on("click", ".listNumMainDeleteAll", function(){
        if (confirm("Bạn muốn xóa tất cả ?")) {
            listNum = [];
            updateListNumHTML();
        }
    });

    $(".listNumMainShowModal input[type='checkbox']").change(function() {
        if(this.checked) {
            localStorage.setItem("displayModal", true);
        } else {
            localStorage.setItem("displayModal", false);
        }
    });

    $(".autoPassNumber input[type='checkbox']").change(function() {
        if(this.checked) {
            localStorage.setItem("auto_pass", true);
        } else {
            localStorage.setItem("auto_pass", false);
        }
    });

    if ($(this).is(":checked")) {
        selected.push($(this).attr('name'));
    }


    //Delete item list
    $(document).on("click", ".listNumMainDeleteItem", function(){
        var itemIndex = $(this).parent().index();
        var itemLength = $(".listNumMainDeleteItem").length;
        listNum.splice(itemLength-itemIndex-1, 1);
        updateListNumHTML();
    });

    function generatePass(passStr) {
        var passArr = [];
        if (passStr != null && passStr != "") {
            localStorage.setItem("pass", passStr);
            passArr = passStr.split(",");
            console.log(passArr);
            for (var i = 0; i < passArr.length; i++) passArr[i] = parseInt(passArr[i]);
            $("input[name='pass']").val(passArr.toString());
        }
        return passArr;
    }

    function generateDisplayBox(size) {
        var str = "";
        for (let i = 0; i < size; i++) {
            str += "<div class=\"mainRandomBorderItem\">0</div>";
        }
        $(".mainRandomBorder").html(str);
    }

    function displayNumber(number, size) {
        number = numberToString (number);
        for (let i = 0; i < size; i++) {
            var str = number.substring(i, i+1);
            $(".mainRandomBorderItem").eq(i).text(str);
        }
    }

    function numberToString (number) {
        var numPlus = "";
        number = number.toString();

        for (let i = number.length; i < maxSize; i++) {
            numPlus += "0";
        }
        return numPlus + number;
    }

    function showModal(number, name) {
        var isDisplay = localStorage.getItem("displayModal");
        if (isDisplay == null || isDisplay == "true") {
            $(".modal-body h1").text(numberToString(number));
            $(".modal-body h2").text(name);
            $(".modal").modal();
        }
    }

    function addNumberToList (number) {
        console.log(number);
        listNum.push(numberToString (number));
        updateListNumHTML();
    }

    function updateListNumHTML(){
        var timeComplete = 500;
        localStorage.setItem("listNum", listNum);
        list_li = "";
        listNumLength = listNum.length;
        console.log(listNumLength);
        for (var i = listNumLength; i > 0 ; i--) {
            list_li += "<li>" +
                    "<div>"+listNum[i-1]+"</div>" +
                    "<div>"+findNameById(listNum[i-1])+"</div>" +
                    "<div class='listNumMainDeleteItem'>" +
                        "<i class='far fa-times-circle'></i>" +
                    "</div>" +
                "</li>";
        }
        $(".listNumMain ul").html(list_li);
    }

    function findNameById(id) {
        var stt = parseInt(id).toString();
        if(listCustomer != null) {
            var filtered = listCustomer.filter(function(el) {
                return el.stt === stt;
            });
            if(filtered.length !== 0) {
                return filtered[0].name;
            }
        }

        return "Không có";
    }

    function uploadFile(fileUpload) {

            //Validate whether File is valid Excel file.
        var regex = /^([a-zA-Z0-9\s_\\.\-:\)\(])+(.xls|.xlsx)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();

                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        ProcessExcel(e.target.result);
                    };
                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        console.log(data);
                        ProcessExcel(data);
                    };
                    reader.readAsArrayBuffer(fileUpload.files[0]);
                }
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid Excel file.");
        }
    }
    
    function ProcessExcel(data) {
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
 
        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];
 
        //Read all rows from First Sheet into an JSON array.
        listCustomer = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

        console.log(listCustomer);
        localStorage.setItem("listCustomer", JSON.stringify(listCustomer));

        
    };
});