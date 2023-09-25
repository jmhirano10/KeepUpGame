class Map{
    constructor(x,y,w,h){
        this.xPos = x;
        this.yPos = y;
        this.width = w;
        this.height = h;
        this.playerOn = false;
    }
    
    updateYPos(e,yNew){
        if (e.yPos-e.height >= this.yPos && yNew-e.height < this.yPos){
            e.yVel = 0;
            e.onGround = true;
            this.playerOn = true;
            return this.yPos + e.height;
        }
        /*
        else if (e.yPos <= this.yPos-this.height && yNew > this.yPos-this.height){
            e.yVel = 0;
            return this.yPos - this.height;
        }*/
        else {
            return yNew;
        }
    }
    /*
    updateXPos(e,xNew){
        if (e.xPos+e.width <= this.xPos && xNew+e.width > this.xPos){
            e.xVel = 0;
            return this.xPos - e.width;
        }
        else if (e.xPos >= this.xPos+this.width && xNew < this.xPos+this.width){
            e.xVel = 0;
            return this.xPos + this.width;
        }
        else {
            return xNew;
        }
    }*/

    checkCollision(e,xNew,yNew){
        if (!e.onGround){
            this.playerOn = false;
        }
        //Vertical collision check
        if (e.xPos+e.width > this.xPos && e.xPos < this.xPos+this.width){
            if (xNew+e.width > this.xPos && xNew < this.xPos+this.width){
                yNew = this.updateYPos(e,yNew);
            }
            else if (this.playerOn){
                e.onGround = false;
                this.playerOn = false;
            }
        }
        
        //Horizontal collision check
        /*
        if (e.yPos-e.height < this.yPos && e.yPos > this.yPos-this.height){
            if (yNew-e.height < this.yPos && yNew > this.yPos-this.height){
                xNew = this.updateXPos(e,xNew);
            }
        }*/

        return [xNew,yNew];
    }

    draw(ctx,h){
        ctx.beginPath();
        if (this.playerOn){
            ctx.fillStyle = '#47ffdd';
        }
        else{
            ctx.fillStyle = '#02a687';
        }
        ctx.fillRect(this.xPos,h-this.yPos,this.width,this.height);
        ctx.closePath();
    }
}