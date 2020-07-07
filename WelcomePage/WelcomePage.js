
/******************* global *******************/
const winH = window.innerHeight; // 画面の高さ
const winW = window.innerWidth; // 画面の高さ
const charTranY = 120; // 文字がずれていくベースの数字(px)
const animateChar = $("#top").children("i"); // スクロールのアニメーション対象
let charTop; // onloadで初期化
let charMinY = 0; // スクロールアニメーションで文字をずらす開始位置：オープニング後初期化
let charMaxY = 0; // スクロールアニメーションで文字をずらす終了位置：オープニング後初期化
let baseScrollPoint; // スクロール基準位置
let scrollDirFlg = true; // スクロールの背景色変更用フラグ（連続で同じ処理をしないように）
let menuFlg = false;

// 画面表示完了後の値で初期化
// これ必要？→オープニングの終わりで初期化してるから不要じゃない？ start
// $(window).on('load', function() {
//     charTop = $("main").offset().top;
//     charMinY = Math.floor(charTop - winH*.7);
//     charMaxY = Math.floor(charTop - winH*.1);
// });
// これ必要？→オープニングの終わりで初期化してるから不要じゃない？ End

/******************* function *******************/
// Opening Start
$(".op-button").on("click",function(){
    opening();
});
// 検証
// $(".hima12").on("click",function(){
//     $(".hima3").remove();
// });
// Menu Open and Close
$(".open-menu").on("click",function(){
    $(this).toggleClass("active");
    orignalSlideUp($(".open-menu"));
});

// スライドアップ式の表示・非表示切り替えメソッド
const orignalSlideUp = function(element){
    // hiddenクラスを持つ→表示する
    if(element.hasClass("isopen")){
        // クローズ時のアニメーションクラスを削除
        $(".target").removeClass("active");
        // スライドアップのアニメーション
        $(".target").addClass("inactive");
        // アニメーション後の処理
        setTimeout(function(){
            // 判定クラスの削除
            element.removeClass("isopen");
            // アニメーション後に削除
            $(".target").removeClass("inactive");
        },300);
    }else{
        // オープン時のアニメーションクラスを削除
        $(".target").removeClass("inactive");
        // スライドアップのアニメーション
        $(".target").addClass("active");
        // 判定クラスの追加
        setTimeout(function(){
            element.addClass("isopen");
        },400);

    
    }
};


/***************** 移動はスクロール Start ****************/ 
// オープニングアニメーション処理
// const opening = function(){
//     // ボタンアニメーション
//     $(".op-button").css("opacity","1").css("background","none").css("border", "black").css("transition","none");
//     $(".op-click").css("opacity","0").css("transition","none");
//     // ボタンの中の文字（Start）に対して時間差でアニメーションを適用する
//     $(".op-button #n1").addClass("neonLightning");  // S
//     $(".op-button #n2").addClass("neonLightning").css("animation-delay",".2s"); // t
//     $(".op-button #n3").addClass("neonLightning").css("animation-delay",".5s"); // a
//     $(".op-button #n4").addClass("neonLightning").css("animation-delay",".7s"); // r
//     $(".op-button #n5").addClass("neonLightning").css("animation-delay",".9s"); // t
    
//     // ボタン押下4秒後：オープニングページのスクロール防止を解除
//     $(".scrollStop").delay(4000).removeClass("scrollStop");

//     // ボタン押下4秒後：スクロールダウン（2秒かけて→終了時はボタン押下から6秒経過→openingEndをCall）
//     setTimeout(function(){
//         $("html,body").animate({
//             scrollTop:$("main").offset().top
//         },2000,"swing").promise().done(openingEnd);
//     },4000);
// };
// // オープニングアニメーション完了後にもろもろ初期化
// const openingEnd = function(){
//     $("body").addClass("scrollStop"); // IE,iOS対応
//     // オープニング部分の削除
//     $("#opening").remove();
//     $("#op-space").remove();
//     // スクロールアニメーションの初期化
//     charTop = $("#top").offset().top;
//     charMinY = Math.floor(charTop - winH*.7);
//     charMaxY = Math.floor(charTop - winH*.1);
//     $(".scrollStop").removeClass("scrollStop"); // IE,iOS対応
//     $("header").removeClass("hidden");
// };
/***************** 移動はスクロール End ****************/
/***************** 移動はトランスフォーム Start ****************/
// オープニングアニメーション処理
const opening = function(){
    // ボタンアニメーション
    $(".op-button").css("opacity","1").css("background","none").css("border", "black").css("transition","none");
    $(".op-click").css("opacity","0").css("transition","none");
    // ボタンの中の文字（Start）に対して時間差でアニメーションを適用する
    $(".op-button #n1").addClass("neonLightning");  // S
    $(".op-button #n2").addClass("neonLightning").css("animation-delay",".2s"); // t
    $(".op-button #n3").addClass("neonLightning").css("animation-delay",".5s"); // a
    $(".op-button #n4").addClass("neonLightning").css("animation-delay",".7s"); // r
    $(".op-button #n5").addClass("neonLightning").css("animation-delay",".9s"); // t
    
    // ボタン押下4秒後：オープニングページのスクロール防止を解除
    // $(".scrollStop").delay(4000).removeClass("scrollStop");

    // ボタン押下4秒後：スクロールダウン（2秒かけて→終了時はボタン押下から6秒経過→openingEndをCall）
    setTimeout(function(){
        // $("html,body").animate({
        //     scrollTop:$("main").offset().top
        // },2000,"swing").promise().done(openingEnd);
        // alert($("main").offset().top);
        $("body").addClass("tran2s").css("transform","translateY(-" + $("main").offset().top + "px)");
        setTimeout(function(){
            
            $("body").removeClass("tran2s").css("transform","translateY(0px)");
            openingEnd();
        },2000);
        
    },4000);
};
// オープニングアニメーション完了後にもろもろ初期化
const openingEnd = function(){
    $("body").addClass("scrollStop"); // IE,iOS対応
    // オープニング部分の削除
    $("#opening").remove();
    $("#op-space").remove();
    // スクロールアニメーションの初期化
    charTop = $("#top").offset().top;
    charMinY = Math.floor(charTop - winH*.7);
    charMaxY = Math.floor(charTop - winH*.1);
    $(".scrollStop").removeClass("scrollStop"); // IE,iOS対応
    $("header").removeClass("hidden");
};
/***************** 移動はトランスフォーム End ****************/



/******************* ColorObject *******************/
/* スクロールで背景色を徐々に変更しようと試みるも、cssのtransitionで解決したから不要 */
// // コンストラクタ
// const ColorObj = function(r,g,b){
//     this.red = r,
//     this.green = g,
//     this.blue = b
// };
// // 色の比較メソッド
// const hikaku = function(ColorObj1, ColorObj2){
//     const sabunRed = ColorObj1.red - ColorObj2.red;
//     const sabunGreen = ColorObj1.green - ColorObj2.green;
//     const sabunBlue = ColorObj1.blue - ColorObj2.blue;
//     return new ColorObj(sabunRed, sabunGreen, sabunBlue);
// };

// const backColorGoal = new ColorObj("175", "238", "238");
// let backColorStart = new ColorObj("255", "228", "225");
// let sabun = hikaku(backColorGoal,backColorStart);
// let sabun1 = hikaku(backColorGoal,backColorStart);
// console.log("sabun:" + sabun.red);
/******************* ColorObject *******************/

/******************* scroll event *******************/
$(window).scroll(function() {
    const currentY = Math.floor(window.scrollY); // スクロール位置

    // if(currentY > $("main").offset().top){
    //     console.log("aaaaaaaaaaaaaa");
    // }
    
    // スクロールとともに文字がずれる疑似アニメーション
    if(charMinY < currentY && currentY < charMaxY){
        animateChar.each(function(i,e){
            // それぞれの文字のずれる幅を計算
            var maxTranY = charTranY*$(e).attr("data-py");
            // 
            var per = ((currentY-charMinY)/(charMaxY-charMinY));
            $(e).css("transform", "translateY(" + Math.floor(maxTranY*per)*(-1) + "px)");
            $(e).css("opacity", 1-per);
        })
    }
    // 一定の位置で背景色を変化
    if(baseScrollPoint < currentY){
        // 基準位置の方が低い→スクロールダウン時
        if(charTop < currentY && scrollDirFlg){
            // charTopの位置を超えていたら
            $("body").removeClass("changeBgColorScrollUp");
            $("body").addClass("changeBgColorScrollDown");
            scrollDirFlg = false;
        }
    }else{
        // 基準位置の方が高い→スクロールアップ時
        if(charTop > currentY && !scrollDirFlg){
            // charTopの位置を超えていなかったら
            $("body").removeClass("changeBgColorScrollDown");
            $("body").addClass("changeBgColorScrollUp");
            scrollDirFlg = true;
        }

    }
    // スクロール基準位置を変更
    baseScrollPoint = currentY;
});