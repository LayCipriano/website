import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { useState } from "react"

export default function Contato() {
  const email = "contato@laycipriano.com.br"
  const link = "https://www.linkedin.com/in/lay-cipriano"
  const git = "https://github.com/LayCipriano"

  const [copiado, setCopiado] = useState(false)

  const copiarEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 1400)
    } catch (err) {
      console.error("Erro ao copiar o e-mail: ", err)
    } 
  }

  return (
    <div className="container">
      <div className="container-content-contato page-contato">
        <div className="center">
          <h1 className="glow-h1-effect">CONTATO</h1>
        </div>

        <div className="contato-card">
          <div className="contato-texto">
            <p>Gostou do que viu por aqui? Me chama, vamos conversar sobre nosso próximo projeto!</p>
          </div>

          <div className="contato-info">
            <div className="contato-email">
              <span className="label">E-mail</span>
              <span className="valor">{email}</span>
            </div>
          </div>

          <div className="contato-acoes">
            <button className="btn-contato" onClick={copiarEmail} type="button">
              {copiado ? "E-mail copiado ✓" : "Copiar e-mail"}
            </button>

            <a href={link} className="btn-contato btn-sec" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
            <a href={git} className="btn-contato btn-sec" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
          </div>
        </div>
        <div className="contato-rodape">
          Se preferir, manda um e-mail. Eu respondo rápido, prometo!
        </div>
      </div>
    </div>
  )
}