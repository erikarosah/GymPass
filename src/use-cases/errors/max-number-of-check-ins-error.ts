export class MaxNumberOdCheckInsError extends Error {
    constructor(){
        super('Max number of check-ins reached');
    }
}