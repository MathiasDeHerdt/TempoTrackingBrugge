// #region ===== Filter  //

const ShowFilterType = (element) => {

    document.getElementById(element).addEventListener("click", async function()
    {
        document.getElementById("myNav").style.width = "0%";
        //console.log(`Er werd op ${element} geklikt`)
        filterType = element;
        //console.log(filterType)
        html_PokemonList.innerHTML =""

        nextcall ="https://pokeapi.co/api/v2/pokemon?limit=250"
        
    })
};


const FilterSelector = function()
{

    const div = document.querySelector(".overlay-content");

    var list = Array.prototype.slice.call(div.children)

    var typeList = []

    for(i = 0 ; i < 34; i++)
    {
        if(i%2 == 1){
            typeList.push(list[i].id)
        }
    }
    typeList.forEach(ShowFilterType);
};

// #endregion


// #region ==== DOM //
document.addEventListener('DOMContentLoaded', function() {

    // #region ===== Sidebar  //

    // width moet nog aangepast worden naar transform.
    document.getElementById("js-button-open").addEventListener("click",function(){
    document.getElementById("myNav").style.transform= "translateX(0)";
    });

    document.getElementById("js-option-close").addEventListener("click",function(){
    document.getElementById("myNav").style.transform= "translateX(-100%)";
    });
    // #endregion
    
});
// #endregion
