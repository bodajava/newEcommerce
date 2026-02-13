"use server"

export default async function resetPassword(payload: { email: string; newPassword: string }) {
    try {
        const res = await fetch(`${process.env.API}/auth/resetPassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return { status: "error", message: "Failed to reset password" };
    }
}
