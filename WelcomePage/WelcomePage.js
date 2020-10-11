
/******************* global *******************/
const winH = window.innerHeight; // 画面の高さ
const winW = window.innerWidth; // 画面の高さ
const charTranY = 120; // 文字がずれていくベースの数字(px)
const animateChar = $("#top").children("i"); // スクロールのアニメーション対象
let charTop; // オープニング後に初期化
let charMinY = 0; // スクロールアニメーションで文字をずらす開始位置：オープニング後に初期化
let charMaxY = 0; // スクロールアニメーションで文字をずらす終了位置：オープニング後に初期化
let bgChangeBaseY_Down = 0; // スクロールダウンで背景色を変更する基準位置：オープニング後に初期化
let bgChangeBaseY_Up = 0; // スクロールアップで背景色を変更する基準位置：オープニング後に初期化
let profileY = 0; // スクロールダウンで表示するプロフィール部分の基準位置：オープニング後に初期化
let baseScrollPoint; // スクロール基準位置
let scrollDirFlg = true; // スクロールの背景色変更用フラグ（連続で同じ処理をしないように）
let displayProfileflg = false; // プロフィール表示フラグ（連続で同じ処理をしないように）

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
        // 非表示にする時間は表示する時間より早い方がスムーズに見える
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

    // ボタン押下2秒後：スクロールダウン（3秒かけて→終了時はボタン押下から5秒経過→openingEndをCall）
    setTimeout(function(){
        // 3秒かけてmainまでスクロール（正確にはbodyのtransform）
        $("body").addClass("tran3s").css("transform","translateY(-" + $("main").offset().top + "px)");
        // 3秒後に設定することで、スクロール後のタイミングで処理を実施する
        setTimeout(function(){
            // 他の処理もあるので、設定した部分は削除
            $("body").removeClass("tran3s").css("transform","translateY(0px)");
            openingEnd();
        },3000);
    },2000);
};
// オープニングアニメーション完了後にもろもろ初期化
const openingEnd = function(){
    // オープニング部分の削除
    $("#opening").remove();
    $("#op-space").remove();
    // スクロールアニメーションの初期化
    charTop = $("#top").offset().top;
    charMinY = Math.floor(charTop - winH*.7);
    charMaxY = Math.floor(charTop - winH*.1);
    bgChangeBaseY_Down = $(".baseY_Down").offset().top;
    bgChangeBaseY_Up = $(".baseY_Up").offset().top;
    profileY = $(".profile").offset().top;
    $(".scrollStop").removeClass("scrollStop"); // IE,iOS対応
    $("header").removeClass("hidden");
    // transformを初期化しないとHeaderのposition:fixedが効かない
    $("body").css("transform","");
};

/******************* scroll event *******************/
$(window).scroll(function() {
    const currentY = Math.floor(window.scrollY); // スクロール位置
    
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
    // プロフィール部分を表示
    if(!displayProfileflg){
        if(profileY - winH*0.85 < currentY){
            // 表示位置を超えていたら
            $(".profile").removeClass("defaultHidden");
            // removeClass処理を繰り返さないように
            displayProfileflg = true;
        }
    }
    // 一定の位置で背景色を変化
    if(baseScrollPoint < currentY){
        // 基準位置の方が低い→スクロールダウン時
        if(bgChangeBaseY_Down < currentY && scrollDirFlg){
            // charTopの位置を超えていたら
            $("body").removeClass("changeBgColorScrollUp");
            $("body").addClass("changeBgColorScrollDown");
            scrollDirFlg = false;
        }
    }else{
        // 基準位置の方が高い→スクロールアップ時
        if(bgChangeBaseY_Up > currentY && !scrollDirFlg){
            // charTopの位置を超えていなかったら
            $("body").removeClass("changeBgColorScrollDown");
            $("body").addClass("changeBgColorScrollUp");
            scrollDirFlg = true;
        }

    }
    // スクロール基準位置を変更
    baseScrollPoint = currentY;
});