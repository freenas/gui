export class SubmittedTask {
    public constructor(
        public taskId: number,
        public taskPromise: Promise<any>
    ) {}
}
