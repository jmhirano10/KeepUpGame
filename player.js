class Player{
    constructor(){
        //Position and velocity
        this.xPos = 350;
        this.yPos = 280;
        this.xVel = 0;
        this.yVel = 0;

        //Attributes
        this.width = 20;
        this.height = 40;
        this.speed = 4;
        this.maxSpeed = 8;
        this.curColor = '#26baff';

        //Jump variables
        this.airSpeed = 1;
        this.maxFall = -30;
        this.jumpVel = 20;
        this.onGround = false;

        //Fall variables
        this.isCrouch = false;
        this.croSpeed = 0.5;
        this.croHeight = 30;
        this.regHeight = 40;

        //Dash variables
        this.dashVel = 25;
        this.dashTime = 0;
        this.dashLen = 5;
        this.dashCoolDown = 100;
        this.dashing = false;
        this.canDash = true;

        //attack variables
        this.attackDis = 50;
        this.attackDir = 0;
        this.attackTime = 0;
        this.attackLen = 10;
        this.attackCoolDown = 30;
        this.canAttack = true;

        //Freeze variables
        this.slowTime = 0;
        this.slowLen = 100;
        this.slowCoolDown = 200;
        this.canSlow = true;
    }

    //Sets horizontal velocity of player
    updateHorzVel(dir,shiftPressed){
        //Starts dash sequence of player
        if (dir != 0 && shiftPressed && this.canDash){
            this.xVel = dir*this.dashVel;
            this.yVel = 0;
            this.dashing = true;
            this.canDash = false;
            this.dashTime = 0;
        }
        //Update dash
        else if (!this.canDash){
            if (this.dashTime > this.dashCoolDown){
                this.canDash = true;
            }
            else if (this.dashTime > this.dashLen && this.dashing){
                this.dashing = false;
                this.xVel = 0;
            }
            
            this.dashTime += 1;
        }
        //Horizontal movement
        if (!this.dashing){
            if (this.onGround){
                if (dir == 0 || dir*this.xVel < 0 ){
                    this.xVel = 0;
                }
                else {
                    this.xVel += dir*this.speed;
                }
            }
            //In air movement
            else {
                this.xVel += dir*this.airSpeed;
            }
            //Check max speed
            if (Math.abs(this.xVel) > this.maxSpeed){
                this.xVel = dir*this.maxSpeed;
            }
        }
    }

    //Sets vertical velocity of player
    updateVertVel(jumpPressed,downPressed,gravity){
        //Crouching
        if (downPressed && !this.isCrouch){
            this.height = this.croHeight;
            this.yPos -= this.regHeight - this.croHeight;
            this.speed *= this.croSpeed;
            this.maxSpeed *= this.croSpeed;
            this.isCrouch = true;
        }
        else if (!downPressed && this.isCrouch){
            this.height = this.regHeight;
            this.yPos += this.regHeight - this.croHeight;
            this.speed /= this.croSpeed;
            this.maxSpeed /= this.croSpeed;
            this.isCrouch = false;
        }

        //Starts jump sequence of player
        if (this.onGround && jumpPressed && !this.dashing){
            this.yVel = this.jumpVel;
            this.onGround = false;
        }
        //Set gravity
        else if (!this.onGround && !this.dashing){
            if (downPressed){
                gravity *= 2;
            }
            this.yVel -= gravity;
            if (this.yVel < this.maxFall){
                this.yVel = this.maxFall;
            }
        }
    }

    bounds(width){
        if (this.xPos < 0){
            this.xPos = 0;
            this.xVel = 0;
        }
        else if (this.xPos + this.width > width){
            this.xPos = width - this.width;
            this.xVel = 0;
        }
    }

    //Attack collision detection
    attackCollision(dir,b){
        if (b.yPos > this.yPos-this.height && b.yPos < this.yPos){
            if (dir == 1){
                if (b.xPos > this.xPos+this.width && b.xPos < this.xPos+this.width+this.attackDis){
                    b.yVel = (this.xPos+this.width+this.attackDis-b.xPos)*0.3 + 5;
                    b.xVel = 10;
                    b.isHit = true;
                }
            }
            else if (dir == -1){
                if (b.xPos < this.xPos && b.xPos > this.xPos-this.attackDis){
                    b.yVel = (b.xPos-(this.xPos-this.attackDis))*0.3 + 5;
                    b.xVel = -10;
                    b.isHit = true;
                }
            }
        }
    }

    //Sets attack of player
    attack(dir,b){
        if (dir != 0 && this.canAttack){
            this.attackTime = 0;
            this.attackDir = dir;
            this.canAttack = false;
        }
        else if (!this.canAttack){
            if (this.attackTime > this.attackCoolDown){
                this.canAttack = true;
            }
            else if (this.attackTime < this.attackLen){
                this.attackCollision(this.attackDir,b);
            }
            this.attackTime += 1;
        }
    }

    slow(slowPressed,b){
        if (slowPressed && this.canSlow){
            this.slowTime = 0;
            this.canSlow = false;
            b.slow = 0.1;
        }
        else if (!this.canSlow){
            if (this.slowTime > this.slowCoolDown){
                this.canSlow = true;
            }
            else if (this.slowTime > this.slowLen){
                b.slow = 1;
            }
            this.slowTime += 1;
        }
    }

    //Sets the color based on cooldowns
    setColor(){
        if (!this.canDash && !this.canSlow){
            this.curColor = '#016a82';
        }
        else if (!this.canDash){
            this.curColor = '#006bc2';
        }
        else if (!this.canSlow){
            this.curColor = '#5b858f';
        }
        else {
            this.curColor = '#26baff'
        }
    }

    drawAttack(ctx,h,t,dir){
        let length = this.attackDis;
        if (t < 5){
            length = t*(this.attackDis/5);
        }
        ctx.beginPath();
        ctx.fillStyle = this.curColor;
        if (dir == 1){
            ctx.fillRect(this.xPos+this.width,h-this.yPos,length,this.height);
        }
        else if (dir == -1){
            ctx.fillRect(this.xPos-length,h-this.yPos,length,this.height);
        }
        ctx.closePath();
    }

    draw(ctx,h){
        this.setColor();
        if (this.attackTime < this.attackLen){
            this.drawAttack(ctx,h,this.attackTime,this.attackDir);
        }
        ctx.beginPath();
        ctx.fillStyle = this.curColor;
        ctx.fillRect(this.xPos,h-this.yPos,this.width,this.height);
        ctx.closePath();
    }
}