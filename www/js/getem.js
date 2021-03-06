var selected_ingredient_index = 0;

function scan_barcode(){
    window.plugins.barcodeScanner.scan(
            function(result) {
                                       if (result.cancelled){
                    //alert("the user cancelled the scan");
                                       }else{
                    get_barcode_data(result.text);
                                       }
            },
            function(error) {
                alert("scanning failed: " + error);
            },
            ["BarcodeOverlay"]
                        
    );
}

function get_barcode_data(barcode)
{
    if(Solve_Attempt(barcode))
    {
        View_Feedback();
    } else
    {
        jQT.goTo("#clueFail", "slideleft");
    }
}

//Returns true if the provided code solves the puzzle
Solve_Attempt = function(code)
{
	
    if(code)
	{
        var recipe = JSON.parse(localStorage.getItem("recipe"));
        var ingredient = recipe.ingredients[selected_ingredient_index];
        console.log(ingredient);
		if (ingredient.codes.some(function(element, index, array) {
			return element.code == code;
                                  })) {
            ingredient.solved = true;
            localStorage.setItem("recipe", JSON.stringify(recipe));
            return true;
        }
	}
    
    
    
	return false;
}


Select_Ingredient_By_Index = function(idx)
{
    var recipe = JSON.parse(localStorage.getItem("recipe"));
	if(idx < 0 || idx >= recipe.ingredients.length)
		return;
		
    selected_ingredient_index = idx;
	var Selected_Ingredient = recipe.ingredients[idx];
	if(!Selected_Ingredient.solved) {
        var i;
		for(i = 0; i < Selected_Ingredient.puzzles.length; i++)
            if(Selected_Ingredient.puzzles[i].source != "")
            {
                View_Puzzle(Selected_Ingredient.puzzles[i]);
                break;
            }
	} else {
		View_Result();
	}
}

Solve_PLU = function()
{
    localStorage.setItem("test", "solved");
    var recipe = JSON.parse(localStorage.getItem("recipe"));
    var ingredient = recipe.ingredients[selected_ingredient_index];
    var plu = parseInt($("#pluField").text());
    console.log("looking for "+plu);
    var i;
    for(i = 0; i < ingredient.codes.length; i++)
    {
        console.log("testing against "+ingredient.codes[i].code);
        if(parseInt(ingredient.codes[i].code) == plu) {
            //Solved
            ingredient.solved = true;
            localStorage.setItem("recipe", JSON.stringify(recipe));
            View_Feedback();
            break;
        }
    }
    if(i >= ingredient.codes.length)
        jQT.goTo("#clueFail");
    
    
    $("#pluField").html("");
    
    
}