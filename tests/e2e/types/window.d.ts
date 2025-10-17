interface Window {
    authService: {
        state: {
            matches: (state: string) => boolean;
            value: string;
        };
        send: (event: string, payload?: any) => void;
        onTransition: (callback: (state: any) => void) => void;
    };
    Cypress?: boolean;
}