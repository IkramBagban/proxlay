import { getAuth, requireAuth } from "@clerk/express";

export const authMiddleware = async (req: any, res: any, next: any) => {
    const authResult = await requireAuth();
    console.log("authResult", authResult);  
    //@ts-ignore
    if (authResult?.error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const auth = getAuth(req);
    if (!auth) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.auth = auth;
    next();
}