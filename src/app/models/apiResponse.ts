export interface ApiResponse<T> {
    data: T | null, 
    message?: string,
    timestamp?: Date,
    statusCode: number
}