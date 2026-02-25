export default function Sobre() {
    return (
        <div className="container">
            <div className="container-content about-container">
                <div className="about">
                    <h1 className="glow-h1-effect">SOBRE</h1>
                    <h2 className="glow-h2-effect">Entre Suporte, Código e Propósito</h2>
                </div>

            <div className="about-sections">
                <section className="about-card">
                    <div className="about-title">AGORA</div>
                    <div className="about-text">
                        Analista de Suporte e Implantação • Dev Independente • Construindo projetos com foco em clareza e impacto
                    </div>
                </section>

                <section className="about-card">
                    <div className="about-title">STACK</div>
                    <div className="tech-tags">
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">Node</span>
                        <span className="tech-tag">Python</span>
                        <span className="tech-tag">PostgresSql</span>
                        <span className="tech-tag">Git</span>
                    </div>
                </section>

                <section className="about-card">
                    <div className="about-title">ASSINATURA</div>
                    <div className="about-text">
                        "Seja forte e corajosa!" <span style={{ opacity: .5 }}>- Josué 1:9</span>
                    </div>
                </section>
                </div>
            </div>
        </div>
    )
}
