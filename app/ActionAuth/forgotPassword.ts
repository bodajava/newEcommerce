"use server"

export default async function forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const apiUrl = `${process.env.API}/auth/forgotPasswords`;

    console.log(`[forgotPassword] Requesting reset for: ${normalizedEmail}`);

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: normalizedEmail }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error(`[forgotPassword] API Error ${res.status}:`, data);
            return {
                status: "error",
                message: data.message || `API Error ${res.status}`,
                fullData: data
            };
        }

        console.log(`[forgotPassword] Success:`, data);
        return data;
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return { status: "error", message: "Network error or invalid response from server" };
    }
}
