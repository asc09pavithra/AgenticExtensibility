/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
export class LoginRequest {
    #pin;

    constructor(props) {
        props = props || {};
        if ('pin' in props) {
            this.pin = props.pin;
        }
    }

    get pin() { return this.#pin; }

    set pin(value) {
        this.#pin = value;
    }
}
