class Ball{
    constructor(){
        //Position and Velocity
        this.xPos = 360;
        this.yPos = 400;
        this.xVel = 0;
        this.yVel = 0;

        //Attributes
        this.radius = 10;
        this.airResist = 0.99;
        this.gravityDamp = 0.5;
        this.slow = 1;
        this.defColor = '#fc7765';
        this.hitColor = '#bf7000';

        //Movement
        this.onGround = false;
        this.isHit = false;
    }

    updateVel(gravity){
        if (this.slow == 1){
            this.xVel *= this.airResist;
            if (this.yVel > 0){
                this.yVel *= this.airResist;
            }
        }
        this.yVel -= (gravity*this.gravityDamp)*this.slow;
    }

    updatePos(){
        this.xPos += this.xVel*this.slow;
        this.yPos += this.yVel*this.slow;
    }

    bounds(width,height){
        if (this.xPos-this.radius < 0){
            this.xPos = this.radius;
            this.xVel = -this.xVel;
        }
        else if (this.xPos+this.radius > width){
            this.xPos = width - this.radius;
            this.xVel = -this.xVel;
        }
        if (this.yPos-this.radius < height){
            this.yPos = height+this.radius;
            this.yVel = -this.yVel;
            this.onGround = true;
        }
        else {
            this.onGround = false;
        }
    }

    draw(ctx,h){
        ctx.beginPath();
        ctx.arc(this.xPos,h-this.yPos, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.defColor;
        ctx.fill();
        ctx.closePath();
    }
}