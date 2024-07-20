class Tree {
    constructor(position, trunkWidth, trunkHeight, crownRadius) {
        this.position = position;
        this.trunkWidth = trunkWidth;
        this.trunkHeight = trunkHeight;
        this.crownRadius = crownRadius;

        // Calculate width and height based on the
        // passed parameters.
        this.w = this.calculateWidth();
        this.h = this.calculateHeight();
    }

    // A method that returns the width based on
    // the width of the trunk and diameter of the crown.
    calculateWidth() {
        return (this.trunkWidth > this.crownRadius ? this.trunkWidth : this.crownRadius * 2);
    }

    // A method that returns the height based on
    // trunk height and crown diameter (radius * 2).
    calculateHeight() {
        return (this.trunkHeight + this.crownRadius * 2);
    }

    // A method that can be used to draw the tree.
    draw(ctx) {
        this.drawTrunk(ctx);
        this.drawCrown(ctx);
    }

    // A method that draws the trunk of the tree.
    drawTrunk(ctx) {
        const x = this.position.x + (this.w / 2) - (this.trunkWidth / 2);
        const y = this.position.y + (this.crownRadius * 2) - 1;

        ctx.beginPath();
        ctx.rect(x, y, this.trunkWidth, this.trunkHeight);
        ctx.fill();
        ctx.closePath();
    }

    // A method that draws the crown of the tree.
    drawCrown(ctx) {
        const x = this.position.x + this.w / 2;
        const y = this.position.y + this.crownRadius;

        ctx.beginPath();
        ctx.arc(x, y, this.crownRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    // A method that can be used to create a tree
    // without passing a point2D.
    static create(x, y, trunkWidth, trunkHeight, crownRadius) {
        const position = new Point2D(x, y);
        return new Tree(position, trunkWidth, trunkHeight, crownRadius);
    }
}

class Rock {
    constructor(position, noOfParts, w, h) {
        this.position = position;
        this.noOfParts = noOfParts;
        this.w = w;
        this.h = h;
    }

    // A method that can be used to draw the rock.
    draw(ctx) {
        for (let i = 0; i < this.noOfParts; i += .3) {
            // Find width and height.
            const w = this.w / (i + 1);
            const h = this.h / (i + 2);

            // Find x and y position.
            const x = this.position.x + (this.w - w) / 2;
            const y = this.position.y + h;

            // Draw rect.
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.fill();
            ctx.closePath();
        }
    }

    // A method that can be used to create a rock
    // without passing a point2D.
    static create(x, y, w, h, noOfParts) {
        const position = new Point2D(x, y);
        return new Rock(position, noOfParts, w, h);
    }
}
