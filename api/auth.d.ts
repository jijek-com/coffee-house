export declare function checkAuth(): Promise<boolean>;
export declare function signIn(login: string, password: string): Promise<void | {
    token: string;
}>;
export declare function signOut(): Promise<void>;
export declare function signUp(payload: {
    login: string;
    password: string;
    confirmPassword: string;
    city: string;
    street: string;
    houseNumber: number;
    paymentMethod: string;
}): Promise<void | {
    token: string;
}>;
//# sourceMappingURL=auth.d.ts.map