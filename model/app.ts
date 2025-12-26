export interface App {
    id: string;
    name: string;
    template: string;
    tier: number;
    activated: boolean;
    logs: string;
}

export interface AppFilter {
    userId: string;
}

export interface CreateAppRequest {
    name: string;
    template: string;
    tier: number;
    userId: string;
}

export interface CreateAppResponse {
    id: string;
}