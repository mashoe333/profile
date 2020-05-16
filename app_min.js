"use strict";
var app=function(){
    var t={
        html:document.getElementById("html"),
        body:document.body,
        navHome:$(".js-nav-home"),
        navWwa:$(".js-nav-wwa"),
        navProject:$(".js-nav-project"),
        navContact:$(".js-nav-contact"),
        header:"#js-header",
        footer:"#js-footer",
        btnMenu:"#js-btn-menu",
        menu:"#js-menu",
        menuBgL:"#js-menu-bg-l",
        menuBgR:"#js-menu-bg-r",
        sizeFit:".js-size-fit",
        url:document.URL,
        winW:window.innerWidth,
        winH:window.innerHeight,
        breakPoint:768,
        isDesktop:!0,
        pjaxState:!0,
        manuAnimating:!1,
        animationFrame:null,
        lang:null,
        easing:[.63,.04,.39,.99]
    },
    e={
        top:!!$(".page-top").length,
        project:!!$(".page-project").length,
        projectList:!!$("#js-project-area").length,
        projectDetail:!!$(".page-project-detail").length,
        Wwa:!!$(".page-who-we-are").length,
        contact:!!$(".page-contact").length
    };
    t.breakPoint>=t.winW&&(t.isDesktop=!1);
    var n={
        target:document.querySelector("#js-scroll"),
        mv:null,
        mvTypeWrap:null,
        mvType:null,
        mvTxt:null,
        mvBtn:null,
        parallaxImg:null,
        delta:0,
        lastY:0,
        velocity:.12,
        targetY:0,
        translateY:0,
        currentY:0,
        secH:0,
        anchorStart:null,
        footerStart:null,
        areaNav:null,
        areaNavRect:null,
        areaNavY:null
    },
    a=("onwheel"in document||document,{
        mvWrapW:.322*t.winW,
        mvWrapH:.906*t.winH,
        mvImgRatio:750/1120
    }),
    r={
        area:null,ttl:
        document.querySelectorAll(".js-project-ttl"),
        cell:null,
        target:0,
        rect:0,
        translateY:null,
        ttlTop:322
    },
    o={
        inTimeline:null,
        outTimeline:null
    },
    i={
        href:null,
        cont:null,
        lastElementClicked:null,
        offset:0,
        index:0,
        txt:null,
        projectAnimation:!1,
        loaderTxt:document.getElementById("js-loader-txt"),
        panel:{e:$("#js-panel"),t:0}
    },
    s={
        playground:document.getElementById("js-render"),
        ground:null,
        state:!0,
        animationFrame:null,
        imgPos:{
            x:0,
            y:0,
            dx:0,
            distX:0,
            scaleX:0
        },
        preview:null,
        filter:null,
        stage:null,
        renderer:null,
        ratio:400/300
    },
    l={
        target:null,
        panel:null
    },
    c={
        x:0,
        y:0,
        tx:0,
        ty:0,
        dx:0,
        dy:0,
        distX:0,
        distY:0,
        scaleX:null,
        scaleY:null,
        bounce:0,
        currentImg:"/resource/img/common/spacer.gif",
        ease:.1,
        current:0,
        isHover:!1,
        dot:{
            x:0,
            y:0,
            w:0,
            h:0
        }
    },
    u={
        init:function(){
            u.set(),
            u.update(),
            console.log("!-- resize init --!")
        },
        set:function(){
            t.winW=window.innerWidth,
            t.winH=window.innerHeight,
            a.mvWrapW=t.isDesktop?.322*t.winW:t.winW-40-.05*t.winW,a.mvWrapH=t.isDesktop?.906*t.winH:.78*t.winH,a.mvImgRatio=750/1120,$("body").hasClass("is-menu-open")||$("#js-menu-bg-l,#js-menu-bg-r").css("transform","translateY("+t.winH+"px)"),
            
            v.menu(),
            u.sizeCheck(),
            v.deviceCheck(),
            e.top&&u.mvCenter()
        },
        update:function(){
            $(window).off("resize"),
            $(window).on("resize",function(){
                t.winW=window.innerWidth,
                t.winH=window.innerHeight,
                t.breakPoint>t.winW?t.isDesktop&&(t.isDesktop=!1,cancelAnimationFrame(t.animationFrame),
                v.build(),
                console.log("!-- resize init --!")):t.isDesktop||(t.isDesktop=!0,cancelAnimationFrame(t.animationFrame),p.init(),
                v.build(),
                e.top&&$("#js-mv-type-wrap").attr("style",""),
                console.log("!-- resize init --!")),
                t.imgRatio=t.isDesktop?1680/1020:750/1100,
                t.videoRatio=1600/900,
                u.set()
            })
        },
        sizeCheck:function(){
            $(".js-size-check").length&&$(".js-size-check").each(function(e){
                var n=$(this),
                a=n.attr("src");
                void 0!==a&&!1!==a&&(-1==a.indexOf("_pc")||t.isDesktop?-1!=a.indexOf("_sp")&&t.isDesktop&&$(this).attr("src",$(this).attr("src").replace("sp","pc")):$(this).attr("src",$(this).attr("src").replace("pc","sp")))
            })
        },
        mvCenter:function(){
            t.sizeFit=".js-size-fit",
            a.mvImgRatio>a.mvWrapW/a.mvWrapH?$(t.sizeFit).css({
                position:"absolute",
                width:Math.floor(a.mvWrapH*a.mvImgRatio),
                height:a.mvWrapH,top:0,
                left:Math.floor(
                    (a.mvWrapW-a.mvWrapH*a.mvImgRatio)/2)
            }):
            $(t.sizeFit).css({
                position:"absolute",
                width:a.mvWrapW,height:Math.floor(a.mvWrapW/a.mvImgRatio),
                top:Math.floor((a.mvWrapH-a.mvWrapW/a.mvImgRatio)/2),left:0
            }),
            $("#js-mv-img").length&&$("#js-mv-img").css({width:a.mvWrapW,height:a.mvWrapH})
        }
    },
    p={
        init:function(){
            c.cursor=document.getElementById("js-cursor"),
            p.set()
        },
        set:function(){
            $(".js-hover").off("mouseenter mouseleave"),
            $(window).off("mousemove"),
            t.isDesktop&&$(window).on("mousemove",function(t){
                c.x=t.clientX,c.y=t.clientY
            })
        },
        scaleMap:function(t,e,n,a,r){
            return t<=a?e:t>=r?n:(n-e)/(r-a)*(t-a)+e
        }
    },
    d={
        init:function(){
            $("html,body").animate({scrollTop:0},10),
            document.body.classList.remove("is-head-hidden"),
            n.target=document.querySelector("#js-scroll"),
            n.targetY=0,
            n.translateY=0,
            n.currentY=0,
            n.secH=0,
            t.isDesktop&&($(window).on("scroll",function(a){
                n.targetY=$(a.currentTarget).scrollTop(),
                n.targetY>=n.secH-t.winH-160?e.contact||t.body.classList.add("is-head-hidden"):n.targetY>=60?(
                    t.body.classList.add("is-scrolled"),
                    t.body.classList.remove("is-head-hidden")
                    ):(
                    t.body.classList.remove("is-scrolled"),
                    t.body.classList.remove("is-head-hidden")
                    )
                }),
                $(window).on("scrollstart",function(){
                    $("html").addClass("is-scrolling")
                }).on("scrollstop",function(){
                    $("html").removeClass("is-scrolling")
                })
            ),
            e.top?(
                n.mv=document.getElementById("js-mv-img"),
                n.mvTypeWrap=document.getElementById("js-mv-type-wrap"),
                n.mvType=document.querySelectorAll(".js-mv-type"),
                n.mvTxt=document.getElementById("js-mv-txt"),
                n.mvBtn=document.getElementById("js-mv-btn")
                ):e.Wwa?(
                    n.parallaxImg=document.getElementById("js-parallax-img"),
                    n.anchorStart=document.getElementById("js-anchor-start"),
                    n.areaNav=document.getElementById("js-area-nav")
                    ):e.projectDetail&&(
                        n.parallaxImg=document.getElementById("js-parallax-img")
                        ),
            console.log("!-- scroll init --!")
        },
        observer:function(){
            var t=Array.from(
                document.querySelectorAll(".js-scroll-color")
                ),
                e=Array.from(
                    document.querySelectorAll(".js-scroll-in")
                    ),
                n=Array.from(
                    document.querySelectorAll(".js-video")
                    ),
                a={rootMargin:"-200px 0px"},
                r={rootMargin:"100px 0px"},
                o={rootMargin:"0px 0px"},
                i=new IntersectionObserver(d.observerColorCallback,a),
                s=new IntersectionObserver(d.observerInCallback,r),
                l=new IntersectionObserver(d.observerVideoCallback,o);
                t.forEach(function(t){
                    i.observe(t)
                }),
                e.forEach(function(t){
                    s.observe(t)
                }),
                n.forEach(function(t){
                    l.observe(t)
                })
        },
        observerColorCallback:function(e,n){
            e.forEach(function(e,n){
                if(e.isIntersecting){
                    var a=e.target.getAttribute("data-bg-color"),
                    r=e.target.getAttribute("data-txt-color");
                    t.html.style.backgroundColor=a,
                    t.html.style.color=r,
                    t.html.style.webkitTransition="background .4s linear",
                    t.html.style.transition="background .4s linear"
                }
            })
        },
        observerInCallback:function(t,e){
            t.forEach(function(t,n){
                t.isIntersecting&&(
                    t.target.classList.add("is-in"),
                    e.unobserve(t.target)
                )
            })
        },
        observerVideoCallback:function(e){
            var n=!0,
                a=!1,
                r=void 0;
            try{
                for(var o=void 0,i=e[Symbol.iterator]();!(n=(o=i.next()).done);n=!0){
                    var s=o.value,
                        l=s.target.getBoundingClientRect();
                        0<l.top&&l.top<t.winH||0<l.bottom&&l.bottom<t.winH||0>l.top&&l.bottom>t.winH?s.target.play():(
                            s.target.pause(),
                            s.target.currentTime=0
                        )
                }
            }catch(t){
                a=!0,
                r=t
            }finally{
                try{
                    n||null==i.return||i.return()
                }finally{
                    if(a)throw r
                }
            }
        },
        updateTop:function(){
            if(t.isDesktop||(n.targetY=-$("#js-scroll-wrap").offset().top),
                n.currentY+=(n.targetY-n.currentY)*n.velocity,
                n.secH=n.target.getBoundingClientRect().height-1,document.body.style.height=Math.floor(n.secH)+"px",
                n.translateY="translateY(-"+Math.floor(n.currentY)+"px) translateZ(0)",
                n.target.style.transform=n.translateY,
                n.mv.style.transform="translateY("+Math.floor(.3*n.currentY)+"px) translateZ(0)",
                n.mvBtn.style.transform="translateY("+Math.floor(.1*n.currentY)+"px) translateZ(0)",
                t.isDesktop){
                    n.mvTxt.style.transform="translateY(-"+Math.floor(.2*n.currentY)+"px) translateZ(0)",
                    n.mvTxt.style.opacity=1-.002*n.currentY;
                    for(var e=0;e<n.mvType.length;e++){
                        var a=n.mvType[e].getAttribute("data-col");
                        n.mvType[e].style.transform="translateY(-"+Math.floor(.3*n.currentY*a)+"px) translateZ(0)",
                        n.mvType[e].style.opacity=1-.002*n.currentY
                    }
            }else 
                n.mvTypeWrap.style.transform="translateY("+Math.floor(.2*n.currentY-.16*t.winW)+"px) translateZ(0) rotate(90deg)",
                n.mvTxt.style.transform="translateY(0px) translateZ(0)",
                n.mvTxt.style.opacity=1
        },
        updateProject:function(){
            t.isDesktop||(n.targetY=-$("#js-scroll-wrap").offset().top),
            n.currentY+=(n.targetY-n.currentY)*n.velocity,
            n.secH=n.target.getBoundingClientRect().height-1,document.body.style.height=Math.floor(n.secH)+"px",
            n.translateY="translateY(-"+Math.floor(n.currentY)+"px) translateZ(0)",
            n.target.style.webkitTransform=n.translateY,
            n.target.style.transform=n.translateY
        },
        updateProjectDetail:function(){
            t.isDesktop||(n.targetY=-$("#js-scroll-wrap").offset().top),
            n.currentY+=(n.targetY-n.currentY)*n.velocity,n.secH=n.target.getBoundingClientRect().height-1,
            document.body.style.height=Math.floor(n.secH)+"px",
            n.translateY="translateY(-"+Math.floor(n.currentY)+"px) translateZ(0)",
            n.target.style.webkitTransform=n.translateY,n.target.style.transform=n.translateY;
            var e=n.parallaxImg.getBoundingClientRect();
            if(t.winH>e.top&&e.bottom>0){
                var a="translateY("+-.15*e.top+"px) translateZ(0)";
                n.parallaxImg.style.webkitTransform=a,
                n.parallaxImg.style.transform=a
            }
        },
        updateWWA:function(){
            t.isDesktop||(n.targetY=-$("#js-scroll-wrap").offset().top),
            n.currentY+=(n.targetY-n.currentY)*n.velocity,
            n.secH=n.target.getBoundingClientRect().height-1,
            document.body.style.height=Math.floor(n.secH)+"px",
            n.translateY="translateY(-"+Math.floor(n.currentY)+"px) translateZ(0)",
            n.target.style.webkitTransform=n.translateY,
            n.target.style.transform=n.translateY,
            n.areaNavRect=n.anchorStart.getBoundingClientRect(),
            n.footerStart=document.getElementById("js-footer").getBoundingClientRect().top,t.winH/2+49>=n.footerStart-300?(
                n.areaNavY="translateY("+Math.floor(n.footerStart-398)+"px) translateZ(0)",
                n.areaNav.style.webkitTransform=n.areaNavY,n.areaNav.style.transform=n.areaNavY
                ):t.winH/2-49>=n.areaNavRect.top?(
                    n.areaNavY="translateY("+Math.floor(t.winH/2-49)+"px) translateZ(0)",
                    n.areaNav.style.webkitTransform=n.areaNavY,n.areaNav.style.transform=n.areaNavY
                    ):(
                        n.areaNavY="translateY("+Math.floor(n.areaNavRect.top)+"px) translateZ(0)",
                        n.areaNav.style.webkitTransform=n.areaNavY,
                        n.areaNav.style.transform=n.areaNavY
                    );
            var e=n.parallaxImg.getBoundingClientRect();
            if(t.winH>e.top&&e.bottom>0){
                var a="translateY("+-.15*e.top+"px) translateZ(0)";
                n.parallaxImg.style.webkitTransform=a,
                n.parallaxImg.style.transform=a
            }
        },
        updateContact:function(){
            t.isDesktop||(n.targetY=-$("#js-scroll-wrap").offset().top),
            n.currentY+=(n.targetY-n.currentY)*n.velocity,
            n.secH=n.target.getBoundingClientRect().height-1,
            document.body.style.height=Math.floor(n.secH)+"px",
            n.translateY="translateY(-"+Math.floor(n.currentY)+"px) translateZ(0)",
            n.target.style.webkitTransform=n.translateY,n.target.style.transform=n.translateY
        }
    },
    m={
        init:function(){
            m.set()
        },
        set:function(){
            if(e.projectList)
                $("#js-render canvas").length&&$("#js-render canvas").remove(),
                c.currentImg=void 0,
                s.renderer=PIXI.autoDetectRenderer(t.winW,t.winH,{transparent:!0}),
                r.area=document.getElementById("js-project-area"),
                r.cell=$(".js-project-cell"),
                m.listSet(),
                m.canvasSet();
            else if(e.projectDetail)
                m.ttlSet();
            else 
                for(var n=0;n<r.ttl.length;n++)
                    r.ttl[n].style.display="none",
                    r.ttl[n].style.color="currentColor"
        },
        listSet:function(){
            for(var t=0;t<r.ttl.length;t++)
                r.ttl[t].style.display="block",
                r.ttl[t].style.color="currentColor"
        },
        ttlSet:function(){
            r.target=$("#js-scroll-wrap").attr("data-ttl-target");
            for(var t=0;t<r.ttl.length;t++)
                parseInt(r.target)===t?(
                    r.ttl[t].style.display="block",r.ttl[t].style.color="currentColor"):
                    (r.ttl[t].style.display="none",r.ttl[t].style.color="currentColor")
        },
        canvasSet:function(){
            s.renderer.autoResize=!0,
            s.playground.appendChild(s.renderer.view),
            s.stage=new PIXI.Container,
            s.preview=PIXI.Sprite.fromImage("/resource/img/common/spacer.gif"),
            s.filter=new PIXI.filters.KawaseBlurFilter,
            s.filter.blur=1.5,
            s.filter.quality=6,
            s.filter.pixelSize.x=0,
            s.filter.pixelSize.y=0,
            s.preview.alpha=.8,
            s.stage.filters=[s.filter],
            s.stage.addChild(s.preview),
            m.getImg()
        },
        getImg:function(){
            r.cell.on("mouseenter mouseleave",function(t){
                var e=$(this);
                if("mouseenter"===t.type){
                    var n=e.find(".js-project-img").attr("src");
                    void 0===n&&(n="/resource/img/common/spacer.gif"),
                    s.preview.destroy(),
                    c.currentImg=n,
                    s.preview=PIXI.Sprite.fromImage(c.currentImg)
                }else if("mouseleave"===t.type){
                    s.preview.destroy(),
                    c.currentImg="/resource/img/common/spacer.gif",
                    s.preview=PIXI.Sprite.fromImage(c.currentImg)
                }
                s.stage.addChild(s.preview)
            })
        },
        updateCanvas:function(){
            void 0!==c.currentImg&&(
                s.imgPos.x+=.1*(c.x-s.imgPos.x),
                s.imgPos.y+=.1*(c.y-s.imgPos.y),
                s.imgPos.dx=c.x-s.imgPos.x,
                s.imgPos.distX=Math.sqrt(s.imgPos.dx*s.imgPos.dx),
                s.imgPos.scaleX=p.scaleMap(s.imgPos.distX,0,1,0,t.winW),
                s.preview.width=t.winW/4.5,
                s.preview.height=t.winW/4.5/s.ratio,
                s.preview.anchor.x=.5,
                s.preview.anchor.y=.5,
                s.preview.position.x=s.imgPos.x,s.preview.position.y=s.imgPos.y,
                s.filter.pixelSize.x=60*s.imgPos.scaleX,s.preview.alpha=.8,s.stage.addChild(s.preview),
                s.renderer.render(s.stage)
                )
        },
        updateList:function(){
            r.rect=r.area.getBoundingClientRect();
            for(var t=0;t<r.ttl.length;t++)
                r.translateY="translateY("+Math.floor(r.rect.top+38+138*t)+"px) translateZ(0)",
                r.ttl[t].style.webkitTransform=r.translateY,
                r.ttl[t].style.transform=r.translateY,r.ttl[t].setAttribute("data-y",Math.floor(r.rect.top+38+138*t))
        },
        updateDetail:function(){
            r.translateY="translateY("+(r.ttlTop-n.currentY)+"px) translateZ(0)",
            r.ttl[r.target].style.webkitTransform=r.translateY,
            r.ttl[r.target].style.transform=r.translateY
        }
    },
    g={
        init:function(){
            l.target=$(".js-clipboad"),
            l.panel=$("#js-success-panel"),
            g.set()
        },
        set:function(){
            function t(t){
                var e=document.createElement("div");
                e.appendChild(document.createElement("pre")).textContent=t;
                var n=e.style;
                n.position="fixed",
                n.left="-100%",
                document.body.appendChild(e),
                document.getSelection().selectAllChildren(e);
                var a=document.execCommand("copy");
                return document.body.removeChild(e),a
            }
            $(".js-clipboad").on("click",function(){
                $(this);
                t("info@meetsnew.com"),
                l.panel.addClass("is-in");
                anime({
                    targets:"#js-success-ico",
                    rotate:["-125deg","0deg"],
                    scale:[0,1],
                    opacity:[0,.2],
                    easing:[.63,.01,.37,1],
                    duration:2500,
                    complete:function(){
                        setTimeout(function(){
                            l.panel.removeClass("is-in")
                        },1400)
                    }
                })
            })
        }
    },
    f={
        init:function(){
            Barba.Pjax.init(),
            Barba.Prefetch.init(),
            f.set()
        },
        set:function(){
            var e=Barba.BaseView.extend({
                namespace:"page-top",
                onEnter:function(){},
                onEnterCompleted:function(){
                    $("#js-render").css("display","block")
                },
                onLeave:function(){},
                onLeaveCompleted:function(){
                    $("#js-render").css("display","none")
                }
            }),
            n=Barba.BaseView.extend({
                namespace:"page-project",
                onEnter:function(){},
                onEnterCompleted:function(){
                    $("#js-render").css("display","block")
                },
                onLeave:function(){},
                onLeaveCompleted:function(){
                    $("#js-render").css("display","none")
                }
            }),
            a=Barba.BaseView.extend({
                namespace:"page-project-detail",
                onEnter:function(){},
                onEnterCompleted:function(){},
                onLeave:function(){},
                onLeaveCompleted:function(){}
            }),
            s=Barba.BaseView.extend({
                namespace:"page-wwa",
                onEnter:function(){},
                onEnterCompleted:function(){},
                onLeave:function(){},
                onLeaveCompleted:function(){}
            });
            e.init(),
            n.init(),
            a.init(),
            s.init(),
            Barba.Dispatcher.on("linkClicked",function(e){
                if(
                    cancelAnimationFrame(t.animationFrame),
                    i.href=$(e).attr("href"),
                    i.cont="#js-pjax-container",
                    i.lastElementClicked=e,
                    $("body").hasClass("is-menu-open")&&(o.outTimeline.restart(),
                    setTimeout(function(){
                        $("body").removeClass("is-menu-open")
                    },1e3)),
                    $(e).hasClass("js-project-cell")){
                        i.index=$(e).index(),
                        i.offset=r.ttl[i.index].getAttribute("data-y"),
                        i.txt=r.ttl[i.index].innerText;
                        for(var n=0;n<r.ttl.length;n++)
                            i.index!=n&&(r.ttl[n].style.color="transparent");
                            i.projectAnimation=!0
                }else 
                    i.projectAnimation=!1;
                    $("html").addClass("op-hide");
                    $(e)
            }),
            Barba.Dispatcher.on("initStateChange",function(){}),
            Barba.Dispatcher.on("newPageReady",function(t,e,n){}),
            Barba.Dispatcher.on("transitionCompleted",function(){
                setTimeout(function(){
                    v.build()
                },600)
            });
            var l=Barba.BaseTransition.extend({
                start:function(){
                    Promise.all([this.newContainerLoading,this.fadeOut()])
                    .then(this.fadeIn.bind(this))
                },
                fadeOut:function(){
                    var t=Barba.Utils.deferred();
                    return c.fadeOut(t),t.promise
                },
                fadeIn:function(){
                    var t=this,
                    e=$(this.oldContainer),
                    n=$(this.newContainer);
                    c.fadeIn(e,n,t)
                }
            }),
            c={
                fadeOut:function(e){
                    if(i.projectAnimation){
                        anime({
                            targets:[r.ttl[i.index],
                            i.loaderTxt,
                            i.panel],
                            translateY:[i.offset,r.ttlTop],
                            t:[t.winH,0],
                            easing:t.easing,
                            duration:800,
                            begin:function(){
                                i.loaderTxt.innerText=i.txt
                            },
                            update:function(){
                                i.panel.e.css({
                                    clip:"rect("+i.panel.t+"px "+t.winW+"px "+t.winH+"px 0)"
                                })
                            },
                            complete:function(){
                                e.resolve()
                            }
                        })
                    }else{
                        anime({
                            targets:i.panel,t:[t.winH,0],
                            easing:t.easing,
                            duration:800,
                            begin:function(){
                                i.loaderTxt.innerText=""
                            },
                            update:function(){
                                i.panel.e.css({
                                    clip:"rect("+i.panel.t+"px "+t.winW+"px "+t.winH+"px 0)"
                                })
                            },
                            complete:function(){
                                e.resolve()
                            }
                        })
                    }
                },
                fadeIn:function(e,n,a){
                    e.hide(),
                    a.done();
                    var r=i.projectAnimation?100:600;
                    anime({
                        targets:i.panel,t:[t.winH,0],
                        easing:t.easing,
                        duration:800,
                        delay:r,
                        update:function(){
                            i.panel.e.css({
                                clip:"rect(0px "+t.winW+"px "+i.panel.t+"px 0)"
                            })
                        },
                        complete:function(){
                            $("html").removeClass("op-hide")
                        }
                    })
                }
            };
            Barba.Pjax.getTransition=function(){
                return l
            }
        },
        layerIn:function(){},
        layerOut:function(){}
    },
    v={
        init:function(){
            p.init(),
            u.init(),
            v.menu(),
            f.init(),
            v.opening()
        },
        build:function(){
            e.top=!!$(".page-top").length,
            e.project=!!$(".page-project").length,
            e.projectList=!!$("#js-project-area").length,
            e.projectDetail=!!$(".page-project-detail").length,
            e.Wwa=!!$(".page-who-we-are").length,
            e.contact=!!$(".page-contact").length,
            v.deviceCheck(),
            v.anchor(),
            v.navChange(),
            d.init(),
            d.observer(),
            m.init(),
            u.set(),
            t.body.classList.remove("is-scrolled"),
            t.body.classList.remove("is-head-hidden"),
            e.top?v.updatesTop():e.projectDetail?v.updatesProjectDetail():e.Wwa?v.updatesWWA():e.contact?(g.init(),v.updatesContact()):v.updatesProject()
        },
        navChange:function(){
            t.navHome.removeClass("is-current"),
            t.navWwa.removeClass("is-current"),
            t.navProject.removeClass("is-current"),
            t.navContact.removeClass("is-current"),
            e.top?t.navHome.addClass("is-current"):e.project?t.navProject.addClass("is-current"):e.Wwa?t.navWwa.addClass("is-current"):e.contact&&t.navContact.addClass("is-current")
        },
        opening:function(){
            var e=anime.timeline(),
            n=t.isDesktop?[
                {value:-68,duration:400},
                {value:-136,duration:400,delay:400},
                {value:-204,duration:400,delay:400},
                {value:-272,duration:400,delay:800}
            ]:[
                {value:-36,duration:400},
                {value:-72,duration:400,delay:400},
                {value:-108,duration:400,delay:400},
                {value:-144,duration:400,delay:800}
            ],
            a=0;
            setTimeout(function(){
                e.add({
                    targets:"#js-op-bg .path",
                    translateY:function(t,e){
                        return e%2==0?["100%","0%"]:["-100%","0%"]
                    },
                    easing:[.7,0,.3,.99],
                    duration:1400
                }).add({
                    targets:"#js-op-bg-wrap",
                    scale:[.7,1],
                    easing:[.7,0,.3,.99],
                    duration:1400,
                    offset:"-=1400"
                }).add({
                    targets:"#js-op-in",
                    translateY:[t.winH,0],
                    easing:[.05,.88,.36,1],
                    duration:2e3,
                    offset:"-=700"
                }).add({
                    targets:".js-rail-type",
                    translateY:n,
                    easing:[.51,.04,.32,.99],
                    offset:"-=300",
                    complete:function(){
                        v.build(),
                        setTimeout(function(){
                            anime({
                                targets:"#js-opening",
                                translateY:[0,-t.winH],
                                duration:1200,
                                easing:[.86,.01,.97,.67],
                                update:function(){
                                    a++,
                                    $("#js-op-bg-wrap").css({
                                        transform:"translate3d(0,-"+a+"px,0)"
                                    }),
                                    $("#js-op-in").css({
                                        transform:"translate3d(0,"+a+"px,0)"
                                    })
                                },
                                complete:function(){
                                    $("#js-opening").remove(),
                                    t.html.classList.remove("op-hide")
                                }
                            })
                        },
                        1e3)
                    }
                })
            },600)
        },
        deviceCheck:function(){
            $(".js-ua-check").length&&$(".js-ua-check").each(
                function(e){
                    var n=$(this),
                    a=n.attr("src");
                    void 0!==a&&!1!==a&&(-1==a.indexOf("_pc")||t.isDesktop?-1!=a.indexOf("_sp")&&t.isDesktop&&$(this).attr("src",$(this).attr("src").replace("sp","pc")):$(this).attr("src",$(this).attr("src").replace("pc","sp")))
                }
            )
        },
        anchor:function(){
            $(".js-anchor").off("click"),
            $(".js-anchor").on("click",function(e){
                e.preventDefault?e.preventDefault():e.returnValue=!1;
                var n=$(this).attr("data-href"),a="#"===n?0:$(n).offset().top,
                r=$("#js-scroll"),
                o=a-r.position().top;
                t.isDesktop?$("html,body").animate({scrollTop:a},800):r.stop().animate({scrollTop:r.scrollTop()+o},800)
            })
        },
        menu:function(){
            $(".no-barba").on("click",function(t){
                t.preventDefault();
                var e=$(this).attr("data-href");
                $.removeCookie("language"),
                $.cookie("language",e,{
                    expires:30,path:"/"
                }),
                location.href=e
            });
            var e=t.isDesktop?100:0;
            o.inTimeline=anime.timeline(),
            o.outTimeline=anime.timeline(),
            o.outTimeline.add({
                targets:".js-main-hide",
                translateY:["0px","-40px"],
                scale:[1,1.1],
                opacity:[1,0],
                duration:800,
                easing:t.easing,
                delay:function(t,e){
                    return 80*e
                }
            }).add({
                targets:".js-menu-hide",
                opacity:[.5,0],
                duration:400,
                easing:"linear",
                offset:"-=800"
            }).add({
                targets:[t.menuBgL,t.menuBgR],
                translateY:[0,-t.winH],
                duration:800,
                easing:t.easing,
                delay:function(t,n){
                    return n*e
                },
                offset:"-=800",
                complete:function(){
                    t.manuAnimating=!1
                }
            }),
            o.outTimeline.pause(),
            o.inTimeline.add({
                targets:[t.menuBgL,t.menuBgR],
                translateY:[t.winH,0],
                duration:800,
                easing:t.easing,
                delay:function(t,n){
                    return n*e
                }
            }).add({
                targets:".js-main-hide",
                translateY:["40px","0px"],
                scale:[1.1,1],
                opacity:[0,1],
                duration:800,
                easing:t.easing,
                delay:function(t,e){
                    return 80*e
                },
                offset:"-=900"
            }).add({
                targets:".js-menu-hide",
                opacity:[0,.5],
                duration:400,
                easing:"linear",
                offset:"-=600",
                complete:function(){
                    t.manuAnimating=!1
                }
            }),
            o.inTimeline.pause(),
            $(t.btnMenu).on("click",function(){
                t.manuAnimating||(t.manuAnimating=!0,$("body").hasClass("is-menu-open")?(
                    o.outTimeline.restart(),
                    setTimeout(function(){
                        $("body").removeClass("is-menu-open")
                    },1e3)):(
                    $("body").addClass("is-menu-open"),
                    o.inTimeline.restart())
                )
            })
        },
        updatesTop:function(){
            t.animationFrame=window.requestAnimationFrame(v.updatesTop),d.updateTop(),
            m.updateList(),
            m.updateCanvas()
        },
        updatesProject:function(){
            t.animationFrame=window.requestAnimationFrame(v.updatesProject),
            d.updateProject(),
            m.updateList(),
            m.updateCanvas()
        },
        updatesProjectDetail:function(){
            t.animationFrame=window.requestAnimationFrame(v.updatesProjectDetail),
            d.updateProjectDetail(),
            m.updateDetail()
        },
        updatesWWA:function(){
            t.animationFrame=window.requestAnimationFrame(v.updatesWWA),
            d.updateWWA()
        },
        updatesContact:function(){
            t.animationFrame=window.requestAnimationFrame(v.updatesContact),
            d.updateContact()
        },
        lang:function(){
            if("https://meetsnew.com/jp/"===t.url||"https://meetsnew.com/"===t.url){
                var e=$.cookie("language");
                "ja"===(window.navigator.languages&&window.navigator.languages[0]||window.navigator.language||window.navigator.userLanguage||window.navigator.browserLanguage)&&"https://meetsnew.com/jp/"!==t.url&&void 0===e?location.href="/jp/":"/"===e&&"https://meetsnew.com/"!==t.url?location.href=e:"/jp/"===e&&"https://meetsnew.com/jp/"!==t.url&&(location.href=e)
            }
        }
    };
    v.lang(),
    v.init()
}();