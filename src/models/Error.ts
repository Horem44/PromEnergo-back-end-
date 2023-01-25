export class Error {
    message!: string;
    status!: number;
    additionalInfo!: any;

    constructor(message: string, status: number = 500, additionalInfo: any = {}) {
        this.message = message;
        this.status = status;
        this.additionalInfo = additionalInfo
    }
}