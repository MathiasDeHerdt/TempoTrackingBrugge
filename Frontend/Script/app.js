
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
