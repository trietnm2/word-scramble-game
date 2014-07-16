$(document).ready(function() {

    var remainChars = [];
    var typedChars  = [];

    $("#start").on("click", function(event){
        loadNextWord();
    });
    
    $(document).on("keydown", function(event){
    
        //Backspace
        if(event.keyCode == 13){
            $("#submit").click();
        }
        else if(event.keyCode == 8){
            event.preventDefault();
            if(typedChars.length > 0){
                var char = typedChars.pop();
                remainChars.unshift(char);
                
                updateImage("remain", remainChars);
                updateImage("typed", typedChars);
            }
        } 
        else {
            var input = String.fromCharCode(event.keyCode).toLowerCase();
            var index = $.inArray(input, remainChars);
            if(index >= 0){
                remainChars.splice(index,1);
                typedChars.push(input);
                
                updateImage("remain", remainChars);
                updateImage("typed", typedChars);
            }   
        }
        
        //$("#result").empty();
    });
    
    function updateImage(divID, arr){
        var div = $("#" + divID);
        div.empty();
        for(var i=0; i< arr.length; i++){
            div.append('<img src="assets/images/Letters/'+arr[i].toUpperCase()+'.jpg">');
        }
    };
    
    function loadNextWord(){
        setTimeout(function() {
            
            $.get("/app/game", 
                function(data){
                    $(".jumbotron").empty();
                    $(".jumbotron").append(data);
                    
                    $(document).ready(function() {
                        $("#result").empty();
                        var text = $("#scramble").val();
                        var arr = text.split('-');
                        updateImage("remain", arr);
                        remainChars = arr;
                        typedChars  = [];
                        
                        $("#submit").on("click", function(event){
                            var result = typedChars.join("");
                            $.get("/app/submit",{answer: result}, 
                                function(data){
                                    var status = data.status;
                                    var img = "";
                                    if(status == 1){
                                        img = "right";
                                        loadNextWord();
                                    } else {
                                        img = "wrong";
                                    }
                                    
                                    var div = $("#result");
                                    div.empty();
                                    div.append('<img src="assets/images/' + img + '.jpg">');
                                }
                            ,"json");
                        });
                        
                        $("#digits").countdown({
                            image: "assets/img/digits.png",
                            format: 'sss',
                            startTime: "120",
                            timerEnd: function() {
                                loadNextWord();
                            }
                        });
        
                    });
                }
            );
            
        }, 2000);
    };

});