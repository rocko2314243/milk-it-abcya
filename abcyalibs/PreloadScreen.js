/* ABCYA Preload CreateJS version 2.0 */

/**
 * Consists of PreloadScreen & Preload Bar
 * Dispatches "PRELOAD_CLICK" event to start game
 */


/* PRELOAD BAR */
(function (window) {

    window.abcya = window.abcya || {};

    function PreloadScreen() {
        this.Container_constructor();

        this.bg = null;
        this.logoPic = null;
        this.progressBar = null;
        this.btnGo = null;
        this.assetsSheet = null;
        this.isAdded = null;
        this.tickListener = null;
        this.setUpComplete = null;

        this.initialize();
    }

    PreloadScreen.prototype = createjs.extend(PreloadScreen, createjs.Container);

    PreloadScreen.prototype.initialize = function () {

        this.isAdded = false;
        this.setUpComplete = false;

        if (game.assets.preloadss) {
            this.assetsSheet = game.assets.preloadss;
        } else {
            this.assetsSheet = new createjs.SpriteSheet(game.assets.getAsset("preload-assets"));
        }

        //add font loading textfield under the background
        for (var i = 0; i < abcya.GameConfig.GAME_FONTS.length; i++) {
            var tempText = new createjs.Text(".", "18pt " + abcya.GameConfig.GAME_FONTS[i], "#000");
            this.addChild(tempText);
        }

        this.bg = new createjs.Shape(); // blue background
        var g = this.bg.graphics;
        g.beginFill("#66CCEC");
        g.drawRect(0, 0, game.screen_width, game.screen_height);
        this.addChild(this.bg);

        this.progressBar = new abcya.PreloadBar(this.assetsSheet);
        this.tickListener = createjs.Ticker.on("tick", this.updatePreloader, this);
    };

    PreloadScreen.prototype.setUpPreloader = function () {
        var g = this.bg.graphics;
        g.clear();
        g.beginFill("#8AC53F");
        g.drawRect(0, 0, game.screen_width, game.screen_height);

        this.logoPic = new createjs.Sprite(this.assetsSheet, "logo");
        this.logoPic.regX = this.logoPic.getBounds().width / 2;
        this.logoPic.regY = this.logoPic.getBounds().height / 2;

        this.logoPic.endScale = (abcya.GameConfig.GAME_ORIENTATION === "Portrait" && game.isWidescreen === true) ? .85 : 1;
        this.addChild(this.logoPic);
        this.addChild(this.progressBar);

        this.layoutRatio();

        this.logoPic.scaleY = this.logoPic.scaleX = 0;
        this.logoPic.alpha = 0;
        createjs.Tween.get(this.logoPic).to({
            scaleX: this.logoPic.endScale,
            scaleY: this.logoPic.endScale,
            alpha: 1
        }, 300, createjs.Ease.quadOut);

        this.setUpComplete = true;
    };

    PreloadScreen.prototype.setProgress = function (value) {
        if (this.progressBar) this.progressBar.setProgress(value);
    };

    PreloadScreen.prototype.addClick = function () {
        // if (game.isMobile) {
        //     this.progressBar.showNext();
        //     this.progressBar.on("click", this.startClick, this, true);
        // }else{
        //     if (this.tickListener) createjs.Ticker.off("tick", this.tickListener);
        //     this.tickListener = null;
        //     this.assetsSheet = null;
        //     this.logoPic = null;
        //     this.progressBar = null;
        //     this.dispatchEvent(new createjs.Event("PRELOAD_CLICK"));
        // }
			this.progressBar.showNext();

			// document.addEventListener('mousedown', function(e) {
			// 	this.startClick(e);
			// }.bind(this), false);
			this.progressBar.on("click", this.startClick, this, true);
    };

    PreloadScreen.prototype.startClick = function (e) {
        console.log("CLICKING");
        createjs.Ticker.off("tick", this.tickListener);
        this.tickListener = null;

        while (this.numChildren > 0) {
            this.removeChildAt(0);
        }

        this.assetsSheet = null;
        this.logoPic = null;
        this.progressBar = null;
        this.dispatchEvent(new createjs.Event("PRELOAD_CLICK"));

			//createjs.WebAudioPlugin.playEmptySound();
        createjs.Sound.play("nothing");
    };

    PreloadScreen.prototype.layoutRatio = function () {
        this.bg.x = 0;
        this.bg.y = 0;
        var g = this.bg.graphics;
        g.clear();
        g.beginFill("#8AC53F");
        g.drawRect(0, 0, game.screen_width, game.screen_height);

        if (this.progressBar && this.logoPic) {
            this.logoPic.x = game.screen_width / 2;
            this.logoPic.y = (game.screen_height / 2) - ((this.logoPic.getBounds().height / 2) * this.logoPic.endScale ) - 30;
            this.progressBar.x = game.screen_width / 2;
            this.progressBar.y = (game.screen_height / 2) + (this.progressBar.circleBg.getBounds().height / 2) + 30;
        }
    };

    PreloadScreen.prototype.updatePreloader = function (e) {

        if (this.isAdded === false && this.getStage() !== null && game.screen_width !== null) {
            this.isAdded = true;
            this.setUpPreloader();
        }

        if (this.setUpComplete === true) {
            if (this.progressBar) this.progressBar.tick(e);
            game.stage.update(e);
        }
    };

    window.abcya.PreloadScreen = createjs.promote(PreloadScreen, "Container");
}(window));


/* PRELOAD BAR */
(function (window) {

    function PreloadBar(assets) {
        this.Container_constructor();
        
        this.mousie = null;
        this.cheese = null;
        this.circleBg = null;
        this.progTxtContainer = null;
        this.spriteSheet = null;
        this.maxAngleDiff = 180;
        this.cheeseAngle = 0;
        this.progValue = null;
        this.progressComplete = null;

        this.initialize(assets);
    }


    PreloadBar.prototype = createjs.extend(PreloadBar, createjs.Container);
    PreloadBar.prototype.initialize = function (assets) {

        this.spriteSheet = assets;
        this.progressComplete = false;
        this.progValue = 0;
        this.cheeseAngle = 0;

        this.circleBg = new createjs.Sprite(this.spriteSheet, "circle");
        this.circleBg.regX = this.circleBg.getBounds().width/2;
        this.circleBg.regY = this.circleBg.getBounds().height/2;
        this.addChild(this.circleBg);
        this.circleBg.scaleX = this.circleBg.scaleY = 0;
        this.circleBg.alpha = 0;
        createjs.Tween.get(this.circleBg).to({scaleX:1,scaleY:1,alpha:1},600,createjs.Ease.elasticOut);

        var mousieAngle = this.cheeseAngle - (this.maxAngleDiff);

        this.mousie = new createjs.Sprite(this.spriteSheet, "mouse");
        this.mousie.regX = this.mousie.getBounds().width/2;
        var mousePt = this.getRotatedPoint(mousieAngle,this.circleBg.getBounds().width/2 + this.mousie.getBounds().height);
        this.mousie.x = mousePt.x;
        this.mousie.y = mousePt.y;
        this.mousie.rotation = Math.atan2(this.mousie.y,this.mousie.x) * 180/Math.PI + 90;
        this.mousie.curAngle = mousieAngle;
        this.addChild(this.mousie);


        this.cheese = new createjs.Sprite(this.spriteSheet,"cheese");
        this.cheese.regX = this.cheese.getBounds().width/2;
        var cheesePt = this.getRotatedPoint(this.cheeseAngle,this.circleBg.getBounds().width/2 + this.cheese.getBounds().height);
        this.cheese.x = cheesePt.x;
        this.cheese.y = cheesePt.y;
        this.cheese.rotation = Math.atan2(this.cheese.y,this.cheese.x) * 180/Math.PI + 90;
        this.addChild(this.cheese);


        this.progTxtContainer = new createjs.Container();
        this.progTxtContainer.txt = new createjs.BitmapText("0",this.spriteSheet);
        this.progTxtContainer.addChild(this.progTxtContainer.txt);
        this.addChild(this.progTxtContainer);
        this.alpha = 0;
    };

    PreloadBar.prototype.setProgress = function(value){
        this.alpha = 1;
        this.progValue = value;

    };

    PreloadBar.prototype.tick = function(tickEvent){
        if(this.progressComplete === false){
            this.cheeseAngle -= 7;
            if(this.cheeseAngle <= -180) this.cheeseAngle+=360;
            this.placeOnCircle(this.cheese,this.cheeseAngle);


            if(this.progValue > 0){
                var mousieAngle = this.cheeseAngle + (this.maxAngleDiff - (this.maxAngleDiff * this.progValue)) + 10;
                this.placeOnCircle(this.mousie,mousieAngle);

                this.progTxtContainer.txt.text = Math.round(this.progValue * 100).toString();

                this.progTxtContainer.txt.x = -(this.progTxtContainer.txt.getBounds().width/2);
                this.progTxtContainer.txt.y = -(this.progTxtContainer.txt.getBounds().height/2);

                if(this.progValue >= 1){
                    this.progressComplete = true;
                }
            }
        }

    };

    PreloadBar.prototype.showNext = function(showButton){
        if (showButton === void(0)) showButton = true;
        //catch cheese
        this.cheese.regY = this.cheese.getBounds().height/2;
        createjs.Tween.get(this.cheese).to({alpha:0,scaleX:1.5,scaleY:1.5},300,createjs.Ease.quadOut);
        var curMousieX = this.mousie.x;
        var curMousieY = this.mousie.y;
        var jumpPt = this.getRotatedPoint(this.mousie.curAngle,(this.circleBg.getBounds().width/2) + (this.mousie.getBounds().height * 2));

        createjs.Tween.get(this.mousie).wait(100).to({x:jumpPt.x,y:jumpPt.y},200,createjs.Ease.quadIn).to({x:curMousieX,y:curMousieY},200,createjs.Ease.quadOut).to({alpha:0},100);
        var tweentime = 100+200+100;
        tweentime += 10;
        //clear txt
        this.progTxtContainer.removeChild(this.progTxtContainer.txt);


        if (showButton) {
            var arrow = new createjs.Sprite(this.spriteSheet,"next-arrow");
            arrow.regX = arrow.getBounds().width/2;
            arrow.regY = arrow.getBounds().height/2;
            arrow.x = 15;
            arrow.scaleX = arrow.scaleY = 0;
            this.addChild(arrow);
            createjs.Tween.get(arrow).to({scaleX:1,scaleY:1},600,createjs.Ease.elasticOut);
        }

        return tweentime;
    };

    PreloadBar.prototype.placeOnCircle = function(circleObj,placeAngle){
        var circlePt = this.getRotatedPoint(placeAngle,this.circleBg.getBounds().width/2 + circleObj.getBounds().height);
        circleObj.x = circlePt.x;
        circleObj.y = circlePt.y;
        circleObj.rotation = Math.atan2(circleObj.y,circleObj.x) * 180/Math.PI + 90;
        circleObj.curAngle = placeAngle;
    };

    PreloadBar.prototype.getRotatedPoint = function(rotateAngle, radius) {
        var deg_to_rad = 0.0174532925;
        var px = radius * Math.cos(rotateAngle * deg_to_rad);
        var py = radius * Math.sin(rotateAngle * deg_to_rad);
        var point = new createjs.Point(px,py);
        return point;

    };

    window.abcya.PreloadBar = createjs.promote(PreloadBar, "Container");
}(window));