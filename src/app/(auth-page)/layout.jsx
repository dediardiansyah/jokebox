export const metadata = {
    title: "Sign in — Jokebox",
    description: "Authentication pages for Jokebox",
};

export default function AuthLayout({ children }) {
    const containerStyle = {
        minHeight: "calc(100dvh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "32px",
        // background: "linear-gradient(180deg,#071026 0%, #021018 100%)",
        // color: "var(--page-foreground, #e6eef8)",
    };

    const cardStyle = {
        width: "100%",
        maxWidth: 420,
        // background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: 28,
        boxShadow: "0 8px 32px rgba(2,6,23,0.6)",
    };

    const headerStyle = {
        position: "absolute",
        top: 20,
        left: 20,
        color: "var(--page-foreground, #e6eef8)",
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 0.2,
    };

    const footerStyle = {
        marginTop: 8,
        fontSize: 13,
        color: "rgb(191 191 191 / 60%)",
        // color: "rgba(230,238,248,0.6)",
    };

    return (
        <div style={containerStyle}>
            {/* <div style={headerStyle}>
                <a href="/" aria-label="Jokebox home" style={{ color: "inherit", textDecoration: "none" }}>
                    Jokebox
                </a>
            </div> */}

            <main style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                {/* <div style={cardStyle}> */}
                {children}
                {/* </div> */}
            </main>

            <footer style={footerStyle}>
                <small>By continuing you agree to the Jokebox terms and privacy.</small>
            </footer>
        </div>
    );
}