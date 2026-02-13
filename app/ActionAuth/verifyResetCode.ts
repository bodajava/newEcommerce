"use server"

export default async function verifyResetCode(resetCode: string) {
    try {
        const res = await fetch(`${process.env.API}/auth/verifyResetCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resetCode }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in verifyResetCode:", error);
        return { status: "error", message: "Failed to verify reset code" };
    }
}
