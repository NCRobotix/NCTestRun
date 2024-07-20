class Movement {
    constructor(position, groundY, height, jumpPower, jumpHeight, gravity) {
        this.position = position;
        this.height = height;
        this.groundY = groundY;
        this.jumpPower = jumpPower;
        this.jumpHeight = jumpHeight;
        this.gravity = gravity;
    }

    // A method used to update player movement.
    update() {
        // If the player is jumping, 
        // move the player object up.
        if (this.isJumping)
            this.position.add(0, -this.jumpPower);

        // If the player has reached the maximum jump height,
        // set the jumping attribute to false.
        if (this.position.y <= this.groundY - this.jumpHeight)
            this.isJumping = false;

        // If the player is not jumping, but also is not grounded,
        // move the player down.
        if (!this.isJumping && !this.isGrounded())
            this.position.add(0, this.gravity);

        // If the player has reach or is below the ground position,
        // move the player to the ground position.
        if (this.position.y >= this.groundY - this.height) {
            this.position.y = this.groundY - this.height;
        }
    }

    // A method that starts the jumping behaviour.
    jump() {
        if (this.isGrounded())
            this.isJumping = true;
    }

    // A method that returns true if the object
    // is grounded.
    isGrounded() {
        return this.position.y == this.groundY - this.height;
    }
}

class Collider {
    constructor(position, w, h) {
        this.position = position;
        this.w = w;
        this.h = h;
    }

    // A method that can be used to check if the
    // collider overlaps with another collider.
    overlaps(other) {
        return this.position.x < other.position.x + other.w
            && this.position.x + this.w > other.position.x
            && this.position.y < other.position.y + other.h
            && this.position.y + this.h > other.position.y;
    }

    // A method that returns true if the collider 
    // overlaps with one in the list of colliders.
    overlapsWithOthers(others) {
        for (let i = 0; i < others.length; i++)
            if (this.overlaps(others[i]))
                return true;
        return false;
    }
}
