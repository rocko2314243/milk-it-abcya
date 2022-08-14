/* ABCYA Preload CreateJS version 2.0 */

/**
 * Consists of PreloadScreen & Preload Bar
 * Dispatches "PRELOAD_CLICK" event to start game
 */
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
