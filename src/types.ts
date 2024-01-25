export interface Prediction {
    status: 'starting' | 'processing' | 'succeeded',
    id: string,
    output: [string, string];
}