/****************** Scroll Event ******************/
$(window).scroll(function() {
    const currentY = Math.floor(window.scrollY); // スクロール位置
    const winH = window.innerHeight; // 画面の高さ
    const arts = $("div[class^='art-'] .wrapper");
    console.log(arts.length);
    arts.each(function(i,e){
        if(currentY + (winH*0.1) < $(e).offset().top && $(e).offset().top < currentY + (winH*0.7)){
            $(e).addClass("mainPosition");
        }else{
            $(e).removeClass("mainPosition");
        }
    })
    
});